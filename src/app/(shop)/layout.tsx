import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { NavigationProvider } from "@/providers/navigation-provider";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <Header />
      <main className="min-h-screen w-full mx-auto pt-26.25">{children}</main>
      <Footer />
    </NavigationProvider>
  );
}
