/**
 * v0 by Vercel.
 * @see https://v0.dev/t/nz2xUz4Ag64
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
  return (
    <div className="mx-auto mt-40 w-full max-w-md rounded-lg bg-white shadow-md">
      <div className="p-6">
        <h2 className="mb-2 text-2xl font-bold">Check Invoice Status</h2>
        <p className="mb-6 text-gray-500">
          Enter your invoice number and email to check the status of your
          invoice.
        </p>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="invoice-number"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Invoice Number
            </label>
            <input
              type="text"
              id="invoice-number"
              placeholder="Enter invoice number"
              className="focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              className="focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="hover:bg-primary-dark focus:ring-primary rounded-md bg-black px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Check Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
