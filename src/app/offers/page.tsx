"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [offers, setOffers] = useState<any[]>([]); 

  const fetchOffers = async () => {
    try {
      const res = await axios.get("/api/supplier/getoffers");
      setOffers(res.data.data.offers || []);
    } catch (err) {
      console.error("Failed to fetch offers", err);
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      await axios.delete(`/api/supplier/getoffers?id=${id}`);
      setOffers((prev) => prev.filter((offer) => offer._id !== id)); 
    } catch (err) {
      console.error("Failed to delete offer", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold my-6">Offers List</h3>

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
