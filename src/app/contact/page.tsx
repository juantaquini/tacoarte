import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Contact — Taco Arte",
  description:
    "Get in touch with Taco Arte for inquiries, commissions, or information about original artworks.",
};

async function submitContact(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const message = formData.get("message")?.toString();

  if (!name || !email || !message) return;

  await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 h-[100vh] flex flex-col justify-center items-center">
      <h1 className="mb-6 text-3xl font-light tracking-wide">
        Contact
      </h1>

      <p className="mb-12 text-sm leading-relaxed text-foreground/80">
        For inquiries, commissions, or simply to say hello.
      </p>

      <form action={submitContact} className="space-y-8 w-full">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs uppercase tracking-widest"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full border-b border-foreground bg-transparent py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs uppercase tracking-widest"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border-b border-foreground bg-transparent py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-xs uppercase tracking-widest"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full resize-none border-b border-foreground bg-transparent py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-foreground text-white px-6 py-2 ml-auto block w-fit cursor-pointer"
        >
          Send message
        </button>
      </form>
    </section>
  );
}
