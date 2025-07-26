import mongoose, { model, models, Schema } from "mongoose";

type IGeoLocation = {
  type: 'Point';
  coordinates: [number, number]; 
};

type ISupplier = {
  _id?: mongoose.Types.ObjectId;
  shopName: string;
  shopLocation: IGeoLocation;
  address: string;
  shopDetails: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const GeoLocationSchema = new Schema<IGeoLocation>(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], 
      required: true,
      validate: {
        validator: (val: number[]) => val.length === 2,
        message: 'Coordinates must be an array of [longitude, latitude]',
      },
    },
  },
  { _id: false }
);

const SupplierSchema = new Schema<ISupplier>(
  {
    shopName: {
      type: String,
      required: [true, "Shop name is required"],
    },
    shopLocation: {
      type: GeoLocationSchema,
      required: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      maxlength: 15,
    },
    shopDetails: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

SupplierSchema.index({ shopLocation: "2dsphere" });

const Supplier = models?.Supplier || model<ISupplier>("Supplier", SupplierSchema);

export type { ISupplier, IGeoLocation };
export default Supplier;
