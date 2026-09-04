'use client';

import Link from "next/link";
import Image from "next/image";      
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";



export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"artist" | "customer" | null>(null);

useEffect(() => {
     const fetchRole = async (userId: string) => {
      const { data } = await supabase
        .from("artist")
        .select("auth_id")
        .eq("auth_id", userId)
        .maybeSingle(); 
        
      setUserRole(data ? "artist" : "customer");
    };

    const checkInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) await fetchRole(user.id);
    };
    checkInitialUser();

    // 3. Live listener for logins/logouts
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setUserRole(null); // Clear role on logout
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    /* router.push("/auth/login"); */ 
    alert("You have been logged out successfully.");
  };

  const isActive = (path: string) =>{
    const isCurrentActive =
      path === "/" 
        ? pathname === "/" 
        : pathname.startsWith(path);

    return isCurrentActive
      ? "text-purple-600 font-bold border-b-2 border-purple-600"
      : "text-slate-600 hover:text-purple-600 font-medium transition-all";
  };

  if (pathname.startsWith('/checkout')) {
    return null; 
  }



  if (pathname.startsWith('/checkout')) {
    return null; 
  }

  return (
    
    <nav 
      className="w-full border-b border-slate-100 sticky top-0 z-50 px-6 py-3 bg-cover bg-right bg-no-repeat bg-white"
      style={{ backgroundImage: "url('/assets/images/topnav-bg.png')" }} 
    >
      
           
      
      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between">
        
        <Link 
          href="/" 
          className="flex items-center font-extrabold uppercase tracking-widest text-slate-900 gap-3"
          style={{ letterSpacing: '2px' }}
        >

          <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-2xl text-gray-700"
        >
          {/* lg class applies when the screen width is 1024px or larger. */}


          {isOpen ? "✕" : "☰"}

        </button>
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

        <ul className={`
            ${isOpen ? "flex flex-col absolute top-full left-0 w-full bg-white p-6 border-b shadow-lg gap-4" : "hidden"}

            lg:flex lg:flex-row lg:static lg:w-auto lg:p-0 lg:border-none lg:shadow-none lg:gap-16 text-sm
          `}>
          <li><Link href="/" className={`pb-1 ${isActive("/")}`}>Home</Link></li>
          <li><Link href="/artworks" className={`pb-1 ${isActive("/artworks")}`}> Browse Art</Link></li>
          <li><Link href="/workshops" className={`pb-1 ${isActive("/workshops")}`}>Workshops</Link></li>
          <li><Link href="/artists" className={`pb-1 ${pathname?.startsWith("/artist") ? "text-purple-600 font-bold border-b-2 border-purple-600" : "text-slate-600 hover:text-purple-600 font-medium transition-all"}`}>Artists</Link></li>
          <li><Link href="/about" className={`pb-1 ${isActive("/about")}`}>About Us</Link></li>
        </ul>

        {}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href={userRole === "artist" ? "/artist-dashboard" : "/customer-dashboard"} 
                className="text-sm font-bold uppercase border-2 border-purple-500 text-white bg-gradient-to-r from-purple-700 to-purple-300 hover:from-purple-300 hover:to-purple-700 px-6 py-2 rounded-full transition-all tracking-wider"
              >
                {userRole === "artist" ? "Artist Dashboard" : "My Profile"}
              </Link>
              
              <button 
                onClick={handleLogout}
                className="text-sm font-bold uppercase border-2 border-red-500 bg-gradient-to-r from-red-700 to-red-300 text-white hover:from-red-300 hover:to-red-700 px-6 py-2 rounded-full shadow-md transition-all tracking-wider"
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