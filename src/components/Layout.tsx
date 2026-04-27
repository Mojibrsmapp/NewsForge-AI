import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Search, 
  FileEdit, 
  Settings, 
  LogOut, 
  Zap,
  TrendingUp,
  Globe
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Research", path: "/research", icon: Search },
    { name: "Editor", path: "/editor", icon: FileEdit },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F14] text-[#E6EDF3] font-sans selection:bg-[#00E0FF]/30 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#121821] bg-[#121821]/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E0FF] to-[#6C3BFF] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            NewsForge AI
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                location.pathname === item.path
                  ? "bg-gradient-to-r from-[#00E0FF]/10 to-transparent text-[#00E0FF] border-l-2 border-[#00E0FF]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                location.pathname === item.path ? "text-[#00E0FF]" : "text-gray-400"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-[#121821]">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-bottom border-[#121821] bg-[#121821]/30 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest bg-[#121821] px-3 py-1 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Context
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="w-4 h-4 text-[#00E0FF]" />
              <span className="font-medium text-gray-300">Trending:</span>
              <span className="hover:text-white cursor-pointer transition-colors underline decoration-[#00E0FF]/30 underline-offset-4">AI Tech in BD</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C3BFF] to-[#00E0FF] p-0.5">
              <div className="w-full h-full rounded-full bg-[#121821] flex items-center justify-center text-xs font-bold text-white">
                M
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-[#121821] scrollbar-track-transparent">
          {children}
        </div>
      </main>
    </div>
  );
}
