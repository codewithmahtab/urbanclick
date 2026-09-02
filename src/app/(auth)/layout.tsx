import AuthHeader from "@/components/nav/auth-header";
import { NavigationProvider } from "@/providers/navigation-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <AuthHeader />
      <main className="flex-1 w-full flex items-center justify-center">
        {children}
      </main>
    </NavigationProvider>
  );
}
