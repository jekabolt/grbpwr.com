
interface SizeSelectionEvent {
    sizeName: string;
    outOfStock: boolean;
}


export function sendSizeSelectionEvent(data: SizeSelectionEvent) {
    if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('DataLayer is not available');
        return;
    }

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({ ecommerce: null });

    const eventData = {
        event: 'size_selection',
        size_name: data.sizeName,
        size_status: data.outOfStock ? "out of stock" : "in stock",
    }

    window.dataLayer.push(eventData);

    console.log('Size selection event sent to DataLayer:', eventData);
}