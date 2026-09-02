import Link from "next/link";

const FEATURED_CATEGORIES = [
  { id: "1", name: "Electronics", slug: "electronics" },
  { id: "2", name: "Fashion Men", slug: "fashion-men" },
  { id: "3", name: "Fashion Women", slug: "fashion-women" },
  { id: "4", name: "Home & Kitchen", slug: "home-kitchen" },
  { id: "5", name: "Beauty & Personal Care", slug: "beauty-personal-care" },
  { id: "6", name: "Sports & Outdoors", slug: "sports-outdoors" },
  { id: "7", name: "Toys & Games", slug: "toys-games" },
  { id: "8", name: "Books", slug: "books" },
  { id: "9", name: "Health & Wellness", slug: "health-wellness" },
  { id: "10", name: "Automotive", slug: "automotive" },
];

export default function CategoryNav() {
  return (
    <nav className="bg-accent w-full max-w-390 mx-auto">
      <ul className="flex items-center overflow-x-scroll scrollbar-none">
        {FEATURED_CATEGORIES.map((category) => (
          <li key={category.id} className="shrink-0 border border-transparent hover:border-border">
            <Link
              href={`/category/${category.slug}`}
              className="cursor-pointer block px-5 py-2 whitespace-nowrap text-foreground text-sm font-medium hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
