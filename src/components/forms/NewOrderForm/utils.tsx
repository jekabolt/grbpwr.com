import {
  common_AddressInsert,
  common_BuyerInsert,
  common_OrderItemInsert,
  common_OrderNew,
} from "@/api/proto-http/frontend";
import { CheckoutData } from "./schema";

export function mapFormFieldToOrderDataFormat(
  data: CheckoutData,
  orderItems: common_OrderItemInsert[],
) {
  const shippingAddress: common_AddressInsert = {
    addressLineOne: data.address,
    addressLineTwo: data.additionalAddress,
    company: data.company,
    city: data.city,
    state: data.state,
    country: data.country,
    postalCode: data.postalCode,
  };

  const billingAddress: common_AddressInsert | undefined =
    data.billingAddressIsSameAsAddress
      ? shippingAddress
      : data.billingAddress
        ? {
            addressLineOne: data.billingAddress.address,
            addressLineTwo: data.billingAddress.additionalAddress,
            company: data.billingAddress.company,
            city: data.billingAddress.city,
            state: data.billingAddress.state,
            country: data.billingAddress.country,
            postalCode: data.billingAddress.postalCode,
          }
        : undefined;

  const buyer: common_BuyerInsert = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    receivePromoEmails: data.subscribe,
  };

  const newOrderData: common_OrderNew = {
    items: orderItems,
    shippingAddress,
    billingAddress,
    buyer,
    // TO-DO map payment method and carrier id from dictionary
    // paymentMethodId: mapPaymentMethod(data.paymentMethod),
    // shipmentCarrierId: mapShipmentCarrierId(data.shippingMethod),
    paymentMethod: "PAYMENT_METHOD_NAME_ENUM_CARD",
    shipmentCarrierId: 1,
    promoCode: undefined, // Add promo code if applicable
  };

  return newOrderData;
}
