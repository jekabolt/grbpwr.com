import { serviceClient } from "@/lib/api";

export default function Footer() {
  async function handleSubmit(data: FormData): Promise<void> {
    "use server";

    try {
      const payload: { email: string; name: string } = {
        email: data.get("email") as string,
        name: "no field for name",
      };

      await serviceClient.SubscribeNewsletter(payload);

      localStorage.setItem("grbpwr-newsletter-subscribed", "true");
    } catch (error) {
      console.log("Failed to subscribe: ", error);
    }

    console.log("Subscribed to newsletter 📤");
  }

  return (
    <footer className="mt-24 flex w-full items-end justify-between gap-5 self-center px-5 text-xs font-medium text-black max-md:mt-10 max-md:max-w-full max-md:flex-wrap">
      <div className="mt-24 flex justify-center gap-0 whitespace-nowrap bg-black px-1.5 py-0.5 text-xs lowercase text-white max-md:mt-10">
        <div>currency:</div>
        {/* <CustomImage
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8764204ec037682f32733d88473f7cc6f61e2364f55757470d79a852ae6116e4?apiKey=2bd386ac58de4a4f9e996607125fc961&"
          alt="Currency icon"
          className="aspect-square w-3 shrink-0"
        /> */}
      </div>
      <div className="mt-28 max-md:mt-10">grbpwr 2024©</div>
      <div className="mt-28 max-md:mt-10">privacy policy</div>
      <div className="mt-28 flex justify-center gap-5 whitespace-nowrap max-md:mt-10">
        {["tg", "x", "ig"].map((link) => (
          <div key={link}>{link}</div>
        ))}
      </div>

      <form
        action={handleSubmit as any}
        className="flex flex-col self-stretch max-md:max-w-full"
      >
        <p className="lowercase leading-3 max-md:max-w-full">
          Subscribe to our newsletter and receive news, information about
          promotions and pleasant surprises from grbpwr.com
        </p>
        <label htmlFor="email" className="mt-6 max-md:max-w-full">
          email
        </label>
        <input
          type="email"
          name="email"
          required
          className="mt-1.5 border-b-2 border-black focus:outline-none max-md:max-w-full"
          aria-label="Email"
          placeholder="us@grbpwr.com"
        />
        <button
          type="submit"
          className="mt-6 justify-center self-start whitespace-nowrap bg-black px-12 py-2 text-lg font-medium text-white max-md:px-5"
        >
          subscribe
        </button>
      </form>
    </footer>
  );
}
