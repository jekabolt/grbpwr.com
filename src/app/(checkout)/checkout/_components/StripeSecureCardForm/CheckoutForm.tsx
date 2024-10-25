import {
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement) as any,
          billing_details: {
            name: "Customer Name",
            email: "customer@example.com",
          },
        },
      },
    );

    console.log(`stripe response:-0--0`);
    console.log({ error, paymentIntent });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        onChange={handleSubmit}
        className="w-96 border-2 border-black"
      />
      <button disabled={!stripe}>Submit stripe pay</button>
    </form>
  );
}
