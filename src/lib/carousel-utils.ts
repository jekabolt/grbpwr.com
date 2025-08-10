import { UseEmblaCarouselType } from "embla-carousel-react";

type EmblaApi = UseEmblaCarouselType[1];

export type WheelHandlerOptions = {
    enablePageScroll: boolean;
    loop: boolean;
    snapToPageTopOnUp?: boolean;
};

export type TouchHandlersOptions = {
    loop: boolean;
    bridgeToPageAtEdges?: boolean;
    snapToPageTopOnUp?: boolean;
};

const SCROLL_PROGRESS_EPSILON = 0.01; // tolerance for floating point rounding at edges
const HOT_AREA_PADDING_PX = 100; // allow a bit of leeway below the carousel

export const scrollPage = (direction: "up" | "down") => {
    const scrollAmount = window.innerHeight * 0.8;
    window.scrollBy({
        top: direction === "down" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
    });
};

function isWithinCarouselArea(y: number, rect: DOMRect): boolean {
    return y >= rect.top && y <= rect.bottom + HOT_AREA_PADDING_PX;
}

function shouldSnapToTopOnUp(
    enabled: boolean,
    upIntent: boolean,
    inCarouselArea: boolean,
    rectTop: number,
): boolean {
    if (!enabled) return false;
    if (!upIntent) return false;
    if (!inCarouselArea) return false;
    if (window.scrollY <= 0) return false;
    return rectTop < 0;
}

export function checkCarouselBounds(emblaApi: EmblaApi) {
    if (!emblaApi) return { isAtEnd: false, isAtStart: false };

    const canScrollNext = emblaApi.canScrollNext();
    const canScrollPrev = emblaApi.canScrollPrev();
    const progress = emblaApi.scrollProgress();

    const isAtEnd = !canScrollNext && progress >= 1 - SCROLL_PROGRESS_EPSILON;
    const isAtStart = !canScrollPrev && progress <= SCROLL_PROGRESS_EPSILON;

    return { isAtEnd, isAtStart };
}

export function createWheelHandler(
    emblaApi: EmblaApi,
    { enablePageScroll, loop, snapToPageTopOnUp = true }: WheelHandlerOptions,
) {
    return function onWheel(e: WheelEvent) {
        if (!emblaApi || !enablePageScroll) return;

        const rect = emblaApi.rootNode().getBoundingClientRect();
        const scrollingUp = e.deltaY < 0;
        const inCarouselArea = isWithinCarouselArea(e.clientY, rect);

        if (shouldSnapToTopOnUp(snapToPageTopOnUp, scrollingUp, inCarouselArea, rect.top)) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const { isAtEnd, isAtStart } = checkCarouselBounds(emblaApi);
        if (e.deltaY > 0 && isAtEnd && !loop) {
            e.stopPropagation();
            return;
        }
        if (e.deltaY < 0 && isAtStart && !loop) {
            e.stopPropagation();
            return;
        }

        e.preventDefault();
    };
}

export function createTouchHandlers(
    emblaApi: EmblaApi,
    { loop, bridgeToPageAtEdges = true, snapToPageTopOnUp = true }: TouchHandlersOptions,
) {
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
        touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
        if (!emblaApi) return;

        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        const swipeUp = deltaY > 0;
        const swipeDown = deltaY < 0;

        const rect = emblaApi.rootNode().getBoundingClientRect();
        const inCarouselArea = e.touches[0]
            ? isWithinCarouselArea(e.touches[0].clientY, rect)
            : true;

        if (shouldSnapToTopOnUp(snapToPageTopOnUp, swipeDown, inCarouselArea, rect.top)) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const canScrollNext = emblaApi.canScrollNext();
        const canScrollPrev = emblaApi.canScrollPrev();

        if (bridgeToPageAtEdges) {
            if (swipeUp && !canScrollNext && !loop) {
                e.preventDefault();
                scrollPage("down");
                return;
            }
            if (swipeDown && !canScrollPrev && !loop) {
                e.preventDefault();
                scrollPage("up");
                return;
            }
        }

        if ((swipeUp && canScrollNext) || (swipeDown && canScrollPrev)) {
            e.preventDefault();
            return;
        }
    };

    return { onTouchStart, onTouchMove };
}
