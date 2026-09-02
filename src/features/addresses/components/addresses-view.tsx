"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressCard from "./address-card";
import AddAddressModal from "./add-address-modal";
import EmptyAddresses from "./empty-addresses";
import type { Address } from "../types/address";

interface AddressesViewProps {
  addresses: Address[];
}

export default function AddressesView({ addresses }: AddressesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Addresses</h1>
          <p className="text-muted-foreground mt-1">
            {addresses.length > 0
              ? `${addresses.length} saved address${addresses.length > 1 ? "es" : ""}`
              : "Manage your delivery addresses"}
          </p>
        </div>

        {addresses.length > 0 && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-yellow-400 text-black hover:bg-yellow-500 font-medium shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <EmptyAddresses onAdd={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}

          <Button
            variant="ghost"
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col h-auto items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border p-8 text-muted-foreground transition-all hover:border-white/50 hover:text-white/50 hover:bg-yellow-50/5 min-h-[200px] w-full"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-current">
              <Plus className="h-7 w-7" />
            </div>
            <span className="text-sm font-medium">Add New Address</span>
          </Button>
        </div>
      )}

      <AddAddressModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
