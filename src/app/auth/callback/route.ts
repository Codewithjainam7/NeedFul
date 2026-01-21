import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/'

    if (code) {
        const supabase = await createClient()

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()

            if (user && (!user.user_metadata?.phone || !user.user_metadata?.city)) {
                return NextResponse.redirect(new URL('/complete-profile', requestUrl.origin))
            }

            return NextResponse.redirect(new URL(next, requestUrl.origin))
        }
    }

    // Return to login page if there's an error
    return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
}
