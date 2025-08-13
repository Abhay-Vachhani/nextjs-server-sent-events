export const subscribers = new Set()

export const subscribe = (send) => {
    subscribers.add(send)
    return () => subscribers.delete(send)
}

export const publish = (payload) => {
    for (const send of [...subscribers]) {
        try { send(payload) } catch { }
    }
}