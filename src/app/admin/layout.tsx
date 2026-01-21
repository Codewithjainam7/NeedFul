import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // Check if user has admin role
    const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

    // Type assertion to fix build error
    const profile = userProfile as { role: string } | null;

    if (!profile || profile.role !== 'admin') {
        // Optionally redirect to a "unauthorized" page or just home
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
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
