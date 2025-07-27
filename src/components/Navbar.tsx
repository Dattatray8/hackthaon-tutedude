"use client";

import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/helpers/client/auth.client";
import { IUser } from "@/models/user.model";
import { useRouter } from "next/navigation";

function NavItem({ label, href }: { label: string, href:string }) {
  const navigation = useRouter()
  return (
    <span className="cursor-pointer text-sm font-medium hover:text-primary" onClick={()=>{navigation.push(href)}}>
      {label}
    </span>
  );
}

export function NavbarType1() {
  const [user, setUser] = useState<IUser | null>(null);
  const navigation = useRouter()
  return (
    <nav className="hidden md:flex justify-between items-center px-6 py-3 border-b bg-background">
      <div className="flex items-center space-x-3">
        {/* <Avatar>
          <AvatarImage src="/logo.png" alt="Logo" />
          <AvatarFallback>App</AvatarFallback>
        </Avatar> */}
        <span className="text-lg font-bold">MyApp</span>
      </div>

      <div className="flex items-center space-x-6">
        <NavItem label="Profile" href="/profile"/>
        <NavItem label="Offers" href="/offers"/>
        <NavItem label="Suppliers" href="/suppliers"/>
      </div>

      <Button variant="destructive" className="bg-black hover:bg-[#181717cd] cursor-pointer" onClick={async () => {
        const res = await logoutUser()
        console.log(res)
        setUser(null)
        if (!user) {
          navigation.push('/dashboard')
        }
      }}>Logout</Button>
    </nav>
  );
}

// ✅ Navbar for Supplier
export function NavbarType2() {
  const [user, setUser] = useState<IUser | null>(null);
  const navigation = useRouter()
  return (
    <nav className="hidden md:flex justify-between items-center px-6 py-3 border-b bg-background">
      <div className="flex items-center space-x-3">
        <span className="text-lg font-bold">MyApp</span>
        {/* <Avatar>
          <AvatarImage src="/logo.png" alt="Logo" />
          <AvatarFallback>App</AvatarFallback>
        </Avatar> */}
      </div>

      <div className="flex items-center space-x-4">
        <NavItem label="Profile" href="/profile"/>
        <Button variant="destructive" onClick={async () => {
          const res = await logoutUser()
          console.log(res)
          setUser(null)
          if (!user) {
            navigation.push('/dashboard')
          }
        }} className="bg-black hover:bg-[#181717cd] cursor-pointer">Logout</Button>
      </div>
    </nav>
  );
}

export function NavbarType3() {
  const navigation = useRouter()
  return (
    <nav className="hidden md:flex justify-between items-center px-6 py-3 border-b bg-background">
      <div className="flex items-center space-x-3">
        <span className="text-lg font-bold">MyApp</span>
        {/* <Avatar>
          <AvatarImage src="/logo.png" alt="Logo" />
          <AvatarFallback>App</AvatarFallback>
        </Avatar> */}
      </div>

      <Button onClick={()=>{
        navigation.push('/login')
      }}>Login</Button>
    </nav>
  );
}

export default function ClientNavbar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUser();
      setRole(res.data?.user?.role || "");
    };
    fetchUser();
  }, []);

  if (role === "vendor") return <NavbarType1 />;
  if (role === "supplier") return <NavbarType2 />;
  return <NavbarType3 />;
}
