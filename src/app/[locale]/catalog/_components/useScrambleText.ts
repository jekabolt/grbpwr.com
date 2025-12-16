import { useEffect, useState } from "react";

type UseScrambleOptions = {
    randomOnEmpty?: boolean;
    length?: number;
    reveal?: boolean;
};

export function useScrambleText(
    text = "",
    duration = 1000,
    options: UseScrambleOptions = {}
) {
    const { randomOnEmpty = false, length = 12, reveal = true } = options;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

    const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

    const baseText = text.trim() || (randomOnEmpty
        ? Array.from({ length }, getRandomChar).join("")
        : "");

    const scramble = (str: string, revealUpTo = 0) =>
        str
            .split("")
            .map((char, i) =>
                char === " " ? " " :
                    reveal && i < revealUpTo ? char :
                        getRandomChar()
            )
            .join("");

    const [displayText, setDisplayText] = useState(() =>
        baseText ? scramble(baseText) : ""
    );

    useEffect(() => {
        if (!baseText) {
            setDisplayText("");
            return;
        }

        let frame = 0;
        const totalFrames = duration / 30;

        const interval = setInterval(() => {
            const revealIndex = reveal ? Math.floor((frame / totalFrames) * baseText.length) : 0;
            setDisplayText(scramble(baseText, revealIndex));

            if (reveal && ++frame >= totalFrames) {
                setDisplayText(baseText);
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [baseText, duration, reveal]);

    return displayText;
}
