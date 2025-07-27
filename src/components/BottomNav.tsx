"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/helpers/client/auth.client";
import { Home, Users, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IUser } from "@/models/user.model";

function BottomNavItem({ label, icon, href }: { label: string; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  );
}

export function BottomNavVendor() {
  const [user, setUser] = useState<IUser | null>(null);
  const navigation = useRouter()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 md:hidden">
      <BottomNavItem label="Profile" href="/profile" icon={<User className="h-5 w-5" />} />
      <BottomNavItem label="Offers" href="/offers" icon={<ShoppingCart className="h-5 w-5" />} />
      <BottomNavItem label="Suppliers" href="/suppliers" icon={<Users className="h-5 w-5" />} />
      <Button variant="destructive" className="bg-black" size="sm" onClick={async()=>{
        let res = await logoutUser()
        console.log(res)
        setUser(null)
        if(!user){
          navigation.push('/dashboard')
        }
      }}>Logout</Button>
    </nav>
  );
}

export function BottomNavSupplier() {
  const [user, setUser] = useState<IUser | null>(null);
  const navigation = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 md:hidden">
      <BottomNavItem label="Profile" href="/profile" icon={<User className="h-5 w-5" />} />
      <Button variant="destructive" size="sm" onClick={async()=>{
        let res = await logoutUser()
        console.log(res)
        setUser(null)
        if(!user){
          navigation.push('/dashboard')
        }
      }}>Logout</Button>
    </nav>
  );
}

export function BottomNavGuest() {
  const navigation = useRouter()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around py-2 md:hidden">
      <BottomNavItem label="Home" href="/" icon={<Home className="h-5 w-5" />} />
      <Button size="sm" onClick={()=>{navigation.push('/login')}}>Login</Button>
    </nav>
  );
}

export default function ClientBottomNav() {
  const [role, setRole] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUser();
      setRole(res.data?.user?.role || "");
    };
    fetchUser();
  }, []);

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  if (role === "vendor") return <BottomNavVendor />;`x`
  if (role === "supplier") return <BottomNavSupplier />;
  return <BottomNavGuest />;
}
