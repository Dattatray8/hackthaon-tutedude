"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

type Offer = {
  _id: string;
  fromDate: string;
  toDate: string;
  offerOn: string;
  notes?: string;
  supplier?: object;
};

export default function Page() {
  const [offers, setOffers] = useState<Offer[]>([]);

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
