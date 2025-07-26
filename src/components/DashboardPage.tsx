'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (!session) return router.push('/login');

      const userRes = await axios.get('/api/me');
      setUser(userRes.data);

      const feedRes = await axios.get('/api/feed');
      setFeed(feedRes.data);
    };

    fetchData();
  }, [router]);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {user.role === 'Vendor' ? 'Supplier Offers Feed' : 'Vendor Requests Feed'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feed.map((item) => (
          <Card key={item._id} className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <Badge variant="outline">{item.category}</Badge>
              </div>
              <p className="text-gray-700 mb-2">{item.description}</p>
              {user.role === 'Vendor' && (
                <p className="text-sm text-gray-500">From: {item.supplierName}</p>
              )}
              {user.role === 'Supplier' && (
                <p className="text-sm text-gray-500">Requested by: {item.vendorName}</p>
              )}
              <Button className="mt-4">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
