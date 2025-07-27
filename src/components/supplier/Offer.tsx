"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
      const res = await axios.post("/api/supplier/createoffer", {
        ...data,
        supplier: response?.data?.user?._id,
      });
      console.log("Offer created:", res.data);
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
    <div className="max-w-md mx-auto p-6 border rounded-md space-y-6 bg-white">
      <h2 className="text-2xl font-semibold">Create Offer</h2>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <Input type="text" placeholder="Product or Category" {...field} />
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

          <Button type="submit" className="w-full">
            Add Offer
          </Button>
        </form>
      </Form>

      <h3 className="text-xl font-semibold mt-6">Offers List</h3>
      {offers.length === 0 ? (
        <p className="text-muted-foreground">No offers created yet.</p>
      ) : (
        <ul className="space-y-3">
          {offers.map((offer) => (
            <li
              key={offer._id}
              className="border rounded-md p-4 bg-gray-50 flex justify-between items-start"
            >
              <div>
                <p><strong>From:</strong> {offer.fromDate}</p>
                <p><strong>To:</strong> {offer.toDate}</p>
                <p><strong>Offer On:</strong> {offer.offerOn}</p>
                <p><strong>Description:</strong> {offer.notes || "None"}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteOffer(offer._id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
