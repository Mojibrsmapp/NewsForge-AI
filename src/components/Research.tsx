import React, { useState } from "react";
import { Search, TrendingUp, ArrowRight, Loader2, Newspaper, ExternalLink, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface NewsItem {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
  imageUrl?: string;
}

export default function Research() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<NewsItem[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch("/api/news/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: query })
      });
      const data = await response.json();
      setResults(data.news || []);
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForge = (news: NewsItem) => {
    // Navigate to editor with news context
    navigate("/editor", { state: { newsContext: JSON.stringify(news) } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Search Section */}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-4xl font-bold tracking-tight text-white">Smart News Research</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Find the latest trending news across the web. We use Serper API to find 
          what's relevant right now.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a topic or keyword (e.g., Bangladesh Tech Projects)..."
          className="w-full bg-[#121821] border border-white/10 rounded-2xl px-6 py-5 pl-14 text-white focus:outline-none focus:ring-2 focus:ring-[#00E0FF]/50 transition-all text-lg group-hover:border-white/20"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-[#00E0FF] transition-colors" />
        <button 
          type="submit"
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-[#0B0F14] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 min-w-[120px] justify-center transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search News"}
        </button>
      </form>

      {/* Trending Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-xs font-mono text-gray-600 uppercase tracking-widest mr-2">Top Topics:</span>
        {["AI in BD", "Mobile Tech", "Startups", "SEO Tips", "Digital Marketing"].map(t => (
          <button 
            key={t}
            onClick={() => { setQuery(t); }}
            className="px-3 py-1.5 rounded-full bg-[#121821] border border-white/5 text-sm text-gray-400 hover:text-[#00E0FF] hover:border-[#00E0FF]/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <TrendingUp className="w-3 h-3" />
            {t}
          </button>
        ))}
      </div>

      {/* Results Section */}
      <div className="space-y-6 pt-10">
        <AnimatePresence mode="popLayout">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-3xl bg-[#121821] border border-white/5 hover:border-[#6C3BFF]/30 transition-all flex gap-6 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-8 h-8 text-[#6C3BFF]/20" />
                </div>

                {item.imageUrl && (
                  <div className="hidden md:block w-40 h-28 rounded-2xl transition-transform group-hover:scale-105 overflow-hidden flex-shrink-0">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[#00E0FF] uppercase tracking-wider px-2 py-0.5 rounded bg-[#00E0FF]/10">{item.source}</span>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#00E0FF] transition-colors line-clamp-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{item.snippet}</p>
                  
                  <div className="pt-4 flex items-center gap-4">
                    <button 
                      onClick={() => handleForge(item)}
                      className="flex items-center gap-2 bg-[#6C3BFF] hover:bg-[#6C3BFF]/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_15px_rgba(108,59,255,0.2)]"
                    >
                      <Sparkles className="w-4 h-4" />
                      Forge Article
                    </button>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5"
                    >
                      View Source
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          ) : !loading && (
            <div className="text-center py-20 bg-[#121821]/30 rounded-3xl border border-dashed border-white/10">
              <Newspaper className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Search for topics to see news results here.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
