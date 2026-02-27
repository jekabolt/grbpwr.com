import { pushCustomEvent } from "../utils";

interface HeroEvent {
    heroType: string;
}

export function sendHeroEvent(data: HeroEvent) {
    pushCustomEvent("hero_click", {
        hero_type: data.heroType,
    });
}