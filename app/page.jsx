'use client'
import { useEffect, useState } from 'react'

const Page = () => {
    const [logs, setLogs] = useState([])

    useEffect(() => {
        const es = new EventSource('/api/sse')

        es.addEventListener('hello', (e) => {
            setLogs((l) => [...l, `hello: ${e.data}`])
        })

        es.addEventListener('message', (e) => {
            setLogs((l) => [...l, `message: ${e.data}`])
        })

        es.onerror = () => {
            setLogs((l) => [...l, 'error: connection lost'])
        }

        return () => es.close()
    }, [])

    return (
        <div style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'ui-sans-serif' }}>
            <h1>Next.js SSE Demo</h1>
            <p>Listening for events from <code>/api/sse</code>…</p>
            <pre style={{ background: '#111', color: '#0f0', padding: 12, minHeight: 200, borderRadius: 8, overflow: 'auto' }}>
                {logs.map((l, i) => `[${i.toString().padStart(3, '0')}] ${l}\n`)}
            </pre>
        </div>
    )
}

export default Page
