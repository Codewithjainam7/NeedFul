"use client";

import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        toast.info(`Searching for: "${searchQuery}"`, {
            description: "Global admin search is not yet connected to the backend."
        });
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <button
                        type="submit"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5200] transition-colors p-1"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5200]/30 focus:border-[#FF5200] w-64 transition-all"
                    />
                </form>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors group">
                    <Bell className="w-5 h-5 text-gray-500 group-hover:text-[#FF5200]" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF5200] rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5200] to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <span className="text-sm font-bold text-white">A</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
