"use client";

import { getCurrentUser } from "@/helpers/client/auth.client";
import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VendorShopDetails from "@/components/vendor/VendorShopDetails";
import { OfferCRUD } from "@/components/supplier/Offer";
import { ProductCRUD } from "@/components/supplier/Products";
import { SupplierForm } from "@/components/supplier/SupplierDetails";

export default function Page() {
  const [role, setRole] = useState("");
//   const navigation = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUser();
      setRole(res.data?.user?.role || "");
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {role === "vendor" ? (
          <VendorShopDetails />
        ) : (
          <>
            {/* Supplier Details Section */}
            <Card className="shadow-lg border rounded-2xl">
              <CardHeader>
                <CardTitle>Supplier Details</CardTitle>
              </CardHeader>
              <CardContent>
                <SupplierForm />
              </CardContent>
            </Card>

            {/* Offer Section */}
            <Card className="shadow-lg border rounded-2xl">
              <CardHeader>
                <CardTitle>Create & Manage Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <OfferCRUD />
              </CardContent>
            </Card>

            {/* Product Section */}
            <Card className="shadow-lg border rounded-2xl">
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductCRUD />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
