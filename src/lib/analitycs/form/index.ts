import { common_OrderFull } from "@/api/proto-http/frontend";
import { calculateTotalValue } from "../utils";

interface NewsletterFormData {
    email: string;
    formId?: string;
}


export function sendFormEvent(data: NewsletterFormData) {
    if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('DataLayer is not available');
        return;
    }

    window.dataLayer = window.dataLayer || [];

    const eventData = {
        event: 'form_submission',
        form_id: data.formId,
        form_data: {
            email: data.email,
            email_domain: data.email.split('@')[1] || '',
        },
    };

    window.dataLayer.push(eventData);

    console.log('Newsletter subscription event sent to DataLayer:', eventData);
}


export function sendRefundEvent(data: common_OrderFull) {
    if (typeof window === "undefined" || !data.order) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
        event: "refund",
        ecommerce: {
            currency: "EUR",
            value: calculateTotalValue(data.orderItems || []),
            transaction_id: data.order.uuid,
            coupon: data.promoCode || "not set",
            shipping: parseFloat(data.shipment?.cost?.value || "0") || 0,
            items: data.orderItems?.map((i) => {
                const price = parseFloat(i.productPrice || "0");
                const salePercentage = parseFloat(i.productSalePercentage || "0");
                const discount = (price * salePercentage) / 100;
                return {
                    item_id: i.sku || "",
                    item_name: i.translations?.[0]?.name || "",
                    affiliation: "GRBPWR STORE",
                    coupon: data.promoCode || "not set",
                    discount: discount,
                    item_brand: i.productBrand,
                    item_variant: i.orderItem?.sizeId?.toString() || "",
                    price: price,
                    quantity: 1
                }
            })
        }
    })
}