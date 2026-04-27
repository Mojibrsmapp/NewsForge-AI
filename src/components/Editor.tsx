import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Sparkles, 
  Send, 
  Settings2, 
  ChevronRight, 
  Loader2, 
  BarChart, 
  Globe, 
  Tag, 
  Type as TypeIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateNewsArticle, analyzeSEO } from "@/src/lib/gemini";

interface Blog {
  id: string;
  name: string;
  url: string;
}

export default function Editor() {
  const location = useLocation();
  const [newsContext, setNewsContext] = useState(location.state?.newsContext || "");
  const [language, setLanguage] = useState<"Bangla" | "English">("Bangla");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [article, setArticle] = useState<{
    title: string;
    meta_description: string;
    slug: string;
    labels: string[];
    content_html: string;
  } | null>(null);

  const [seoScore, setSeoScore] = useState<any>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogger/blogs");
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.items || []);
        if (data.items?.length > 0) setSelectedBlogId(data.items[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  const handleForge = async () => {
    if (!newsContext) return;
    setLoading(true);
    setSuccess(null);
    try {
      const result = await generateNewsArticle(newsContext, language);
      setArticle(result);
      const seo = await analyzeSEO(result.content_html);
      setSeoScore(seo);
    } catch (error) {
      console.error("Forge error", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!article || !selectedBlogId) return;
    setPublishing(true);
    try {
      const response = await fetch("/api/blogger/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: selectedBlogId,
          title: article.title,
          content: article.content_html,
          labels: article.labels
        })
      });
      if (response.ok) {
        const data = await response.json();
        setSuccess(`Successfully published! Post ID: ${data.id}`);
      } else {
        throw new Error("Publish failed");
      }
    } catch (error) {
      console.error("Publish error", error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      {/* Left Input Section */}
      <div className="lg:w-1/3 space-y-6">
        <div className="p-6 rounded-2xl bg-[#121821] border border-white/5 space-y-6">
          <div className="flex items-center gap-2 text-[#00E0FF]">
            <Settings2 className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-widest text-xs">Configuration</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">News Context / Key</label>
              <textarea 
                value={newsContext}
                onChange={(e) => setNewsContext(e.target.value)}
                rows={4}
                placeholder="Paste news summary or keywords here..."
                className="w-full bg-[#0B0F14] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00E0FF]/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Language
                </label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full bg-[#0B0F14] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="Bangla">Bangla</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <TypeIcon className="w-3 h-3" /> Tone
                </label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-[#0B0F14] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="SEO Optimized">SEO Optimized</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleForge}
              disabled={loading || !newsContext}
              className="w-full bg-gradient-to-r from-[#00E0FF] to-[#6C3BFF] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,163,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 fill-white" /> Forge AI Article</>}
            </button>
          </div>
        </div>

        {seoScore && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-[#121821] border border-white/5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#F59E0B]">
                <BarChart className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-xs">SEO Analysis</h3>
              </div>
              <span className="text-2xl font-bold font-mono text-[#00E0FF]">{seoScore.score}%</span>
            </div>
            
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#00E0FF]" style={{ width: `${seoScore.score}%` }} />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Suggestions</p>
              <ul className="space-y-2">
                {seoScore.suggestions.slice(0, 3).map((s: string, i: number) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-2">
                    <ChevronRight className="w-3 h-3 text-[#00E0FF] flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Preview/Editor Section */}
      <div className="flex-1 min-h-[600px]">
        <AnimatePresence mode="wait">
          {!article ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center bg-[#121821]/30 border border-dashed border-white/10 rounded-3xl p-12 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#121821] flex items-center justify-center mb-6 border border-white/5">
                <FileIcon className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">No Article Generated</h3>
              <p className="text-gray-600 max-w-sm">Configure the settings on the left and click 'Forge' to start crafting your news post.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-[#121821] border border-white/5 rounded-3xl p-8 space-y-6">
                {/* Meta Inputs */}
                <div className="space-y-4 pb-6 border-b border-white/5">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Post Title</label>
                    <input 
                      type="text" 
                      value={article.title}
                      onChange={(e) => setArticle({...article, title: e.target.value})}
                      className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none placeholder:text-gray-700"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1"><Tag className="w-3 h-3" /> Labels</label>
                      <input 
                        type="text" 
                        value={article.labels.join(", ")}
                        onChange={(e) => setArticle({...article, labels: e.target.value.split(",").map(m => m.trim())})}
                        className="w-full bg-[#0B0F14] border border-white/5 rounded-xl px-4 py-2 text-sm text-gray-400 focus:outline-none"
                      />
                    </div>
                    <div className="w-1/3 space-y-2">
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Slug</label>
                      <input 
                        type="text" 
                        value={article.slug}
                        onChange={(e) => setArticle({...article, slug: e.target.value})}
                        className="w-full bg-[#0B0F14] border border-white/5 rounded-xl px-4 py-2 text-sm text-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Article Body (HTML)</label>
                  <div 
                    className="prose prose-invert max-w-none bg-[#0B0F14]/50 rounded-2xl p-6 min-h-[400px] border border-white/5 focus-within:border-[#00E0FF]/30 transition-all"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => setArticle({...article, content_html: e.currentTarget.innerHTML})}
                    dangerouslySetInnerHTML={{ __html: article.content_html }}
                  />
                </div>
              </div>

              {/* Publish Controls */}
              <div className="bg-gradient-to-r from-[#121821] to-[#1a202c] p-8 rounded-3xl border border-[#00E0FF]/20 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    Ready to Publish?
                    {success && <CheckCircle2 className="w-5 h-5 text-green-500 animate-bounce" />}
                  </h4>
                  <p className="text-sm text-gray-400">Select your Blogger destination and send it live.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  <select 
                    value={selectedBlogId}
                    onChange={(e) => setSelectedBlogId(e.target.value)}
                    className="flex-1 md:w-64 bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    {blogs.length > 0 ? (
                      blogs.map(b => <option key={b.id} value={b.id}>{b.name}</option>)
                    ) : (
                      <option disabled>No blogs found</option>
                    )}
                  </select>
                  <button 
                    onClick={handlePublish}
                    disabled={publishing || !selectedBlogId || !!success}
                    className="w-full md:w-auto flex items-center gap-2 bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-[#0B0F14] px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_4px_15px_rgba(0,163,255,0.3)]"
                  >
                    {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> {success ? "Published" : "Publish to Blogger"}</>}
                  </button>
                </div>
              </div>

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {success}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FileIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
  );
}
