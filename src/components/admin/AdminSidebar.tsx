"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    BarChart3,
    Store,
    Users,
    Star,
    FolderTree,
    ScrollText,
    MessageSquare,
    Megaphone,
    Flag,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Businesses",
        href: "/admin/businesses",
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
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
    },
    {
        title: "Activity Logs",
        href: "/admin/logs",
        icon: ScrollText,
    },
    {
        title: "Feedback",
        href: "/admin/feedback",
        icon: MessageSquare,
    },
    {
        title: "Announcements",
        href: "/admin/announcements",
        icon: Megaphone,
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: Flag,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.push("/auth/sign-in");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="h-screen w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col fixed left-0 top-0 z-40">
            <div className="p-6 border-b border-slate-800/50">
                <Link href="/" className="flex items-center group">
                    <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                        <img
                            src="/brand-logo.png"
                            alt="NeedFul"
                            className="h-12 w-auto object-contain"
                        />
                    </div>
                </Link>
            </div>

            <div className="flex-1 py-4 flex flex-col gap-0.5 px-3 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                                isActive
                                    ? "bg-[#FF5200] text-white shadow-lg shadow-orange-900/20"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-800/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
