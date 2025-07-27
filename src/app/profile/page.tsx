"use client"
import { getCurrentUser } from '@/helpers/client/auth.client'
import React, { useEffect, useState } from 'react'
import { SupplierForm } from "@/components/supplier/SupplierDetails";
import VendorShopDetails from "@/components/vendor/VendorShopDetails";

function page() {
    const [role,setRole] = useState("")
    useEffect(()=>{
        const fetchUser = async()=>{
            let res = await  getCurrentUser()
            console.log(res.data?.user?.role)
            setRole(res.data?.user?.role)
        }
        fetchUser()
    },[])
  return (
    
        role === "vendor" ? (
            <VendorShopDetails />
        ) : (
            <SupplierForm />
        ) 
    
  )
}

export default page
