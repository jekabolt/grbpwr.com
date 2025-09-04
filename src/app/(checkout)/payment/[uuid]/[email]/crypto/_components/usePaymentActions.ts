"use client";

import { common_PaymentInsert } from "@/api/proto-http/frontend";
import { useEffect, useState } from "react";

import { serviceClient } from "@/lib/api";
import { useCart } from "@/lib/stores/cart/store-provider";

import { redirect } from "next/navigation";
import { usePaymentTimer } from "./usePaymentTimer";

export enum TransactionStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED",
}

interface Props {
    paymentInsert: common_PaymentInsert | undefined;
    orderUuid: string | undefined;
    orderStatusId: number | undefined;
}

export const usePaymentActions = ({
    paymentInsert,
    orderUuid,
    orderStatusId,
}: Props) => {
    const { clearCart } = useCart((s) => s);
    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
        TransactionStatus.PENDING,
    );
    const [paymentData, setPaymentData] = useState(paymentInsert);
    const [isLoading, setIsLoading] = useState(false);
    const { timeLeft, progressPercentage, resetTimer } =
        usePaymentTimer({
            paymentData,
            currentStatus: transactionStatus,
        });

    const isExpired = progressPercentage === 100;

    useEffect(() => {
        if (isExpired) {
            setTransactionStatus(TransactionStatus.EXPIRED);
        }
    }, [isExpired]);

    const checkPaymentStatus = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await serviceClient.GetOrderInvoice({
                orderUuid: orderUuid?.toString() || "",
                paymentMethod: paymentInsert?.paymentMethod,
            });
            if (response && response.payment?.isTransactionDone) {
                setTransactionStatus(TransactionStatus.SUCCESS);
                clearCart();
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelPayment = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await serviceClient.CancelOrderInvoice({
                orderUuid: orderUuid?.toString() || "",
            });
            if (response) {
                setTransactionStatus(TransactionStatus.CANCELLED);
            }
        } catch (error) {
            console.error("Error canceling payment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renewPayment = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await serviceClient.GetOrderInvoice({
                orderUuid: orderUuid?.toString() || "",
                paymentMethod: paymentInsert?.paymentMethod,
            });
            if (response && response.payment) {
                setPaymentData(response.payment);
                setTransactionStatus(TransactionStatus.PENDING);
                resetTimer();
            }
        } catch (error) {
            console.error("Error renewing payment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        switch (orderStatusId) {
            case 2:
                setTransactionStatus(TransactionStatus.PENDING);
                break;
            case 3:
                setTransactionStatus(TransactionStatus.SUCCESS);
                break;
            case 6:
                setTransactionStatus(TransactionStatus.CANCELLED);
                break;
        }
    }, [orderStatusId]);

    useEffect(() => {
        if (transactionStatus === TransactionStatus.CANCELLED) {
            redirect("/checkout");
        }
    }, [transactionStatus]);

    return {
        transactionStatus,
        paymentData,
        timeLeft,
        progressPercentage,
        isLoading,
        checkPaymentStatus,
        cancelPayment,
        renewPayment,
    };
};
