"use client"

import React, { useEffect } from 'react'
import { OfferCRUD } from '@/components/supplier/Offer';
import { ProductCRUD } from '@/components/supplier/Products';

function page() {
  useEffect(() => {
    document.title = "TuteDude | Supplier Onboarding";
  }, []);
  return (
    <div>
      <OfferCRUD />
      <ProductCRUD />
    </div>
  )
}

export default page
