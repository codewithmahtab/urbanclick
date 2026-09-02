"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition } from "react";

type NavigationContextType = {
  isNavigating: boolean;
  pushUrl: (url: string) => void;
  replaceUrl: (url: string) => void;
};

const navigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavigating, startTransition] = useTransition();
  const router = useRouter();

  function pushUrl(url: string) {
    startTransition(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      router.push(url);
    });
  }

  function replaceUrl(url: string) {
    startTransition(() => {
      router.replace(url);
    });
  }

  return (
    <navigationContext.Provider value={{ isNavigating, pushUrl, replaceUrl }}>
      {children}
    </navigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  const context = useContext(navigationContext);
  if (!context) {
    throw new Error("Wrap the component with Context Provider");
  }
  return context;
}
