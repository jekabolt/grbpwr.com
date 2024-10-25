// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "../forms/StripeSecureCardForm/CheckoutForm";
// import { loadStripe } from "@stripe/stripe-js";

// // recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(
//   "pk_test_51PQqJsP97IsmiR4DHmNimxWDeAAMhzOww6NNyrvYKyqW0nsRPKbfivB8M2gzeSJSgJktys1EWbHNfaqvvqDv5Mlq00rjie9vDF",
// );

// export default function CheckoutLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <Elements
//       stripe={stripePromise}
//       options={
//         {
//           // clientSecret,
//         }
//       }
//     >
//       {children}
//     </Elements>
//   );
// }
