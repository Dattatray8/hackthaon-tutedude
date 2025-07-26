"use client"

import { useState } from "react";

type Offer = {
  id: number;
  fromDate: string;
  toDate: string;
  offerOn: string;
  notes: string;
};

export function OfferCRUD() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [form, setForm] = useState({
    fromDate: "",
    toDate: "",
    offerOn: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fromDate || !form.toDate || !form.offerOn) {
      alert("Please fill From Date, To Date, and Offer On");
      return;
    }
    setOffers([...offers, { ...form, id: Date.now() }]);
    setForm({ fromDate: "", toDate: "", offerOn: "", notes: "" });
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded space-y-4">
      <h2 className="text-xl font-semibold">Create Offer</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label>From Date</label>
          <input type="date" name="fromDate" value={form.fromDate} onChange={handleChange} className="w-full border p-1" />
        </div>
        <div>
          <label>To Date</label>
          <input type="date" name="toDate" value={form.toDate} onChange={handleChange} className="w-full border p-1" />
        </div>
        <div>
          <label>Offer On</label>
          <input
            type="text"
            name="offerOn"
            placeholder="Product or Category"
            value={form.offerOn}
            onChange={handleChange}
            className="w-full border p-1"
          />
        </div>
        <div>
          <label>Notes</label>
          <textarea
            name="notes"
            placeholder="Any additional notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border p-1"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Offer</button>
      </form>

      <h3 className="mt-6 font-semibold">Offers List</h3>
      {offers.length === 0 && <p>No offers created yet.</p>}
      <ul>
        {offers.map((offer) => (
          <li key={offer.id} className="border p-2 mb-2 rounded">
            <p><b>From:</b> {offer.fromDate}</p>
            <p><b>To:</b> {offer.toDate}</p>
            <p><b>Offer On:</b> {offer.offerOn}</p>
            <p><b>Notes:</b> {offer.notes || "None"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
