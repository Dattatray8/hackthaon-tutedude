import React from 'react'
import { SupplierForm } from "@/components/supplier/SupplierDetails";
import { OfferCRUD } from '@/components/supplier/Offer';
import { ProductCRUD } from '@/components/supplier/Products';

function page() {
  return (
    <div>
      <SupplierForm />
      <OfferCRUD />
      <ProductCRUD />
    </div>
  )
}

export default page
