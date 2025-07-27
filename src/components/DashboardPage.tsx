"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { IUser, UserRole } from "@/models/user.model";
import { useEffect, useState } from "react";

const dummyFeed = [
  {
    _id: "1",
    title: "Bulk Rice Offer",
    category: "Food Grains",
    description: "High quality rice available at discounted rates.",
    supplierName: "Sharma Agro",
    vendorName: "FreshMart",
  },
  {
    _id: "2",
    title: "Request for 1000kg Sugar",
    category: "Groceries",
    description: "Looking for bulk sugar suppliers for retail chain.",
    supplierName: "SweetSupplies",
    vendorName: "BigBazaar",
  },
  {
    _id: "3",
    title: "Vegetable Supply Needed",
    category: "Vegetables",
    description: "Daily supply of fresh vegetables required.",
    supplierName: "GreenFarms",
    vendorName: "VeggieMart",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [feed] = useState(dummyFeed);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/users");
        const userData = response.data?.user;
        if (!userData) throw new Error("User not found");
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto mt-50">
      <h1 className="text-3xl font-bold mb-6">
        {user.role === "supplier"
          ? "Supplier Offers Feed"
          : "Vendor Requests Feed"}
      </h1>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feed.map((item) => (
          <Card key={item._id} className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <Badge variant="outline">{item.category}</Badge>
              </div>
              <p className="text-gray-700 mb-2">{item.description}</p>
              {user.role === UserRole.vendor && (
                <p className="text-sm text-gray-500">
                  From: {item.supplierName}
                </p>
              )}
              {user.role === UserRole.supplier && (
                <p className="text-sm text-gray-500">
                  Requested by: {item.vendorName}
                </p>
              )}
              <Button className="mt-4">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  );
}
