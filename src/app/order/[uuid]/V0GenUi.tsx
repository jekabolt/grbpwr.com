"use client";

import { useHeroContext } from "@/components/contexts/HeroContext";

// Define the types based on the provided data structure
type OrderData = {
  order: {
    id: number;
    uuid: string;
    placed: string;
    modified: string;
    totalPrice: { value: string };
    orderStatusId: number;
    promoId: number;
  };
  orderItems: Array<{
    id: number;
    orderId: number;
    thumbnail: string;
    productName: string;
    productPrice: string;
    productPriceWithSale: string;
    productSalePercentage: string;
    productBrand: string;
    slug: string;
    color: string;
    categoryId: number;
    sku: string;
  }>;
  payment: {
    createdAt: string;
    modifiedAt: string;
    paymentInsert: {
      paymentMethod: string;
      transactionId: string;
      transactionAmount: { value: string };
      transactionAmountPaymentCurrency: { value: string };
      payer: string;
      payee: string;
      isTransactionDone: boolean;
    };
  };
  shipment: {
    cost: { value: string };
    createdAt: string;
    updatedAt: string;
    carrierId: number;
    trackingCode: string;
    shippingDate: string;
    estimatedArrivalDate: string;
  };
  promoCode: {
    promoCodeInsert: {
      code: string;
      freeShipping: boolean;
      discount: { value: string };
      expiration: string;
      allowed: boolean;
      voucher: boolean;
    };
  };
  buyer: {
    buyerInsert: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      receivePromoEmails: boolean;
    };
  };
  billing: {
    addressInsert: {
      country: string;
      state: string;
      city: string;
      addressLineOne: string;
      addressLineTwo: string;
      company: string;
      postalCode: string;
    };
  };
  shipping: {
    addressInsert: {
      country: string;
      state: string;
      city: string;
      addressLineOne: string;
      addressLineTwo: string;
      company: string;
      postalCode: string;
    };
  };
};

export default function OrderPage({ orderData }: { orderData: OrderData }) {
  const { dictionary } = useHeroContext();

  if (!orderData) return null;

  const {
    order,
    orderItems,
    payment,
    shipment,
    promoCode,
    buyer,
    billing,
    shipping,
  } = orderData;

  const statusName = dictionary?.orderStatuses?.find(
    (v) => v.id === order?.orderStatusId,
  );

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Order Details</h1>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>UUID:</strong> {order.uuid}
            </p>
            <p>
              <strong>Total Price:</strong> ${order.totalPrice.value}
            </p>
          </div>
          <div>
            <p>
              <strong>Placed:</strong> {order.placed}
            </p>
            <p>
              <strong>Modified:</strong> {order.modified}
            </p>
            <p className="bg-yellow-300">
              <strong>Status:</strong> {statusName?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Product</th>
                <th className="py-2">Price</th>
                <th className="py-2">Sale Price</th>
                <th className="py-2">Brand</th>
                <th className="py-2">SKU</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.thumbnail}
                        alt={item.productName}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <span>{item.productName}</span>
                    </div>
                  </td>
                  <td className="py-2">${item.productPrice}</td>
                  <td className="py-2">${item.productPriceWithSale}</td>
                  <td className="py-2">{item.productBrand}</td>
                  <td className="py-2">{item.sku}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Payment Information</h2>
          <p>
            <strong>Method:</strong> {payment.paymentInsert.paymentMethod}
          </p>
          <p>
            <strong>Transaction ID:</strong>{" "}
            {payment.paymentInsert.transactionId || "N/A"}
          </p>
          <p>
            <strong>Amount:</strong> $
            {payment.paymentInsert.transactionAmount.value}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {payment.paymentInsert.isTransactionDone ? "Completed" : "Pending"}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Shipment Details</h2>
          <p>
            <strong>Cost:</strong> ${shipment.cost.value}
          </p>
          <p>
            <strong>Carrier ID:</strong> {shipment.carrierId}
          </p>
          <p>
            <strong>Tracking Code:</strong> {shipment.trackingCode || "N/A"}
          </p>
          <p>
            <strong>Estimated Arrival:</strong>{" "}
            {shipment.estimatedArrivalDate !== "0001-01-01T00:00:00Z"
              ? shipment.estimatedArrivalDate
              : "Not available"}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Buyer Information</h2>
          <p>
            <strong>Name:</strong> {buyer.buyerInsert.firstName}{" "}
            {buyer.buyerInsert.lastName}
          </p>
          <p>
            <strong>Email:</strong> {buyer.buyerInsert.email}
          </p>
          <p>
            <strong>Phone:</strong> {buyer.buyerInsert.phone}
          </p>
          <p>
            <strong>Promo Emails:</strong>{" "}
            {buyer.buyerInsert.receivePromoEmails ? "Yes" : "No"}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Promo Code</h2>
          <p>
            <strong>Code:</strong> {promoCode.promoCodeInsert.code || "N/A"}
          </p>
          <p>
            <strong>Free Shipping:</strong>{" "}
            {promoCode.promoCodeInsert.freeShipping ? "Yes" : "No"}
          </p>
          <p>
            <strong>Discount:</strong> $
            {promoCode.promoCodeInsert.discount.value}
          </p>
          <p>
            <strong>Expiration:</strong>{" "}
            {promoCode.promoCodeInsert.expiration !== "0001-01-01T00:00:00Z"
              ? promoCode.promoCodeInsert.expiration
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Billing Address</h2>
          <p>{billing.addressInsert.company}</p>
          <p>{billing.addressInsert.addressLineOne}</p>
          <p>{billing.addressInsert.addressLineTwo}</p>
          <p>
            {billing.addressInsert.city}, {billing.addressInsert.state}{" "}
            {billing.addressInsert.postalCode}
          </p>
          <p>{billing.addressInsert.country}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
          <p>{shipping.addressInsert.company}</p>
          <p>{shipping.addressInsert.addressLineOne}</p>
          <p>{shipping.addressInsert.addressLineTwo}</p>
          <p>
            {shipping.addressInsert.city}, {shipping.addressInsert.state}{" "}
            {shipping.addressInsert.postalCode}
          </p>
          <p>{shipping.addressInsert.country}</p>
        </div>
      </div>
    </div>
  );
}
