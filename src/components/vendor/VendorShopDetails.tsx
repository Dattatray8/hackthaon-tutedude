"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

// Zod schema for validation
const supplierSchema = z.object({
  shopName: z.string().min(1, "Shop name is required"),
  address: z.string().min(1, "Address is required").max(15),
  shopDetails: z.string().min(1, "Shop details are required"),
  shopLocation: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
  }),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function SupplierForm() {
  const [loadingLocation, setLoadingLocation] = useState(false);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      shopName: "",
      address: "",
      shopDetails: "",
      shopLocation: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  });

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      fallbackToIP();
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log(" GPS Location:", { lat, lng });

        form.setValue(
          "shopLocation",
          {
            type: "Point",
            coordinates: [lng, lat],
          },
          { shouldValidate: true, shouldDirty: true }
        );

        setLoadingLocation(false);
      },
      /*eslint-disable @typescript-eslint/no-unused-vars */
      (_error) => {
        fallbackToIP();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const fallbackToIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);

      if (!lat || !lng) throw new Error("Invalid IP location data");

      console.log("🌐 Fallback IP Location:", { lat, lng });

      form.setValue(
        "shopLocation",
        {
          type: "Point",
          coordinates: [lng, lat],
        },
        { shouldValidate: true, shouldDirty: true }
      );
    } catch (err) {
      console.error("IP location fallback failed:", err);
      alert("Could not determine your location.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const onSubmit = (data: SupplierFormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto mt-10"
      >
        <FormField
          control={form.control}
          name="shopName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Name</FormLabel>
              <FormControl>
                <Input placeholder="Your shop name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Address</FormLabel>
              <FormControl>
                <Input placeholder="Shop address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shopDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Details</FormLabel>
              <FormControl>
                <Textarea placeholder="About the shop" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Button */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={handleUseMyLocation}
            disabled={loadingLocation}
          >
            {loadingLocation && <Spinner />}
            {loadingLocation ? "Getting Location..." : "Use My Current Location"}
          </Button>

          {form.watch("shopLocation").coordinates[0] !== 0 && (
            <span className="text-sm text-green-600">Location Set</span>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full">
          Log Form Data
        </Button>
      </form>
    </Form>
  );
}
