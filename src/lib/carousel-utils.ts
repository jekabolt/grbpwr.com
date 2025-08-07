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
        const scrollingUp = deltaY < 0;
        const scrollingDown = deltaY > 0;
        const isAtStart = !emblaApi.canScrollPrev();
        const isAtEnd = !emblaApi.canScrollNext();
        const inCarouselArea =
            event instanceof WheelEvent
                ? event.clientY >= rect.top && event.clientY <= rect.bottom + 200
                : true;


        if (scrollingUp && inCarouselArea && window.scrollY > 0 && rect.top < 0) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if ((scrollingDown && isAtEnd) || (scrollingUp && isAtStart)) {
            event.preventDefault();
            scrollPage(scrollingDown ? "down" : "up");
        }
    };
};
