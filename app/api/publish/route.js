import { NextResponse } from 'next/server'
import { publish } from '@/lib/sse-bus'

export const runtime = 'nodejs'

export const GET = async (request) => {
    try {
        const url = new URL(request.url)

        const query = {}
        for (const [k, v] of url.searchParams.entries()) {
            query[k] = v
        }

        const headers = request.headers
        const info = {
            method: 'GET',
            ts: Date.now(),
            url: url.toString(),
            pathname: url.pathname,
            query,
            browser: {
                userAgent: headers.get('user-agent') || '',
                acceptLanguage: headers.get('accept-language') || '',
                referer: headers.get('referer') || '',
            },
            network: {
                ip:
                    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                    headers.get('x-real-ip') ||
                    '',
            },
        }

        publish(JSON.stringify({ type: 'publish', ...info }))

        return NextResponse.json({ type: 'publish', ...info }, { status: 200 })
    } catch {
        return new NextResponse(null, { status: 400 })
    }
}
