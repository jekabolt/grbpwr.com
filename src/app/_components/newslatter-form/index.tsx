import { serviceClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function NewslatterForm() {
  const handleSubmit = async (values: any) => {
    console.log(new FormData(values));
    // try {
    //   await serviceClient.SubscribeNewsletter({
    //     email: formData.get("email") as string,
    //   });
    // } catch (error) {}
  };

  return (
    <form action={handleSubmit}>
      <Text variant="uppercase" className="mb-6">
        newsletter
      </Text>
      {/* // make a label */}
      <label htmlFor="newsletter" className="mb-3 block">
        <Text size="small">email</Text>
      </label>
      <div className="flex items-center gap-4">
        <Input
          id="newsletter"
          type="email"
          required
          placeholder="email"
          name="email"
        />
        <Button variant="simple" size={"sm"} type="submit">
          subscribe
        </Button>
      </div>
    </form>
  );
}
