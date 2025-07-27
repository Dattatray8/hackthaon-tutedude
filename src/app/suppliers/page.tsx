"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Supplier = {
  _id: string;
  username: string;
  phone: string;
  role: string;
};

// Generate initials for avatar
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

// Map roles to badge colors
const roleClass = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-700";
    case "supplier":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("/api/supplier/getallsuppliers");
      setSuppliers(res.data.data.suppliers || []);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Suppliers List</h2>

      {loading ? (
        <div className="flex justify-center my-10 text-gray-400 text-lg">
          Loading suppliers...
        </div>
      ) : suppliers.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-10 text-center text-gray-500 shadow">
          <span className="text-4xl mb-4 block">📦</span>
          <div>No suppliers found.</div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <Card
              key={supplier._id}
              className="hover:shadow-lg transition border-2 border-gray-50 rounded-xl"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-1">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg text-gray-600 ring-2 ring-gray-300 shadow-inner">
                  {getInitials(supplier.username)}
                </div>
                <CardTitle className="flex-1 text-lg truncate">
                  {supplier.username}
                </CardTitle>
                <span
                  className={
                    "ml-2 px-3 py-1 rounded-full font-medium text-xs " +
                    roleClass(supplier.role)
                  }
                >
                  {supplier.role}
                </span>
              </CardHeader>
              <CardContent className="pt-2 text-gray-700">
                <div className="mb-2">
                  <strong>Phone: </strong>
                  <a
                    href={`tel:${supplier.phone}`}
                    className="hover:underline text-blue-700"
                  >
                    {supplier.phone}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
