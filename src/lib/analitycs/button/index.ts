import { pushCustomEvent } from "../utils";

interface ButtonEventData {
    buttonId: string;
    productName: string;
}

export function sendButtonEvent(data: ButtonEventData) {
    pushCustomEvent("button_click", {
        button_id: data.buttonId,
        product_name: data.productName,
    });
}