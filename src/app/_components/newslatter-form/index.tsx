import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

interface Props {
  footer?: boolean;
}

// async function formSubmitClick(data: FormData): Promise<void> {
//   "use server";
//   try {
//     const payload: { email: string; name: string } = {
//       email: data.get("email") as string,
//       name: "no field for name",
//     };
//     await serviceClient.SubscribeNewsletter(payload);
//   } catch (error) {
//     throw error;
//   }
// }

export default function NewslatterForm({ footer }: Props) {
  return (
    <form>
      <Text variant="uppercase" className="mb-6">
        newsletter
      </Text>
      <label htmlFor="newsletter" className="mb-3 block">
        <Text size="small">{footer ? "e-mail adress" : "email"}</Text>
      </label>
      <div
        className={cn("flex items-center gap-4", {
          "flex-col items-start gap-6": footer,
        })}
      >
        <Input
          id="newsletter"
          type="email"
          required
          placeholder="email"
          name="email"
        />
        <Button
          variant={footer ? "main" : "simple"}
          size={footer ? "lg" : "sm"}
          type="submit"
          className={cn({
            "border border-white uppercase": footer,
          })}
        >
          subscribe
        </Button>
      </div>
    </form>
  );
}
