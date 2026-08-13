'use client';

import Link from "next/link";
import Image from "next/image";      
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const isActive = (path: string) => 
    pathname === path 
      ? "text-purple-600 font-bold border-b-2 border-purple-600" 
      : "text-slate-600 hover:text-purple-600 font-medium transition-all";

  return (
    
    <nav 
      className="w-full border-b border-slate-100 sticky top-0 z-50 px-6 py-7 bg-cover bg-right bg-no-repeat bg-white"
      style={{ backgroundImage: "url('/assets/images/topnav-bg.png')" }} 
    >
      
           
      
      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between">
        
        <Link 
          href="/" 
          className="flex items-center font-extrabold uppercase tracking-widest text-slate-900 gap-3"
          style={{ letterSpacing: '2px' }}
        >
          <Image 
            src="/assets/images/logo.png" 
            alt="ArtVault Logo" 
            width={48} 
            height={48} 
            className="object-contain"
            priority
          />
          <span className="text-xl">ArtVault</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-16 text-sm">
          <li><Link href="/" className={`pb-1 ${isActive("/")}`}>Home</Link></li>
          <li><Link href="/artworks" className={`pb-1 ${isActive("/artworks")}`}>Browse Art</Link></li>
          <li><Link href="/workshops" className={`pb-1 ${isActive("/workshops")}`}>Workshops</Link></li>
          <li><Link href="/artist" className={`pb-1 ${isActive("/artist")}`}>Artists</Link></li>
          <li><Link href="/about" className={`pb-1 ${isActive("/about")}`}>About Us</Link></li>
        </ul>

        {}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Hi, Artist 👋</span>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="text-sm px-5 py-2 text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="text-sm font-bold uppercase border-2 border-purple-500 text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-full transition-all tracking-wider"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="text-sm font-bold uppercase bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-full shadow-md transition-all tracking-wider"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}