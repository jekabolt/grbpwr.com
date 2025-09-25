import { StateStorage } from 'zustand/middleware';

export const cookieStorage: StateStorage = {
    getItem: (name: string): string | null => {
        if (typeof window === 'undefined') return null;

        const value = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`))
            ?.split('=')[1];

        return value ? decodeURIComponent(value) : null;
    },

    setItem: (name: string, value: string): void => {
        if (typeof window === 'undefined') return;

        const cookieOptions = [
            `${name}=${encodeURIComponent(value)}`,
            'path=/',
            `max-age=${60 * 60 * 24 * 365}`,
            'SameSite=Lax'
        ];

        if (process.env.NODE_ENV === 'production') {
            cookieOptions.push('Secure');
        }

        document.cookie = cookieOptions.join('; ');
    },

    removeItem: (name: string): void => {
        if (typeof window === 'undefined') return;
        document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
    },
};
