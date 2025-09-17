import { useLocale } from 'next-intl';
import { headers } from 'next/headers';

export async function getCountry(): Promise<string> {
    const headersList = await headers();
    const country = headersList.get('x-country');
    const locale = headersList.get('x-locale');

    return country || locale || 'en';
}

export function useCountry(): string {
    const locale = useLocale();
    // For client components, we'll need to get country from URL or context
    // This is a simplified version - you might want to use a context provider
    return locale;
}
