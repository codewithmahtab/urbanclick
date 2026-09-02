export const instant = false;

import { Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Next Shop support. We respond within 24 hours.",
  openGraph: {
    title: "Contact Next Shop",
    description: "Have a question? Reach out and we will get back to you within 24 hours.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help! If you have any questions, concerns, or
            feedback, please reach out to our support team.
          </p>
        </div>

        <div className="flex flex-col items-center p-8 text-center border border-white/10 rounded-2xl bg-white/5">
          <div className="bg-yellow-400/20 p-4 rounded-full mb-6">
            <Mail className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Email Us</h3>
          <p className="text-muted-foreground mb-4">
            Send us an email and we'll respond within 24 hours.
          </p>
          <a
            href="mailto:support@adowise.com"
            className="text-yellow-400 hover:underline"
          >
            mahtabmohd2005@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}
