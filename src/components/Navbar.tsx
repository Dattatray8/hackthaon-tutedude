"use client";

import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/helpers/client/auth.client";

function NavItem({ label }: { label: string }) {
  return (
    <span className="cursor-pointer text-sm font-medium hover:text-primary">
      {label}
    </span>
  );
}

// ✅ Navbar for Vendor
export function NavbarType1() {
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
        <NavItem label="Profile" />
        <NavItem label="Offers" />
        <NavItem label="Suppliers" />
      </div>

      <Button variant="destructive">Logout</Button>
    </nav>
  );
}

// ✅ Navbar for Supplier
export function NavbarType2() {
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
        <NavItem label="Profile" />
        <Button variant="destructive">Logout</Button>
      </div>
    </nav>
  );
}

// ✅ Navbar for Guests
export function NavbarType3() {
  return (
    <nav className="hidden md:flex justify-between items-center px-6 py-3 border-b bg-background">
      <div className="flex items-center space-x-3">
        <span className="text-lg font-bold">MyApp</span>
        {/* <Avatar>
          <AvatarImage src="/logo.png" alt="Logo" />
          <AvatarFallback>App</AvatarFallback>
        </Avatar> */}
      </div>

      <Button>Login</Button>
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
