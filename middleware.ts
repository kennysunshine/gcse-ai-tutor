import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Helper to securely append CORS & Cache Control before returning
    const applySecurityHeaders = (res: NextResponse) => {
        const origin = request.headers.get('origin')
        const allowedOrigins = process.env.NODE_ENV === 'development' 
            ? ['http://localhost:3000', 'https://lumen-forge.co.uk'] 
            : ['https://lumen-forge.co.uk']

        if (origin && allowedOrigins.includes(origin)) {
            res.headers.set('Access-Control-Allow-Origin', origin)
            res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            res.headers.set('Access-Control-Allow-Credentials', 'true')
        }
        res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        return res
    }

    // Create an unmodified copy of the Supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

    const isTeacherRoute = request.nextUrl.pathname.startsWith('/teacher')
    const isProtectedStudentRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/sandbox')
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')

    // Performance Optimization: Only query the database for the user session 
    // if the route actually requires protection or auth redirection.
    if (!isTeacherRoute && !isProtectedStudentRoute && !isAuthRoute) {
        return applySecurityHeaders(supabaseResponse)
    }

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        // --- SCHOLARSHIP LOGIC ---
        // If the user logs in and meets criteria, automatically upgrade them to Foundry Scholar
        if (user && !user.user_metadata?.isPremium) {
            const email = user.email || '';
            const isScholarshipEligible = email.endsWith('.sch.uk') || email.includes('partnertrust');

            if (isScholarshipEligible) {
                // Secure server-side upgrade. This modifies the auth metadata.
                // In a full production app, this should also sync with the profiles table if role is stored there.
                await supabase.auth.updateUser({
                    data: {
                        isPremium: true,
                        role: 'scholar',
                        scholarship_granted_at: new Date().toISOString()
                    }
                });

                // Note: Auth cookies might not reflect this immediately in the *current* request cycle, 
                // but will on the next client navigation.
            }
        }
        // -------------------------

        // Redirect logged-in users away from auth pages
        if (user && isAuthRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        // Not logged in but trying to access a protected route
        if (!user && (isTeacherRoute || isProtectedStudentRoute)) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // If user is logged in, check their RBAC profile for the /teacher route
        if (user && isTeacherRoute) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            // Bouncer Step: If they aren't a teacher AND not in development mode, kick them back
            if (!profile || (profile.role !== 'teacher' && process.env.NODE_ENV !== 'development')) {
                const url = request.nextUrl.clone()
                url.pathname = '/dashboard'
                return NextResponse.redirect(url)
            }
        }
    } catch (error) {
        console.error('Middleware Auth Error:', error)
        // Fail securely: if auth verification fails, don't let them into protected routes
        if (isTeacherRoute || isProtectedStudentRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    return applySecurityHeaders(supabaseResponse)
}

// Ensure the middleware is only called for relevant paths.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
