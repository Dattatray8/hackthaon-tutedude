"use client";

// import axios from "axios"; // Note: Replace with your actual axios import
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Package,
  Search,
  TrendingUp,
  Clock,
  AlertCircle,
  Tag,
  FileText,
  Sparkles
} from "lucide-react";

type Offer = {
  _id: string;
  fromDate: string;
  toDate: string;
  offerOn: string;
  notes?: string;
  supplier?: object;
};

export default function Page() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      // Replace with your actual axios call
      // const res = await axios.get("/api/supplier/getoffers");
      // const offersData = res.data.data.offers || [];
      
      // Mock data for demonstration
      const offersData = [
        {
          _id: "1",
          fromDate: "2024-07-01",
          toDate: "2024-08-31",
          offerOn: "Summer Electronics Sale",
          notes: "Special discount on all electronic items including smartphones, laptops, and accessories",
        },
        {
          _id: "2",
          fromDate: "2024-07-25",
          toDate: "2024-07-27",
          offerOn: "Weekend Flash Sale",
          notes: "Limited time offer for weekend shoppers",
        },
        {
          _id: "3",
          fromDate: "2024-08-15",
          toDate: "2024-12-31",
          offerOn: "New Customer Welcome",
          notes: "Special discount for first-time buyers",
        }
      ];
      
      setOffers(offersData);
      setFilteredOffers(offersData);
    } catch (err) {
      console.error("Failed to fetch offers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Filter offers based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = offers.filter(offer =>
        offer.offerOn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (offer.notes && offer.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOffers(filtered);
    } else {
      setFilteredOffers(offers);
    }
  }, [offers, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getOfferStatus = (fromDate: string, toDate: string) => {
    const now = new Date();
    const start = new Date(fromDate);
    const end = new Date(toDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'expired';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Upcoming</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDaysRemaining = (toDate: string) => {
    const now = new Date();
    const end = new Date(toDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate stats
  const activeOffers = offers.filter(offer => getOfferStatus(offer.fromDate, offer.toDate) === 'active').length;
  const upcomingOffers = offers.filter(offer => getOfferStatus(offer.fromDate, offer.toDate) === 'upcoming').length;
  const expiringSoon = offers.filter(offer => {
    const status = getOfferStatus(offer.fromDate, offer.toDate);
    const daysRemaining = getDaysRemaining(offer.toDate);
    return status === 'active' && daysRemaining <= 7;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600">Loading your offers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 shadow-sm rounded-lg">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Offers</h1>
                <p className="text-slate-600 mt-1">
                  Manage and track all your promotional offers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Offers</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{offers.length}</p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">All time</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                  <Package className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Offers</p>
                  <p className="text-3xl font-bold text-green-700 mt-1">{activeOffers}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">Running now</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">{upcomingOffers}</p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">Scheduled</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Expiring Soon</p>
                  <p className="text-3xl font-bold text-orange-700 mt-1">{expiringSoon}</p>
                  <p className="text-xs text-orange-600 mt-1 font-medium">Within 7 days</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search offers by product or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Offers List */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="h-6 w-6 text-green-600" />
                <span className="text-xl">Your Offers</span>
              </div>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {filteredOffers.length} {filteredOffers.length === 1 ? 'Offer' : 'Offers'}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {filteredOffers.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {searchTerm ? 'No matching offers found' : 'No offers created yet'}
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  {searchTerm 
                    ? 'Try adjusting your search terms to find what you\'re looking for.' 
                    : 'Start creating offers to promote your products and attract more customers.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredOffers.map((offer) => {
                  const status = getOfferStatus(offer.fromDate, offer.toDate);
                  const daysRemaining = getDaysRemaining(offer.toDate);
                  
                  return (
                    <Card key={offer._id} className="border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Left colored strip based on status */}
                          <div className={`w-2 ${
                            status === 'active' ? 'bg-gradient-to-b from-green-400 to-green-600' :
                            status === 'upcoming' ? 'bg-gradient-to-b from-blue-400 to-blue-600' :
                            'bg-gradient-to-b from-red-400 to-red-600'
                          }`}></div>
                          
                          {/* Main content */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                              <div className="flex-1 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <h3 className="text-xl font-semibold text-slate-900">
                                        {offer.offerOn}
                                      </h3>
                                      {getStatusBadge(status)}
                                    </div>
                                    
                                    {offer.notes && (
                                      <div className="flex items-start space-x-2">
                                        <FileText className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-slate-600 leading-relaxed">
                                          {offer.notes}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Date Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                                      <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Start Date</p>
                                      <p className="text-sm font-semibold text-blue-900">
                                        {formatDate(offer.fromDate)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                                    <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                                      <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-red-600 uppercase tracking-wide">End Date</p>
                                      <p className="text-sm font-semibold text-red-900">
                                        {formatDate(offer.toDate)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Additional Info */}
                                {status === 'active' && daysRemaining <= 7 && daysRemaining > 0 && (
                                  <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                    <p className="text-sm font-medium text-orange-800">
                                      Expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                                    </p>
                                  </div>
                                )}
                                
                                {status === 'upcoming' && (
                                  <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    <p className="text-sm font-medium text-blue-800">
                                      Starts in {Math.ceil((new Date(offer.fromDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}