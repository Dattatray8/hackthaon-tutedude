"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

type Supplier = {
  _id: string;
  username: string;
  phone: string;
  role: string;
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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Suppliers List</h2>

      {loading ? (
        <p className="text-muted-foreground">Loading suppliers...</p>
      ) : suppliers.length === 0 ? (
        <p className="text-muted-foreground">No suppliers found.</p>
      ) : (
        <div className="space-y-4">
          {suppliers.map((supplier) => (
            <Card key={supplier._id} className="shadow-sm">
              <CardHeader>
                <CardTitle>{supplier.username}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Phone:</strong> {supplier.phone}</p>
                {/* <Sep className="my-2" /> */}
                <p className="text-sm text-gray-500">Role: {supplier.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
