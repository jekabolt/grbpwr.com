import { UseEmblaCarouselType } from "embla-carousel-react";

export const scrollPage = (direction: "up" | "down") => {
    const scrollAmount = window.innerHeight * 0.8;
    window.scrollBy({
        top: direction === "down" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
    });
};

export const createScrollHandler = (
    emblaApi: UseEmblaCarouselType[1] | undefined,
    containerRef: React.RefObject<HTMLDivElement | null>,
    bridgeTimeout: React.RefObject<NodeJS.Timeout | null>,
) => {
    return (event: WheelEvent | TouchEvent, deltaY: number) => {
        if (!emblaApi || !containerRef.current || bridgeTimeout.current) return;

        bridgeTimeout.current = setTimeout(() => {
            bridgeTimeout.current = null;
        }, 350);

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        const isTouch = event instanceof TouchEvent;
        // Wheel: positive => down. Touch: bottom->top (negative) => down per UX request
        const scrollingDown = isTouch ? deltaY < 0 : deltaY > 0;
        const scrollingUp = isTouch ? deltaY > 0 : deltaY < 0;

        // Use both progress and snap index for reliable edge detection
        const progress = emblaApi.scrollProgress();
        const snapCount = emblaApi.scrollSnapList().length;
        const selectedSnap = emblaApi.selectedScrollSnap();
        const isFirstSnap = selectedSnap <= 0;
        const isLastSnap = selectedSnap >= snapCount - 1;

        const NEAR_START = 0.05;
        const NEAR_END = 0.95;
        const nearStartByProgress = progress <= NEAR_START;
        const nearEndByProgress = progress >= NEAR_END;

        const isAtStart = isFirstSnap || nearStartByProgress;
        const isAtEnd = isLastSnap || nearEndByProgress || !emblaApi.canScrollNext();

        const inCarouselArea =
            event instanceof WheelEvent
                ? event.clientY >= rect.top && event.clientY <= rect.bottom + 200
                : event instanceof TouchEvent && event.touches[0]
                    ? event.touches[0].clientY >= rect.top && event.touches[0].clientY <= rect.bottom + 200
                    : true;

        // 1) When at boundaries, bridge to page scroll in the same direction
        if ((scrollingDown && isAtEnd) || (scrollingUp && isAtStart)) {
            event.preventDefault();
            scrollPage(scrollingDown ? "down" : "up");
            return;
        }

        // 2) If user scrolls up while carousel is pinned to top area and page has scroll, jump to page top
        if (scrollingUp && inCarouselArea && window.scrollY > 0 && rect.top < 0) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        // 3) Otherwise, let the browser handle normal scrolling
    };
};
