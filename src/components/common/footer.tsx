'use client';

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    // 🌟 1. Main Footer Wrapper (The background image asset fills only this section)
    <footer 
      className="w-full border-t border-slate-100 bg-white py-12 px-6 bg-cover bg-bottom bg-no-repeat relative mt-auto"
      style={{ backgroundImage: "url('/assets/images/footer-bg.png')" }} // Reuses the background asset cleanly!
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 🧩 2. Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 justify-between">
          
          {/* COLUMN 1: BRAND & NEWSLETTER (Left Side) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/assets/images/logo.png" 
                alt="ArtVault Logo" 
                width={64} 
                height={64} 
                className="object-contain"
              />
              <span className="text-2xl font-black uppercase tracking-wider text-slate-900">ArtVault</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Empowering creators to share their vision with the world through a secure, curated digital gallery experience.
            </p>
            
            {/* Stay Inspired Section */}
            <div className="mt-2 flex flex-col gap-2">
              <h6 className="text-xs font-black uppercase tracking-widest text-slate-900">Stay Inspired</h6>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input 
                  type="email" 
                  placeholder="ENTER YOUR EMAIL FOR UPDATES" 
                  className="w-full sm:max-w-[240px] px-4 py-2 text-xs font-bold border border-slate-200 rounded-full bg-white focus:outline-none focus:border-purple-500 transition-all uppercase placeholder:text-slate-400"
                />
                <button className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-md hover:from-blue-700 hover:to-purple-700 transition-all uppercase tracking-wider">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS (Center-Left) */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2 lg:offset-1 flex flex-col gap-3">
            <h6 className="text-xs font-black uppercase tracking-widest text-slate-900">Quick Links</h6>
            <ul className="flex flex-col gap-2 text-sm text-slate-600 font-medium">
              <li><Link href="/" className="hover:text-purple-600 transition-colors flex items-center gap-1"><span className="text-purple-500 font-bold">&gt;</span> Home</Link></li>
              <li><Link href="/artworks" className="hover:text-purple-600 transition-colors flex items-center gap-1"><span className="text-purple-500 font-bold">&gt;</span> Browse Art</Link></li>
              <li><Link href="/workshops" className="hover:text-purple-600 transition-colors flex items-center gap-1"><span className="text-purple-500 font-bold">&gt;</span> Workshops</Link></li>
              <li><Link href="/artist" className="hover:text-purple-600 transition-colors flex items-center gap-1"><span className="text-purple-500 font-bold">&gt;</span> Artists</Link></li>
              <li><Link href="/about" className="hover:text-purple-600 transition-colors flex items-center gap-1"><span className="text-purple-500 font-bold">&gt;</span> About Us</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT (Center-Right) */}
                      <div className="col-span-6 md:col-span-3 lg:col-span-2 flex flex-col gap-3">
              <h6 className="text-xs font-black uppercase tracking-widest text-slate-900">Support</h6>
              <ul className="flex flex-col gap-2 text-sm text-slate-600 font-medium">
                <li>
                  <Link href="/help" className="hover:text-purple-600 transition-colors flex items-center gap-1">
                    <span className="text-purple-500 font-bold">&gt;</span> Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms/privacy" className="hover:text-purple-600 transition-colors flex items-center gap-1">
                    <span className="text-purple-500 font-bold">&gt;</span> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-purple-600 transition-colors flex items-center gap-1">
                    <span className="text-purple-500 font-bold">&gt;</span> Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-purple-600 transition-colors flex items-center gap-1">
                    <span className="text-purple-500 font-bold">&gt;</span> Contact Us
                  </Link>
                </li>
              </ul>
            </div>

          {/* COLUMN 4: SOCIALS (Right Side) */}
          <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-3">
            <h6 className="text-xs font-black uppercase tracking-widest text-slate-900">Connect With Us</h6>
            <div className="flex gap-2">
              

             <Link href="#" className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </Link>

            
              <Link href="#" className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              
              <Link href="#" className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform" aria-label="Twitter X">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              
            </div>
          </div>

        </div>

        {/* 📜 BOTTOM COPYRIGHT ROW */}
        <div className="mt-12 pt-6 border-t border-slate-200/50 text-center text-xs text-slate-500 font-medium">
          &copy; 2026 ArtVault. All rights reserved. 
          <Link href="/terms" className="hover:text-purple-600 ml-3 transition-colors">Terms</Link>
          <span className="mx-1">&amp;</span>
          <Link href="/terms/privacy" className="hover:text-purple-600 transition-colors">Privacy</Link>
        </div>

      </div>
    </footer>
  );
}