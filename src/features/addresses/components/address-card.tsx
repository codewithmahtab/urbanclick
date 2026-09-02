"use client";

import { useState, useTransition } from "react";
import { deleteAddressAction } from "../actions/delete-address";
import { setDefaultAddressAction } from "../actions/set-default-address";
import { CheckCircle, Loader2 } from "lucide-react";
import EditAddressModal from "./edit-address-modal";
import type { Address } from "../types/address";

interface AddressCardProps {
  address: Address;
}

export default function AddressCard({ address }: AddressCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isSettingDefault, startDefaultTransition] = useTransition();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      await deleteAddressAction(address.id);
    });
  };

  const handleSetDefault = () => {
    startDefaultTransition(async () => {
      await setDefaultAddressAction(address.id);
    });
  };

  return (
    <>
      <div className="relative flex flex-col rounded-2xl border border-white/20 p-6 min-h-[220px]">
        {address.isDefault && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1 text-xs font-medium text-black">
            <CheckCircle className="h-3.5 w-3.5" />
            Default
          </div>
        )}

        {/* Address content — flex-1 pushes actions to the bottom */}
        <div className="flex-1 pr-20">
          <p className="font-semibold text-base">{address.fullName}</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {address.phone}
          </p>
          <p className="text-sm mt-2 leading-relaxed">
            {address.addressLine},
            <br />
            {address.city}, {address.state} – {address.pincode}
            <br />
            {address.country}
          </p>
        </div>

        {/* Actions — pinned at the bottom via mt-auto */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center">
          {/* Edit */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-sm cursor-pointer text-white bg-transparent border-none hover:underline underline-offset-2 disabled:opacity-40 pr-3"
            disabled={isDeleting || isSettingDefault}
          >
            Edit
          </button>

          <span className="w-px h-3.5 bg-white/40 shrink-0" />

          {/* Remove */}
          <button
            onClick={handleDelete}
            disabled={isDeleting || isSettingDefault}
            className="text-sm cursor-pointer text-white bg-transparent border-none hover:underline underline-offset-2 disabled:opacity-40 px-3 flex items-center gap-1.5"
          >
            {isDeleting && <Loader2 className="h-3 w-3 animate-spin" />}
            Remove
          </button>

          {/* Set as Default — only when not already default */}
          {!address.isDefault && (
            <>
              <span className="w-px h-3.5 bg-white/40 shrink-0" />
              <button
                onClick={handleSetDefault}
                disabled={isSettingDefault || isDeleting}
                className="text-sm cursor-pointer text-white bg-transparent border-none hover:underline underline-offset-2 disabled:opacity-40 px-3 flex items-center gap-1.5"
              >
                {isSettingDefault && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                Set as Default
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit modal — rendered outside the card div to avoid stacking context issues */}
      <EditAddressModal
        address={address}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
