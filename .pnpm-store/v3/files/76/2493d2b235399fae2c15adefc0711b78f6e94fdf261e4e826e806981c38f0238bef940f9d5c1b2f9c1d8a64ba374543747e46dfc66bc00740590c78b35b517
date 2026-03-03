interface DebounceCallback<CallbackArguments extends any[]> {
    (...args: CallbackArguments): void;
    cancel: () => void;
}
export default function useDebounceCallback<CallbackArguments extends any[]>(callback: (...args: CallbackArguments) => void, { leading, maxWait, wait, }: {
    leading?: boolean;
    maxWait?: number;
    wait?: number;
}): DebounceCallback<CallbackArguments>;
export {};
