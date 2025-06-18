"use client";

import { common_PaymentInsert } from "@/api/proto-http/frontend";
import { useEffect, useState } from "react";
import { TransactionStatus } from "./usePaymentActions";
import { calculateTimeLeft } from "./utils";

interface Props {
    paymentData: common_PaymentInsert | undefined;
    currentStatus: TransactionStatus;
}

export const usePaymentTimer = ({ paymentData, currentStatus }: Props) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [progressPercentage, setProgressPercentage] = useState(0);

    function resetTimer() {
        setProgressPercentage(0);
    }

    function updateTimer() {
        const result = calculateTimeLeft(paymentData?.expiredAt);
        setTimeLeft(result.timeLeft);
        setProgressPercentage(result.progressPercentage);
    };

    useEffect(() => {
        if (!paymentData?.expiredAt || currentStatus !== TransactionStatus.PENDING) return;

        updateTimer();

        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [paymentData?.expiredAt, currentStatus]);

    return { timeLeft, progressPercentage, resetTimer };
}