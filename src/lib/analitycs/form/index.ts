
interface NewsletterFormData {
    email: string;
    formId?: string;
}


export function sendNewsLetterFormEvent(data: NewsletterFormData) {
    if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('DataLayer is not available');
        return;
    }

    window.dataLayer = window.dataLayer || [];

    const eventData = {
        event: 'form_submission',
        form_id: data.formId || 'newsletter_subscription',
        form_data: {
            email: data.email,
            email_domain: data.email.split('@')[1] || '',
        },
        form_type: 'newsletter',
    };

    window.dataLayer.push(eventData);

    console.log('Newsletter subscription event sent to DataLayer:', eventData);
}