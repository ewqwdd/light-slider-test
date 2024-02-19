import { useCallback, useRef } from "react"

export const useTrothling = <T extends unknown[]>(fn: ((...args: T) => void), time: number) => {
    const isBlocked = useRef<boolean>(false)

    const func = useCallback((...args: T) => {
        if (!isBlocked.current) {
            fn(...args)
            isBlocked.current = true
            setTimeout(() => {
                isBlocked.current = false
            }, time)
        }
    }, [fn, time])

    return func
}