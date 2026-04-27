import React from "react";
import { 
  BarChart3, 
  Send, 
  CheckCircle2, 
  ArrowUpRight,
  Plus,
  RefreshCcw,
  Newspaper
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function Dashboard() {
  const stats = [
    { label: "Total Posts", value: "128", icon: Newspaper, color: "#00E0FF", trend: "+12%" },
    { label: "Google Indexed", value: "94", icon: CheckCircle2, color: "#6C3BFF", trend: "+5%" },
    { label: "Publish Success", value: "99.2%", icon: Send, color: "#10B981", trend: "Stable" },
    { label: "AI Tokens Used", value: "24.5k", icon: RefreshCcw, color: "#F59E0B", trend: "-2%" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back, Mojib!</h2>
          <p className="text-gray-400">Here's a snapshot of your NewsForge performance.</p>
        </div>
        <Link to="/research">
          <button className="flex items-center gap-2 bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-[#0B0F14] px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,224,255,0.3)]">
            <Plus className="w-5 h-5" />
            Forge New Article
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-[#121821] border border-white/5 hover:border-[#00E0FF]/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="p-3 rounded-xl bg-opacity-10" 
                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold",
                stat.trend.startsWith('+') ? "text-green-400" : "text-amber-400"
              )}>
                {stat.trend}
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold font-mono tracking-tighter text-white">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analysis Chart Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-[#121821] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BarChart3 className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Publishing Analytics</h3>
              <p className="text-gray-400 text-sm mb-8">Performance overview for the last 30 days.</p>
              
              {/* Dummy Chart Placeholder */}
              <div className="h-64 flex items-end gap-2 mb-4">
                {[45, 62, 53, 78, 92, 54, 76, 43, 88].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-[#00E0FF]/40 to-[#00E0FF]/10 hover:to-[#00E0FF]/60 rounded-t-lg transition-all duration-500 cursor-pointer"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs font-mono text-gray-600 uppercase tracking-widest px-2">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#121821] border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { type: 'publish', title: 'AI in Bangladesh Tech', time: '2m ago', state: 'Published' },
              { type: 'research', title: 'Serper API Updates', time: '1h ago', state: 'Draft' },
              { type: 'index', title: 'SEO Guide for Bloggers', time: '5h ago', state: 'Indexed' }
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 items-start group cursor-pointer">
                <div className="mt-1 w-2 h-2 rounded-full bg-[#00E0FF] shadow-[0_0_8px_#00E0FF]" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-300 group-hover:text-[#00E0FF] transition-colors">{activity.title}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">{activity.time} · <span className="text-[#6C3BFF]">{activity.state}</span></p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 rounded-xl border border-white/5 hover:bg-white/5 text-sm font-bold text-gray-400 transition-all uppercase tracking-widest">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
