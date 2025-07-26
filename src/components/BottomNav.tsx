"use client";

import { Home, User, ShoppingCart, Settings } from "lucide-react";
import React from "react";
import Link from "next/link"; // or use react-router-dom if you're not using Next.js
import { usePathname } from "next/navigation";

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  if(pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null; // Hide the bottom nav on login and register pages
  }   
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md md:hidden">
      <ul className="flex justify-between items-center px-6 py-2">
        <NavItem label="Home" href="/" icon={<Home className="h-5 w-5" />} />
        <NavItem label="Cart" href="/cart" icon={<ShoppingCart className="h-5 w-5" />} />
        <NavItem label="Profile" href="/profile" icon={<User className="h-5 w-5" />} />
        <NavItem label="Settings" href="/settings" icon={<Settings className="h-5 w-5" />} />
      </ul>
    </nav>
  );
};

type NavItemProps = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const NavItem: React.FC<NavItemProps> = ({ label, icon, href }) => (
  <li>
    <Link href={href} className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-500">
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  </li>
);

export default BottomNav;
