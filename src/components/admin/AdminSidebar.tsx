"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Store,
    Users,
    Settings,
    LogOut,
    Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Businesses",
        href: "/admin/dashboard", // Temporarily pointing to dashboard, will update later if needed or split
        icon: Store,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Reviews",
        href: "/admin/reviews",
        icon: Star,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col fixed left-0 top-0 z-40 shadow-xl">
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5200] to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <span className="text-white font-bold text-xl">N</span>
                    </div>
                    <span className="text-xl font-bold text-white">NeedFul</span>
                </Link>
            </div>

            <div className="flex-1 py-6 flex flex-col gap-1 px-3">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-gradient-to-r from-[#FF5200] to-orange-600 text-white shadow-lg shadow-orange-500/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
