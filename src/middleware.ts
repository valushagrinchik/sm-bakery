import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const notAuth = !request.cookies.get('access_token')

    if (notAuth) return NextResponse.redirect(new URL('/login', request.url))

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|reset-password).*)',
    ],
}
