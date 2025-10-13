
interface NewsletterFormData {
    email: string;
    formId?: string;
    formLocation?: string;
    additionalData?: Record<string, any>;
}


export function sendNewsLetterFormEvent(data: NewsletterFormData) {
    if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('DataLayer is not available');
        return;
    }

    const eventData = {
        event: 'form_submission',
        form_id: data.formId || 'newsletter_subscription',
        form_data: {
            email: data.email,
            email_domain: data.email.split('@')[1] || '',
            ...data.additionalData
        },
        form_type: 'newsletter',
        form_location: data.formLocation || 'footer',
        submission_successful: true,
        timestamp: new Date().toISOString()
    };

    window.dataLayer.push(eventData);
}