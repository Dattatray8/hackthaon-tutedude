"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Loader2, Store, Building, Tag } from "lucide-react";
import axios from "axios";

const supplierSchema = z.object({
  shopName: z.string().min(1, "Shop name is required"),
  address: z.string().min(1, "Address is required"),
  category: z.string().min(1, "Category is required"),
  shopLocation: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  userId: string;
  onSuccess?: () => void;
}

const categories = [
  "Grocery & Food",
  "Electronics",
  "Clothing & Fashion",
  "Home & Garden",
  "Health & Beauty",
  "Sports & Outdoors",
  "Books & Media",
  "Automotive",
  "Office Supplies",
  "Other"
];

export function SupplierForm({ userId, onSuccess }: SupplierFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      shopName: "",
      address: "",
      category: "",
      shopLocation: {
        type: "Point",
        coordinates: [77.5946, 12.9716], // Default to Bangalore coordinates
      },
    },
  });

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
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

        // Update address with coordinates (you might want to reverse geocode this)
        const currentAddress = form.getValues("address");
        if (!currentAddress) {
          form.setValue("address", `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
        
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get your location. Please enter your address manually.");
        setLoadingLocation(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000,
        maximumAge: 60000 
      }
    );
  };

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        shopName: data.shopName,
        address: data.address,
        category: data.category,
        shopLocation: data.shopLocation,
        user: userId,
      };

      const response = await axios.post("/api/supplier/createsupplier", payload);
      
      if (response.status === 200 || response.status === 201) {
        // Success feedback
        alert("Supplier profile created successfully!");
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          // Fallback to reload if no callback
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error creating supplier profile:", error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Failed to create supplier profile";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
          <Store className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Supplier Information</h2>
        <p className="text-slate-600">Complete your profile to start managing offers and products</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Shop Name */}
        <div className="space-y-2">
          <Label htmlFor="shopName" className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-slate-600" />
            <span>Shop Name</span>
          </Label>
          <Input
            id="shopName"
            {...form.register("shopName")}
            placeholder="Enter your shop name"
            className="h-11"
          />
          {form.formState.errors.shopName && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠️</span>
              <span>{form.formState.errors.shopName.message}</span>
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-slate-600" />
            <span>Business Category</span>
          </Label>
          <Select onValueChange={(value) => form.setValue("category", value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select your business category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠️</span>
              <span>{form.formState.errors.category.message}</span>
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-slate-600" />
            <span>Shop Address</span>
          </Label>
          <div className="space-y-3">
            <Input
              id="address"
              {...form.register("address")}
              placeholder="Enter your complete shop address"
              className="h-11"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUseMyLocation}
              disabled={loadingLocation}
              className="w-full h-11 flex items-center justify-center space-x-2"
            >
              {loadingLocation ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Getting Location...</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>Use My Current Location</span>
                </>
              )}
            </Button>
          </div>
          {form.formState.errors.address && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠️</span>
              <span>{form.formState.errors.address.message}</span>
            </p>
          )}
        </div>

        {/* Location Info Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">Location Information</p>
                <p className="text-xs text-blue-700">
                  Your location coordinates: {form.watch("shopLocation.coordinates")[1].toFixed(4)}, {form.watch("shopLocation.coordinates")[0].toFixed(4)}
                </p>
                <p className="text-xs text-blue-600">
                  This helps vendors find suppliers in their area more easily.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating Profile...
              </>
            ) : (
              <>
                <Store className="h-4 w-4 mr-2" />
                Create Supplier Profile
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            By creating a profile, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </form>
    </div>
  );
}