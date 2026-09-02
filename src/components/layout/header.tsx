import CategoryNav from "@/components/nav/category-nav";
import MainNavbar from "@/components/nav/main-navbar";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b shadow-sm">
      <MainNavbar />
      <CategoryNav />
    </header>
  );
}
