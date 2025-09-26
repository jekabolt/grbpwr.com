import { useEffect, useState } from "react";


export interface MarkdownContentHook {
    content: string;
    loading: boolean;
    error: string | null;
}

/**
 * Loads markdown content from one or more candidate paths.
 * If multiple paths are provided, the first successful response is used.
 */
export const useMarkdownContent = (
    filePathOrPaths: string | string[],
): MarkdownContentHook => {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);
            setContent("");

            const candidates = Array.isArray(filePathOrPaths)
                ? filePathOrPaths.filter(Boolean)
                : [filePathOrPaths].filter(Boolean);

            if (candidates.length === 0) {
                setContent("");
                setLoading(false);
                return;
            }

            let lastError: string | null = null;
            for (const path of candidates) {
                try {
                    const response = await fetch(path);
                    if (!response.ok) {
                        lastError = `Failed to fetch content: ${response.status}`;
                        continue;
                    }
                    const text = await response.text();
                    setContent(text);
                    setLoading(false);
                    setError(null);
                    return;
                } catch (err) {
                    lastError = err instanceof Error ? err.message : "Unknown error occurred";
                }
            }

            setError(lastError || "Unable to load content from provided paths");
            setContent("Error loading content. Please try again later.");
            setLoading(false);
        };

        loadContent();
    }, [JSON.stringify(filePathOrPaths)]);

    return { content, loading, error };
};
