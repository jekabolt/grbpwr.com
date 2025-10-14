
interface NewsletterFormData {
    email: string;
    formId?: string;
}


export function sendFormEvent(data: NewsletterFormData) {
    if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('DataLayer is not available');
        return;
    }

    window.dataLayer = window.dataLayer || [];

    const eventData = {
        event: 'form_submission',
        form_id: data.formId,
        form_data: {
            email: data.email,
            email_domain: data.email.split('@')[1] || '',
        },
    };

    window.dataLayer.push(eventData);

    console.log('Newsletter subscription event sent to DataLayer:', eventData);
}