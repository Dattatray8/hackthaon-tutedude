import mongoose, { Schema } from "mongoose";

export interface IOffer {
  fromDate: Date;
  toDate: Date;
  offerOn: string;
  supplier: mongoose.Types.ObjectId;
  notes?: string;
}

export const OfferSchema = new Schema<IOffer>(
  {
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    offerOn: { type: String, required: true },
    notes: { type: String },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier"
    }
  },
  { _id: true } // keep _id for offers (optional)
);

// OfferSchema.find().populate("supplier")
