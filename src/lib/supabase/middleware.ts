import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // Bypass for local UI preview if keys are placeholders or connection fails
    let user = null
    try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL &&
            !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase_project_url') &&
            !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project')) {
            const { data } = await supabase.auth.getUser()
            user = data.user
        }
    } catch (error) {
        console.warn('Supabase auth failed (local preview mode):', error)
    }

    // Protected routes
    const protectedRoutes = ['/dashboard', '/favorites']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirectTo', request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    // Force profile completion
    if (user && !request.nextUrl.pathname.startsWith('/complete-profile') && !request.nextUrl.pathname.startsWith('/auth') && !request.nextUrl.pathname.startsWith('/api')) {
        const phone = user.user_metadata?.phone
        const city = user.user_metadata?.city

        if (!phone || !city) {
            const url = request.nextUrl.clone()
            url.pathname = '/complete-profile'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
