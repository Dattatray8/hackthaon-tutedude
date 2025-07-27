"use client";

import { getCurrentUser } from "@/helpers/client/auth.client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VendorShopDetails from "@/components/vendor/VendorShopDetails";
import { OfferCRUD } from "@/components/supplier/Offer";
import { ProductCRUD } from "@/components/supplier/Products";
import { SupplierForm } from "@/components/supplier/SupplierDetails";
import { 
  Store, 
  Package, 
  Tag, 
  User, 
  TrendingUp, 
  Settings,
  Shield,
  Bell,
  Edit,
  MapPin,
  Building
} from "lucide-react";
import { IUser } from "@/models/user.model";
import { toast } from "sonner";

interface User {
  _id: string;
  role: string;
  name?: string;
  email?: string;
}

interface Supplier {
  shopName: string;
  address: string;
  category: string;
  // Add other supplier properties as needed
}

export default function Page() {
  const [user, setUser] = useState<IUser | null>(null);
  const [userId, setUserId] = useState("");
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const {data, error} = await getCurrentUser();
        if(error){
            toast.error(error.message);
            return;
        }
        const userData = data;
        const id = String(userData?._id);
        
        setUser(userData || null);
        setUserId(id);

        // Fetch supplier details only if role is supplier
        if (userData?.role === "supplier" && id) {
          const supplierRes = await fetch(`/api/getsupplier?user=${id}`);
          const data = await supplierRes.json();
          console.log(data.data);
          
          if (data.success) {
            setSupplier(data.data.supplier);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isVendor = user?.role === "vendor";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                {isVendor ? (
                  <Store className="h-6 w-6 text-white" />
                ) : (
                  <Package className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {isVendor ? "Vendor Dashboard" : "Supplier Dashboard"}
                </h1>
                <p className="text-slate-600">
                  Welcome back, {user?.username || "User"}
                </p>
              </div>
            </div>
            <Badge 
              variant={isVendor ? "default" : "secondary"}
              className="px-3 py-1 text-sm font-medium"
            >
              {user?.role?.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isVendor ? (
          <VendorDashboard />
        ) : (
          <SupplierDashboard 
            supplier={supplier}
            userId={userId}
            editMode={editMode}
            setEditMode={setEditMode}
            setSupplier={setSupplier}
          />
        )}
      </div>
    </div>
  );
}

function VendorDashboard() {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Active Orders" 
          value="24" 
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+12%" 
        />
        <StatsCard 
          title="Total Suppliers" 
          value="8" 
          icon={<User className="h-5 w-5" />}
          trend="+2 new" 
        />
        <StatsCard 
          title="Revenue" 
          value="₹45,280" 
          icon={<Store className="h-5 w-5" />}
          trend="+8.2%" 
        />
      </div>

      {/* Main Content */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Store className="h-5 w-5 text-blue-600" />
            <span>Shop Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VendorShopDetails />
        </CardContent>
      </Card>
    </div>
  );
}

function SupplierDashboard({ 
  supplier, 
  userId, 
  editMode, 
  setEditMode, 
}: {
  supplier: Supplier | null;
  userId: string;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  setSupplier: (supplier: Supplier | null) => void;
}) {
  // Show setup prompt if no supplier profile exists
  if (!supplier && !editMode) {
    return (
      <div className="space-y-8">
        <Card className="shadow-lg  bg-white/70 backdrop-blur-sm border-dashed border-2 border-blue-300">
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Complete Your Supplier Profile
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Set up your supplier profile to start managing offers and products. 
                  This information will be visible to vendors in your network.
                </p>
              </div>
              <Button 
                onClick={() => setEditMode(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <User className="h-4 w-4 mr-2" />
                Set Up Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show form if in edit mode or no supplier exists
  if (editMode || !supplier) {
    return (
      <div className="space-y-8">
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>{supplier ? "Edit Supplier Profile" : "Create Supplier Profile"}</span>
              </CardTitle>
              {supplier && (
                <Button 
                  variant="outline" 
                  onClick={() => setEditMode(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <SupplierForm userId={userId} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Products" 
          value="156" 
          icon={<Package className="h-5 w-5" />}
          trend="+23 new" 
        />
        <StatsCard 
          title="Live Offers" 
          value="12" 
          icon={<Tag className="h-5 w-5" />}
          trend="3 expiring" 
        />
        <StatsCard 
          title="Orders" 
          value="89" 
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+15%" 
        />
        <StatsCard 
          title="Revenue" 
          value="₹2,34,560" 
          icon={<Store className="h-5 w-5" />}
          trend="+12.3%" 
        />
      </div>

      {/* Supplier Profile Card */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>Supplier Profile</span>
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setEditMode(true)}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Store className="h-4 w-4" />
                <span>Shop Name</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {supplier.shopName}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4" />
                <span>Address</span>
              </div>
              <p className="text-slate-700">
                {supplier.address}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Tag className="h-4 w-4" />
                <span>Category</span>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                {supplier.category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content - Only show if supplier profile exists */}
      <Tabs defaultValue="offers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] h-12 bg-white shadow-sm">
          <TabsTrigger value="offers" className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Offers</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-green-600" />
                  <span>Manage Offers</span>
                </div>
                <Badge variant="outline" className="px-2 py-1">
                  12 Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OfferCRUD />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  <span>Product Catalog</span>
                </div>
                <Badge variant="outline" className="px-2 py-1">
                  156 Items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductCRUD />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Two-Factor Authentication</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Email Verification</span>
                    <Badge variant="default">Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Order Updates</span>
                    <Badge variant="default">On</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Marketing Emails</span>
                    <Badge variant="secondary">Off</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  icon, 
  trend 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend: string; 
}) {
  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>
          </div>
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}