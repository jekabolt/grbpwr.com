"use client";

import { common_PaymentInsert } from "@/api/proto-http/frontend";
import { useEffect, useState } from "react";
import { TransactionStatus } from "./usePaymentActions";

interface Props {
    paymentData: common_PaymentInsert | undefined;
    currentStatus: TransactionStatus;
}


export const usePaymentTimer = ({ paymentData, currentStatus }: Props) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [timerStatus, setTimerStatus] = useState<TransactionStatus | null>(null);

    function resetTimer() {
        setProgressPercentage(0);
        setTimerStatus(null);
    }

    useEffect(() => {
        if (!paymentData?.expiredAt || currentStatus !== TransactionStatus.PENDING) return;

        const calculateTimeLeft = () => {
            const expirationDate = new Date(paymentData?.expiredAt || '');
            const now = new Date();
            const timeDifference = expirationDate.getTime() - now.getTime();
            const totalDuration = 15 * 60 * 1000;
            const initialFill = 15;

            const calculatedPercentage = Math.min(
                100,
                Math.max(
                    initialFill,
                    initialFill + (100 - initialFill) * (1 - timeDifference / totalDuration),
                ),
            );
            setProgressPercentage(calculatedPercentage);

            if (timeDifference > 0) {
                const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                const seconds = Math.floor((timeDifference / 1000) % 60);

                setTimeLeft(
                    `${hours.toString().padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
                );

            } else {
                setTimeLeft("00:00:00");
                setProgressPercentage(100);
                setTimerStatus(TransactionStatus.EXPIRED);
            }
        }

        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);

    }, [paymentData?.expiredAt, currentStatus])

    return { timeLeft, progressPercentage, timerStatus, resetTimer }
}