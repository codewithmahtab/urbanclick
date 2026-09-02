"use client";
import { useNavigation } from "@/providers/navigation-provider";
import { formatCurrency } from "@/utils/format";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

type PriceFilterProps = {
  minPrice: number;
  maxPrice: number;
};

function generatePriceOptions(min: number, max: number) {
  if (max === min) return [min];
  const step = (max - min) / 5;

  return Array.from({ length: 6 }, (_, index) => {
    return min + step * index;
  });
}

export default function PriceFilter({ minPrice, maxPrice }: PriceFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { pushUrl } = useNavigation();

  const optionList = generatePriceOptions(minPrice, maxPrice);
  const step = maxPrice <= minPrice ? 1 : (maxPrice - minPrice) / 5;

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  const selectedMinPrice =
    minPriceParam !== undefined ? Number(minPriceParam) : minPrice;

  const selectedMaxPrice =
    maxPriceParam !== null ? Number(maxPriceParam) : maxPrice;

  const [sliderValue, setSliderValue] = useState<[number, number]>([
    selectedMinPrice,
    selectedMaxPrice,
  ]);

  useEffect(() => {
    setSliderValue([selectedMinPrice, selectedMaxPrice]);
  }, []);

  function handleSelectChange(value: string, key: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set(key, value);

    pushUrl(`${pathname}?${params.toString()}`);
  }

  function handleSliderChange(value: [number, number]) {
    setSliderValue(value as [number, number]);
  }

  function handleSliderCommit(value: [number, number]) {
    const [min, max] = value;
    const params = new URLSearchParams(searchParams.toString());

    if (min == selectedMinPrice && max === selectedMaxPrice) return;

    if (min !== selectedMinPrice) {
      params.set("minPrice", String(min));
    }
    if (max !== selectedMaxPrice) {
      params.set("maxPrice", String(max));
    }

    pushUrl(`${pathname}?${params.toString()}`);
  }

  return (
    <section className="mt-4 space-y-6">
      <h3 className="text-lg text-white/80">Price</h3>

      <Slider
        value={sliderValue}
        min={minPrice}
        max={maxPrice}
        step={step}
        className="mx-auto w-full max-w-xs"
        onValueChange={(val) => handleSliderChange(val as [number, number])}
        onValueCommitted={(val) => handleSliderCommit(val as [number, number])}
      />

      <div className="flex items-center gap-3 text-sm">
        <select
          name="minPrice"
          id="minPrice"
          className="bg-background text-white rounded-none w-26 py-2 border border-white/30 cursor-pointer"
          value={selectedMinPrice}
          onChange={(e) => handleSelectChange(e.target.value, e.target.id)}
        >
          {optionList.map((option) => (
            <option key={option} value={option}>
              {formatCurrency(option)}
            </option>
          ))}
        </select>

        <p>To</p>

        <select
          name="maxPrice"
          id="maxPrice"
          className="bg-background cursor-pointer text-white rounded-none w-26 py-2 border border-white/30"
          value={selectedMaxPrice}
          onChange={(e) => handleSelectChange(e.target.value, e.target.id)}
        >
          {optionList
            .filter((option) => option >= selectedMinPrice)
            .map((option) => (
              <option key={option} value={option}>
                {formatCurrency(option)}
              </option>
            ))}
        </select>
      </div>
    </section>
  );
}
