"use client";

import { Search, X, Clock, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigation } from "@/providers/navigation-provider";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getRelatedProducts,
  RelatedProduct,
} from "@/features/search/actions/get-related-products";
import {
  addSearch,
  getRecentSearches,
  removeSearch,
} from "@/features/search/utils/recent-searches";
import { ProductImage } from "@/components/ui/product-image";
import Link from "next/link";
import { Suspense } from "react";

// Isolated component — the only part that reads useSearchParams()
// Wrapping just this in Suspense means the input shell renders immediately
function SearchParamSync({ onSync }: { onSync: (q: string) => void }) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  useEffect(() => {
    if (q) onSync(q);
  // onSync is stable (defined outside, passed as prop) — intentional
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return null;
}

export default function SearchInput() {
  const { pushUrl } = useNavigation();

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Track current searchParams string for building outgoing URLs
  const searchParamsRef = useRef<URLSearchParams>(new URLSearchParams());

  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    async function fetchRelated() {
      if (!debouncedQuery.trim()) {
        setRelatedProducts([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const results = await getRelatedProducts(debouncedQuery);
      setRelatedProducts(results);
      setIsLoading(false);
    }
    fetchRelated();
  }, [debouncedQuery]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    window.addEventListener("pointerdown", handlePointerDown, { capture: true });
    return () => window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
  }, []);

  function handleSearch(searchText: string) {
    if (!searchText.trim()) return;

    const updatedSearches = addSearch(searchText);
    setRecentSearches(updatedSearches);
    setIsFocused(false);

    const params = new URLSearchParams(searchParamsRef.current.toString());
    params.delete("page");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("category");
    params.delete("brand");
    params.set("q", searchText.trim().toLowerCase());
    pushUrl(`/search?${params.toString()}`);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSearch(query);
  }

  function handleRemoveRecent(e: React.MouseEvent, searchText: string) {
    e.stopPropagation();
    const updated = removeSearch(searchText);
    setRecentSearches(updated);
  }

  return (
    <div className="relative flex-1" ref={containerRef}>
      {/* Sync URL ?q= into state without blocking the input shell */}
      <Suspense fallback={null}>
        <SearchParamSync
          onSync={(q) => {
            setQuery(q);
            searchParamsRef.current = new URLSearchParams(`q=${q}`);
          }}
        />
      </Suspense>

      <form onSubmit={handleSubmit} className="relative flex w-full">
        <Search className="absolute text-muted-foreground size-5 top-3 left-3" />
        <Input
          id="search"
          name="search"
          placeholder="Search Products, brands, and More"
          className="w-full max-w-xl h-11 text-[16px]! pl-11 pr-4 rounded-none border border-white/10 bg-muted text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
          spellCheck={false}
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setRecentSearches(getRecentSearches());
          }}
        />
        <button
          type="submit"
          className="bg-yellow-500 text-black hover:bg-yellow-400 h-11 px-5 cursor-pointer font-medium"
        >
          Search
        </button>
      </form>

      {isFocused && (
        <div className="absolute top-full left-0 right-[85px] mt-1 bg-background border border-border shadow-lg rounded-md overflow-hidden z-50">
          {!query.trim() && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Searches
              </div>
              {recentSearches.length > 0 ? (
                <ul>
                  {recentSearches.map((term, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between px-4 py-2 hover:bg-muted cursor-pointer group"
                      onClick={() => {
                        setQuery(term);
                        handleSearch(term);
                      }}
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="size-4 text-muted-foreground" />
                        <span>{term}</span>
                      </div>
                      <button
                        onClick={(e) => handleRemoveRecent(e, term)}
                        className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No recent searches
                </div>
              )}
            </div>
          )}

          {query.trim() !== "" && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Related Products
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : relatedProducts.length > 0 ? (
                <ul>
                  {relatedProducts.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          addSearch(query);
                          setIsFocused(false);
                        }}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="relative size-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <ProductImage
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium line-clamp-1">
                          {product.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No products found matching &quot;{query}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
