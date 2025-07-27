"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Tag, Calendar, FileText } from "lucide-react";

type Offer = {
  _id: string;
  fromDate: string;
  toDate: string;
  offerOn: string;
  notes?: string;
  supplier?: object;
};

type OfferForm = {
  fromDate: string;
  toDate: string;
  offerOn: string;
  notes?: string;
  supplier?: string;
};

export function OfferCRUD() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const form = useForm<OfferForm>({
    defaultValues: {
      fromDate: "",
      toDate: "",
      offerOn: "",
      notes: "",
    },
  });

  const fetchOffers = async () => {
    try {
      const res = await axios.get("/api/supplier/getoffers");
      setOffers(res.data.data.offers || []);
    } catch (err) {
      console.error("Failed to fetch offers", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const onSubmit = async (data: OfferForm) => {
    try {
      const response = await axios.get("/api/users");
      await axios.post("/api/supplier/createoffer", {
        ...data,
        supplier: response?.data?.user?._id,
      });
      fetchOffers();
      form.reset();
    } catch (err) {
      console.error("Error creating offer", err);
    }
  };

  const deleteOffer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      await axios.delete(`/api/supplier/deleteoffer/?id=${id}`);
      setOffers((prev) => prev.filter((offer) => offer._id !== id));
    } catch (err) {
      console.error("Error deleting offer", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Offer Form */}
      <Card className="shadow-lg border rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            🏷️ Create Offer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="offerOn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer On</FormLabel>
                    <FormControl>
                      <Input placeholder="Product or Category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any additional notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">➕ Add Offer</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Offers List */}
      <h3 className="text-lg font-semibold">📋 Offers List</h3>
      {offers.length === 0 ? (
        <p className="text-gray-500">No offers created yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <Card key={offer._id} className="shadow-md border rounded-2xl p-4 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-blue-600" /> <strong>From:</strong> {offer.fromDate}</p>
                <p className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-blue-600" /> <strong>To:</strong> {offer.toDate}</p>
                <p className="flex items-center gap-2 text-sm"><Tag className="w-4 h-4 text-purple-600" /> <strong>Offer On:</strong> {offer.offerOn}</p>
                <p className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-gray-600" /> <strong>Notes:</strong> {offer.notes || "None"}</p>
              </div>
              <Button variant="destructive" size="sm" className="mt-3 w-full" onClick={() => deleteOffer(offer._id)}>
                🗑️ Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
