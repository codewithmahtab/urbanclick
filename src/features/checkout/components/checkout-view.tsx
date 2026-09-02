import CheckoutForm from "./checkout-form";
import OrderSummary from "./order-summary";
import type { Address } from "@/features/addresses/types/address";

interface CheckoutViewProps {
  cart: {
    items: {
      id: string;
      quantity: number;
      product: {
        name: string;
        priceInPaise: number;
        imageUrl: string;
      };
    }[];
  };
  addresses: Address[];
  buyNowParams?: {
    productId: string;
    quantity: number;
  };
}

export default function CheckoutView({ cart, addresses, buyNowParams }: CheckoutViewProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        </div>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <CheckoutForm addresses={addresses} buyNowParams={buyNowParams} />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </main>
  );
}
