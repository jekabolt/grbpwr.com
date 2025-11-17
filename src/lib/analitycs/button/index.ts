interface ButtonEventData {
    buttonId: string;
    productName: string;
}


export function sendButtonEvent(data: ButtonEventData) {
    if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('DataLayer is not available');
        return;
    }

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({ ecommerce: null });

    const eventData = {
        event: 'button_click',
        button_id: data.buttonId,
        product_name: data.productName
    }

    window.dataLayer.push(eventData);

    console.log('Button click event sent to DataLayer:', eventData);
}