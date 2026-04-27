import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import cookieSession from "cookie-session";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(
    cookieSession({
      name: "session",
      keys: [process.env.SESSION_SECRET || "newsforge-secret-key"],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: true,
      sameSite: "none",
    })
  );

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.APP_URL}/auth/callback`
  );

  // Auth Routes
  app.get("/api/auth/url", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/blogger",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    res.json({ url });
  });

  app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      (req as any).session.tokens = tokens;
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Auth error", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.get("/api/auth/status", (req, res) => {
    res.json({ isAuthenticated: !!(req as any).session?.tokens });
  });

  app.post("/api/auth/logout", (req, res) => {
    (req as any).session = null;
    res.json({ success: true });
  });

  // News Search API (Serper)
  app.post("/api/news/search", async (req, res) => {
    const { q } = req.body;
    const apiKey = process.env.SERPER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "SERPER_API_KEY is not configured" });
    }

    try {
      const response = await fetch("https://google.serper.dev/news", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q, gl: "bd", hl: "bn" }), // Default to Bangladesh/Bangla if appropriate
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("News search error", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Blogger API Routes
  app.get("/api/blogger/blogs", async (req, res) => {
    const session = (req as any).session;
    if (!session?.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    oauth2Client.setCredentials(session.tokens);
    const blogger = google.blogger({ version: "v3", auth: oauth2Client });

    try {
      const response = await blogger.blogs.listByUser({ userId: "self" });
      res.json(response.data);
    } catch (error) {
      console.error("Blogger list error", error);
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  app.post("/api/blogger/publish", async (req, res) => {
    const session = (req as any).session;
    if (!session?.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { blogId, title, content, labels } = req.body;

    oauth2Client.setCredentials(session.tokens);
    const blogger = google.blogger({ version: "v3", auth: oauth2Client });

    try {
      const response = await blogger.posts.insert({
        blogId,
        requestBody: {
          title,
          content,
          labels,
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error("Blogger publish error", error);
      res.status(500).json({ error: "Failed to publish post" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
