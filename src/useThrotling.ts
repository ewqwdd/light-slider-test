import { useCallback, useRef } from "react"

export const useTrothling = <T extends unknown[]>(fn: ((...args: T) => void), time: number) => {
    const isBlocked = useRef<boolean>(false)

    const func = useCallback((...args: T) => {
        if (!isBlocked.current) {
            console.log(isBlocked.current)
            isBlocked.current = true
            fn(...args)
            console.log(isBlocked.current, time)
            setTimeout(() => {
                isBlocked.current = false
            }, time)
        }
    }, [fn, time])

    return func
}