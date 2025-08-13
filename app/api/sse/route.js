import { NextResponse } from 'next/server'
import { subscribe } from '@/lib/sse-bus'

export const runtime = 'nodejs' // ensures proper streaming support

export const GET = async (request) => {
    const encoder = new TextEncoder()
    let closed = false
    let unsub = null
    let hbTimer = null

    const stream = new ReadableStream({
        start(controller) {
            const safeEnqueue = (text) => {
                if (closed) return
                try { controller.enqueue(encoder.encode(text)) } catch { }
            }

            // initial handshake
            safeEnqueue('retry: 10000\n')
            safeEnqueue(`event: hello\ndata: "connected"\n\n`)

            // subscribe to broadcast bus
            unsub = subscribe((payload) => {
                safeEnqueue(`event: message\ndata: ${payload}\n\n`)
            })

            // heartbeat (comments to keep connection alive)
            hbTimer = setInterval(() => {
                safeEnqueue(`:hb ${Date.now()}\n\n`)
            }, 15000)

            const close = () => {
                if (closed) return
                closed = true
                clearInterval(hbTimer)
                unsub && unsub()
                controller.close()
            }

            request.signal.addEventListener('abort', close)
        },
        cancel() {
            clearInterval(hbTimer)
            unsub && unsub()
            closed = true
        },
    })

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    })
}
