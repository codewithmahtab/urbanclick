"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  showLabel?: boolean;
}

export default function QuantitySelector({
  quantity,
  onChange,
  max,
  showLabel = true,
}: QuantitySelectorProps) {
  const handlePlus = () => {
    if (max !== undefined && quantity >= max) return;
    onChange(quantity + 1);
  };

  const handleMinus = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  return (
    <div className={showLabel ? "mt-5" : ""}>
      {showLabel && (
        <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
          Quantity
        </label>
      )}

      <div className="flex h-12 w-fit items-center rounded-md border border-border bg-black text-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinus}
          aria-label="Decrease quantity"
          disabled={quantity === 1}
          className="h-full w-12 rounded-r-none text-white hover:bg-white/10! hover:text-white disabled:opacity-40"
        >
          <Minus size={16} />
        </Button>

        <span
          id="quantity"
          className="flex w-10 justify-center text-sm font-medium"
        >
          {quantity}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlus}
          aria-label="Increase quantity"
          disabled={max !== undefined && quantity >= max}
          className="h-full w-12 rounded-l-none text-white hover:bg-white/10! hover:text-white disabled:opacity-40"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
}
