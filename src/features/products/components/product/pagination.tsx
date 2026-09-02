"use client";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/providers/navigation-provider";
import { generatePagination } from "@/utils/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { pushUrl } = useNavigation();

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const handleClick = (item: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", item.toString());

    pushUrl(`${pathname}?${params.toString()}`);
  };

  const pagination = generatePagination(totalPages, page);

  const renderPagination = pagination.map((item, index) => (
    <li key={`${item}-${index}`}>
      {item === "..." ? (
        <span className="px-2 text-muted-foreground">...</span>
      ) : (
        <Button
          variant="outline"
          onClick={() => handleClick(Number(item))}
          className={cn(
            "h-10 w-10 rounded-md border transition-all cursor-pointer",
            page === Number(item)
              ? "bg-white! text-black! border-white hover:bg-white font-bold"
              : "bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {item}
        </Button>
      )}
    </li>
  ));

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-10">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => handleClick(page - 1)}
          className="h-10 w-10 rounded-md bg-card border-border hover:bg-accent hover:text-accent-foreground p-0 cursor-pointer disabled:opacity-50"
        >
          <ChevronLeft className="size-5" />
        </Button>

        <ul className="flex items-center justify-center gap-1.5">
          {renderPagination}
        </ul>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => handleClick(page + 1)}
          className="h-10 w-10 rounded-md bg-card border-border hover:bg-accent hover:text-accent-foreground p-0 cursor-pointer disabled:opacity-50"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
      </p>
    </div>
  );
}
