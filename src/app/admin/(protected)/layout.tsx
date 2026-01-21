import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminBackground } from '@/components/admin/AdminBackground';
import { AdminChatboxWrapper } from '@/components/admin/AdminChatboxWrapper';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Auth check would go here if needed

    return (
        <div className="min-h-screen text-foreground flex relative">
            {/* Animated Background */}
            <AdminBackground />

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64 transition-all duration-300 relative z-10">
                <AdminHeader />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
            <AdminChatboxWrapper />
        </div>
    );
}
