import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Key, 
  ExternalLink, 
  Mail, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Zap,
  Globe
} from "lucide-react";

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status");
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await fetch("/api/auth/url");
      const data = await response.json();
      const authWindow = window.open(data.url, "oauth_popup", "width=600,height=700");
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
          setIsAuthenticated(true);
          window.removeEventListener("message", handleMessage);
        }
      };
      window.addEventListener("message", handleMessage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-[#00E0FF]" />
          Platform Settings
        </h2>
        <p className="text-gray-400">Manage your NewsForge AI connections and API keys.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Blogger Connection */}
        <div className="p-8 rounded-3xl bg-[#121821] border border-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <img src="https://www.gstatic.com/images/branding/product/1x/blogger_48dp.png" alt="Blogger" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Google Blogger</h3>
            <p className="text-sm text-gray-500">
              Connect your Google account to authorize NewsForge AI to publish directly to your blogs.
            </p>
          </div>

          <div className="space-y-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 text-green-500 text-sm font-medium bg-green-500/5 p-3 rounded-xl border border-green-500/20">
                <CheckCircle2 className="w-4 h-4" />
                Connected to Google
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-500 text-sm font-medium bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" />
                Connection Required
              </div>
            )}
            
            <button 
              onClick={isAuthenticated ? handleLogout : handleConnect}
              className={cn(
                "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                isAuthenticated 
                  ? "bg-[#0B0F14] text-gray-400 hover:text-red-400 hover:bg-white/5 border border-white/5" 
                  : "bg-white text-[#0B0F14] hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              )}
            >
              {isAuthenticated ? <RotateCcw className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              {isAuthenticated ? "Disconnect Account" : "Connect with Google"}
            </button>
          </div>
        </div>

        {/* API Info */}
        <div className="p-8 rounded-3xl bg-[#121821] border border-white/5 space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00E0FF]/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#00E0FF]" />
            </div>
            <h3 className="text-xl font-bold text-white">API Configuration</h3>
            <p className="text-sm text-gray-500">
              NewsForge AI uses Gemini for intelligence and Serper for news search.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#0B0F14] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-300">Gemini Pro API</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 px-2 py-0.5 rounded bg-green-500/10 leading-none">Active</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0F14] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-300">Serper News API</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C3BFF] px-2 py-0.5 rounded bg-[#6C3BFF]/10 leading-none">System</span>
            </div>
          </div>

          <div className="pt-2">
            <a 
              href="https://ai.google.dev/" 
              target="_blank" 
              className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
            >
              Get your own API key
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

function SettingsIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}
