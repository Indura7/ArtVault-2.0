'use client';
import Image from "next/image";   
import { useState, useEffect,use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function CheckoutPage({ params }: { params: Promise<{ art_id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params); 
  const art_id = resolvedParams.art_id;

  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [buyerName, setBuyerName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');   
  

  // 1. Fetch the specific artwork details 🖼️
  useEffect(() => {
    async function loadArtwork() {
      const { data } = await supabase
        .from('artwork')
        .select('*')
        .eq('art_id', art_id)
        .single();
      
      if (data) setArtwork(data);
      setLoading(false);
    }
    loadArtwork();
  }, [art_id]);

  // 2. Handle the Order Submission 📦
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For the Sept 3rd MVP: We will just show an alert and redirect!
    // Later, you can insert this into a Supabase 'orders' table.
    /* alert(`Order placed successfully for ${artwork.title}!\nThank you, ${buyerName}.`); */
    
    // Redirect back to home/gallery
    router.push('/artworks');
  };

  if (loading) return <div className="p-10 text-center">Loading checkout...</div>;
  if (!artwork) return <div className="p-10 text-center text-red-500">Artwork not found!</div>;

  return (
    
    <div className="container mx-auto p-1 max-w-6xl">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
      <button 
          onClick={() => router.back()} 
          className="flex items-center text-blue-600 font-bold hover:text-blue-800 transition cursor-pointer"
        >
          <span className="mr-2 text-xl">←</span> Back
        </button>

        <Link href="/">       
        <div className="flex item-center gap-2  items-center">
       <Image 
                  src="/assets/images/logo.png" 
                  alt="ArtVault Logo" 
                  width={48} 
                  height={48} 
                  className="object-contain"
                  priority
                />

        <div className="text-xl font-extrabold tracking-widest text-gray-800">
          ART<span className="text-blue-600">VAULT</span>
        </div>
        </div>
        </Link>
     
      </div>


      <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        
         <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input 
                required
                type="text" 
                value={buyerName}
                placeholder='A B Saman Perera'
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
              <input 
                required
                type="tel" 
                value={phone}
                placeholder='0771234567'
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
              <input 
                required
                type="email" 
                value={email}
                placeholder='you@gmail.com'
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
              <input 
                required
                type="text" 
                value={city}
                placeholder='Colombo'
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Postal Code</label>
              <input 
                required
                type="text" 
                value={postalCode}
                placeholder='00100'
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>
            </div>

             <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Street Address</label>
              <textarea
                required
                rows={3}
                value={address}
                placeholder='No. 123, Main Street'
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition mt-6"
            >
              Confirm Order
            </button>
          </form>
        </div> 

        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
          
          <div className="flex gap-4 mb-4">
            <img 
              src={artwork?.image_path} 
               alt={artwork?.title}  
              className="w-24 h-24 object-cover rounded-md"
            />
            <div>
               <h3 className="font-bold text-lg">{artwork?.title}</h3> 
              <p className="text-gray-500 text-sm">Art ID: {artwork?.art_id}</p>
            </div>
          </div>

          <div className="flex justify-between border-t pt-4 font-bold text-xl">
            <span>Total:</span>
            <span>{artwork?.price}.00 LKR</span>
          </div>
          
          <p className="text-xs text-gray-400 mt-4 text-center">
            Secure transaction simulated with payhere sandbox. No real payment is processed in this demo.
          </p>
        </div> 

      </div>
    </div>
  );
}