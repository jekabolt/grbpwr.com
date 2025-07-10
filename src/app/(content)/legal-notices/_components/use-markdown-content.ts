import { useEffect, useState } from "react";

import { legalSections } from "./constant";

export interface MarkdownContentHook {
    content: string;
    loading: boolean;
    error: string | null;
}

export const useMarkdownContent = (filePath: string): MarkdownContentHook => {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Failed to fetch content: ${response.status}`);
                }
                const text = await response.text();
                setContent(text);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
                setError(errorMessage);
                setContent("Error loading content. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        if (filePath) {
            loadContent();
        }
    }, [filePath]);

    return { content, loading, error };
};

export function useAllLegalContent() {
    const privacyContent = useMarkdownContent(legalSections.privacy.file || "");
    const termsContent = useMarkdownContent(legalSections.terms.file || "");
    const termsOfSaleContent = useMarkdownContent(legalSections["terms-of-sale"].file || "");
    const legalNoticeContent = useMarkdownContent(legalSections["legal-notice"].file || "");
    const returnExchangeContent = useMarkdownContent(legalSections["return-exchange"].file || "");
    const cookiesContent = useMarkdownContent(legalSections.cookies.file || "");

    return {
        privacy: privacyContent,
        terms: termsContent,
        "terms-of-sale": termsOfSaleContent,
        "legal-notice": legalNoticeContent,
        "return-exchange": returnExchangeContent,
        cookies: cookiesContent,
    } as const;
} 
