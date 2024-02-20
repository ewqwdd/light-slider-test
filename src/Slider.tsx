import {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  WheelEvent as WheelEventReact,
} from "react";
import { useTrothling } from "./useThrotling";

interface Options {
  buttons?: boolean;
  leftArrow?: ReactNode;
  rightArrow?: ReactNode;
  progress?: boolean;
  hideScroll?: boolean;
  perPage?: number;
  dots?: boolean;
}

interface SliderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  config?: Options;
}

export default function Slider({ children, config, className, ...props }: SliderProps) {
  const { buttons, leftArrow, rightArrow, progress, hideScroll, perPage, dots } = config ?? {};
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const slider = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const preventDefault = useCallback((e: WheelEvent | TouchEvent) => {
    e.preventDefault();
  }, []);

  const mouseOver = useCallback(() => {
    document.addEventListener("wheel", preventDefault, { passive: false });
    setIsHovered(true);
  }, [preventDefault]);

  const mouseOut = useCallback(() => {
    document.removeEventListener("wheel", preventDefault);
    setIsHovered(false);
  }, [preventDefault]);

  const scrollToPage = useCallback((page: number) => {
    return () => {
      slider.current?.scrollTo({
        left: page * slider.current.offsetWidth,
      });
    };
  }, []);

  const scrollNext = useCallback(() => {
    slider.current?.scrollTo({
      left: slider.current.scrollLeft + slider.current.scrollWidth / slider.current.childNodes.length,
    });
  }, []);
  const scrollPrev = useCallback(() => {
    slider.current?.scrollTo({
      left: slider.current.scrollLeft - slider.current.scrollWidth / slider.current.childNodes.length,
    });
  }, []);
  const onWheel = useCallback(
    (e: WheelEventReact) => {
      if (isHovered) {
        if (
          e.deltaY > 0 &&
          Number(slider.current?.scrollLeft) + Number(slider.current?.clientWidth) ===
            slider.current?.scrollWidth
        ) {
          mouseOut();
        } else if (e.deltaY < 0 && slider.current?.scrollLeft === 0) {
          mouseOut();
        } else {
          slider.current?.scrollTo({
            left:
              slider.current.scrollLeft +
              ((slider.current.scrollWidth / slider.current.childNodes.length) * e.deltaY) / 100,
          });
        }
      }
    },
    [isHovered, mouseOut]
  );

  const optimizedWheel = useTrothling(onWheel, 100);

  let left = null;
  let right = null;
  if (buttons) {
    left = (
      <button className="arrow left" onClick={scrollPrev}>
        {leftArrow ?? "<"}
      </button>
    );
    right = (
      <button className="arrow right" onClick={scrollNext}>
        {rightArrow ?? ">"}
      </button>
    );
  }

  const sliderClassName = useMemo(() => {
    const classes = ["light_slider"];
    if (hideScroll) {
      classes.push("hide-scroll");
    }
    return classes.join(" ");
  }, [hideScroll]);

  const sliderStyle = useMemo<CSSProperties>(() => {
    const init: CSSProperties = {};
    if (perPage) {
      init.gridAutoColumns = 100 / perPage + "%";
    }
    return init;
  }, [perPage]);

  const pages = useMemo<number[]>(() => {
    if (!dots || !isMounted || !slider.current) return [];
    let pagesAmount = slider.current.scrollWidth / slider.current.offsetWidth;
    if (
      slider.current.scrollWidth - (pagesAmount - 1) * slider.current.offsetWidth <
      slider.current.offsetWidth * 0.2
    ) {
      pagesAmount--;
    }
    return new Array(Math.ceil(pagesAmount)).fill(0).map((_, index) => index);
  }, [isMounted, dots]);

  const onScroll = useCallback(() => {
    if (!slider.current) return;
    if (slider.current.scrollLeft + slider.current.offsetWidth >= slider.current.scrollWidth * 0.95) {
       return setPage(pages[pages.length-1])
    }
    const copy = [...pages].reverse();
    const found = copy.find(
      (elem) => elem * Number(slider.current?.offsetWidth) <= Number(slider.current?.scrollLeft)
    );
    setPage((prev) => found ?? prev);
  }, [pages]);

  const optimizedScroll = useTrothling(onScroll, 50);

  return (
    <div
      className={["light_slider_wrapper", className].join(" ")}
      onMouseOver={mouseOver}
      onMouseLeave={mouseOut}
      onWheel={optimizedWheel}
      {...props}
    >
      {left}
      <ul
        className={sliderClassName}
        ref={slider}
        style={sliderStyle}
        onScroll={dots ? optimizedScroll : undefined}
      >
        {progress && <div className="progress" />}
        {children}
      </ul>
      {right}
      {dots && (
        <div className="dot-wrapper">
          {pages.map((elem) => (
            <button
              onClick={scrollToPage(elem)}
              key={elem}
              className={"page-dot" + (page === elem ? " current" : "")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
