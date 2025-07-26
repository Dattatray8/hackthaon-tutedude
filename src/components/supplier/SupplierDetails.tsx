"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";

const supplierSchema = z.object({
  shopName: z.string().min(1, "Shop name is required"),
  address: z.string().min(1, "Address is required"),
  shopLocation: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export function SupplierForm() {
  const [loadingLocation, setLoadingLocation] = useState(false);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      shopName: "",
      address: "",
      shopLocation: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  });

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      setLoadingLocation(false);
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        form.setValue("shopLocation", {
          type: "Point",
          coordinates: [lng, lat],
        }, { shouldValidate: true, shouldDirty: true });

        // Optionally autofill address with "Lat: x, Lng: y"
        form.setValue("address", `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);

        setLoadingLocation(false);
      },
      () => {
        alert("Failed to get location");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const onSubmit = (data: SupplierFormValues) => {
    alert("Supplier Saved: " + JSON.stringify(data, null, 2));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 border rounded space-y-4">
      <h2 className="text-xl font-semibold">Supplier Info</h2>

      <div>
        <label>Shop Name</label>
        <Input {...form.register("shopName")} placeholder="Enter shop name" />
        {form.formState.errors.shopName && (
          <p className="text-red-500">{form.formState.errors.shopName.message}</p>
        )}
      </div>

      <div>
        <label>Shop Address</label>
        <Input {...form.register("address")} placeholder="Enter address or use location" />
        {form.formState.errors.address && (
          <p className="text-red-500">{form.formState.errors.address.message}</p>
        )}
      </div>

      <div>
        <Button type="button" onClick={handleUseMyLocation} disabled={loadingLocation}>
          {loadingLocation && <Spinner />}
          {loadingLocation ? "Getting Location..." : "Use My Current Location"}
        </Button>
      </div>

      <Button type="submit" className="w-full">Save Supplier</Button>
    </form>
  );
}
