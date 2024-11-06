import { useEffect } from 'react';
interface IUseDebounce {
    value: string | number;
    handle: any;
    delay: number;
    handleReset: any;
    startTime: number;
    timeLeft: number
}
// Hook
export const useDebounce = ({ value, handle, delay, handleReset, startTime, timeLeft }: IUseDebounce) => {
    useEffect(() => {
        if (value === 0 || timeLeft > 0) return;
        const handler = setTimeout(() => {
            handle(value, startTime);
            handleReset(0);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay, handle]);
}
