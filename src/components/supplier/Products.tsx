"use client";

import Image from "next/image";
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadFile from "../imagekit/UploadFile";

type Product = {
  id: number;
  name: string;
  imageUrl: string;
};

export function ProductCRUD() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !preview) {
      alert("Please enter product name and upload an image.");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      imageUrl: preview,
    };

    setProducts([...products, newProduct]);
    setProductName("");
    setPreview(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-md space-y-6 bg-white">
      <h2 className="text-2xl font-semibold">Add Product</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="productName" className="block mb-1 font-medium">
            Product Name
          </label>
          <Input
            id="productName"
            type="text"
            value={productName}
            onChange={handleNameChange}
            placeholder="Product name"
            required
          />
        </div>

        <div>
          <UploadFile setFileUrl={(url) => setPreview(url)} />
          {preview && (
            <div className="mt-3 max-h-40 w-full relative">
              <Image
                src={preview}
                alt="Preview"
                fill
                style={{ objectFit: "contain" }}
                className="rounded-md"
                sizes="(max-width: 400px) 100vw, 400px"
                unoptimized
              />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">
          Add Product
        </Button>
      </form>

      <h3 className="text-xl font-semibold mt-6">Products List</h3>
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products added yet.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((p) => (
            <li
              key={p.id}
              className="border rounded-md p-4 flex items-center gap-4 bg-gray-50 dark:bg-gray-800"
            >
              <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="64px"
                  unoptimized
                />
              </div>
              <span className="font-medium">{p.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
