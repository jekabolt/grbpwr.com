import { useEffect, useState } from "react";

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
