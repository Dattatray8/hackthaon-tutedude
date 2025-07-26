"use client"

import { useState, ChangeEvent } from "react";

type Product = {
  id: number;
  name: string;
  imageUrl: string;
};

export function ProductCRUD() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !imageFile) {
      alert("Please enter product name and select an image.");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      imageUrl: preview,
    };

    setProducts([...products, newProduct]);
    setProductName("");
    setImageFile(null);
    setPreview("");
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded space-y-4">
      <h2 className="text-xl font-semibold">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={handleNameChange}
            className="w-full border p-1"
            placeholder="Product name"
          />
        </div>
        <div>
          <label>Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 max-h-40 object-contain" />
          )}
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Product</button>
      </form>

      <h3 className="mt-6 font-semibold">Products List</h3>
      {products.length === 0 && <p>No products added yet.</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id} className="border p-2 mb-2 rounded flex items-center gap-4">
            <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded" />
            <span>{p.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
