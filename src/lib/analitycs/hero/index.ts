interface HeroEvent {
    heroType: string;
}


export function sendHeroEvent(data: HeroEvent) {
    if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('DataLayer is not available');
        return;
    }

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({ ecommerce: null });

    const eventData = {
        event: 'hero_click',
        hero_type: data.heroType,
    }

    window.dataLayer.push(eventData);

    console.log('Hero click event sent to DataLayer:', eventData);
}