'use client';

import { useState, useEffect,use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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
    alert(`Order placed successfully for ${artwork.title}!\nThank you, ${buyerName}.`);
    
    // Redirect back to home/gallery
    router.push('/artworks');
  };

  if (loading) return <div className="p-10 text-center">Loading checkout...</div>;
  if (!artwork) return <div className="p-10 text-center text-red-500">Artwork not found!</div>;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 📝 Left Column: Shipping Details Form */}
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input 
                required
                type="text" 
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Address</label>
              <textarea 
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <input 
                required
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition mt-6"
            >
              Confirm Order (Demo)
            </button>
          </form>
        </div>

        {/* 🛒 Right Column: Order Summary */}
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
            🔒 Secure transaction simulated for IC 2206 Presentation
          </p>
        </div>

      </div>
    </div>
  );
}