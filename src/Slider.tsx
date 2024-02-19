import { ReactNode, WheelEvent, useCallback, useRef } from "react"
import { useTrothling } from "./useThrotling"

interface SliderProps {
    children?: ReactNode
    buttons?: boolean
    leftArrow?: ReactNode
    rightArrow?: ReactNode
}

export default function Slider({children, buttons, leftArrow, rightArrow}: SliderProps) {

    const slider = useRef<HTMLUListElement>(null)
    const scrollNext = useCallback(() => {
        slider.current?.scrollTo({
            left: slider.current.scrollLeft + slider.current.scrollWidth / slider.current.childNodes.length
        })
    }, [])
    const scrollPrev = useCallback(() => {
        slider.current?.scrollTo({
            left: slider.current.scrollLeft - slider.current.scrollWidth / slider.current.childNodes.length
        })
    }, [])
    const onWheel = useCallback((e: WheelEvent) => {
        
        slider.current?.scrollTo({
            left: slider.current.scrollLeft + (slider.current.scrollWidth / slider.current.childNodes.length * -e.deltaY / 100)
        })
    }, [])

    const optimizedWheel = useTrothling(onWheel, 200)

    let left = null
    let right = null
    if(buttons) {
            left = (
            <button className="arrow left" onClick={scrollPrev}>
                {leftArrow ?? '<'}
            </button>
            )
            right = (
            <button className="arrow right" onClick={scrollNext}>
                {rightArrow ?? '>'}
            </button>
            )
    }

  return (
    <div className="light_slider_wrapper" onWheel={optimizedWheel}>
        {left}
        <ul className="light_slider show-scroll" ref={slider}>
            {children}
        </ul>
        {right}
    </div>
  )
}
