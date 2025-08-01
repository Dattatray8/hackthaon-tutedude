import mongoose, { model, models, Schema } from "mongoose";

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
      ref: "Supplier",
      required:true
    }
  },
  { _id: true } 
);

const Offer = models?.Offer || model<IOffer>("Offer", OfferSchema);
export default Offer;