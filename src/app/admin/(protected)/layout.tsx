import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CustomCursor } from '@/components/ui/cursor';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ... (existing code) ...

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <CustomCursor />
            <AdminSidebar />
            <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                <AdminHeader />
                <main className="flex-1 p-6 overflow-y-auto bg-secondary/10">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
