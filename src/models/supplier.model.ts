import mongoose, { model, models, Schema } from "mongoose";

type IProduct = {
  name: string;
  img: string;
};

type IGeoLocation = {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
};

type ISupplier = {
  _id?: mongoose.Types.ObjectId;
  shopName: string;
  shopLocation: IGeoLocation;
  address: string;
  category: string;
  products: IProduct[];
  user: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

// Product sub-schema
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    img: {
      type: String,
      required: [true, "Product image is required"],
    },
  },
  { _id: false }
);

// GeoJSON schema for shopLocation
const GeoLocationSchema = new Schema<IGeoLocation>(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: (val: number[]) => val.length === 2,
        message: 'Coordinates must be an array of [longitude, latitude]',
      },
    },
  },
  { _id: false }
);

// Main supplier schema
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
    category: {
      type: String,
      required: true,
    },
    products: {
      type: [ProductSchema],
      default: [],
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: Create a 2dsphere index for geospatial queries
SupplierSchema.index({ shopLocation: "2dsphere" });

const Supplier = models?.Supplier || model<ISupplier>("Supplier", SupplierSchema);

export type { ISupplier, IProduct, IGeoLocation };
export default Supplier;
