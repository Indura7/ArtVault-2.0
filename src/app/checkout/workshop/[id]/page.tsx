'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';

export default function WorkshopReservationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [workshop, setWorkshop] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); 
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    async function fetchWorkshop() {
      const { data } = await supabase
        .from('workshop')
        .select('*')
        .eq('workshop_id', resolvedParams.id)
        .single();
      if (data) setWorkshop(data);
    }
    fetchWorkshop();
  }, [resolvedParams.id]);

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Reservation Confirmed for ${fullName}!`);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Participant Form */}
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Participant Information</h1>
        <p className="text-sm text-gray-500">Please provide the attendee's details for certification and workshop access.</p>

        <form onSubmit={handleReservation} className="space-y-6">
          {/* Full Name & Email grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="E.g. Julian Voss"
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-purple-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="julian@creative.studio"
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-purple-600 text-sm"
              />
            </div>
          </div>

          {/*  Phone Number Field */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="E.g. +94 76 123 23 05"
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-purple-600 text-sm"
            />
          </div>

          {/* Specific Requirements */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600">Specific Requirements or Tools (Optional)</label>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="List any software experience or physical accessibility needs..."
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-purple-600 text-sm"
            />
          </div>
        </form>

        <p className="text-xs text-gray-500 flex items-center gap-1 pt-2">
          🛡️ SECURE REGISTRATION PORTAL
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm h-fit">
        <img
          src={workshop?.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675'}
          alt="Workshop"
          className="w-full h-48 object-cover rounded-xl"
        />
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{workshop?.category || 'MASTERCLASS'}</span>
        <h2 className="text-xl font-bold">{workshop?.title || 'Loading...'}</h2>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p>📅 {workshop?.date || 'November 12 - 14, 2026'}</p>
          <p>⏰ 10:00 AM – 4:00 PM EST</p>
          <p>📍 {workshop?.venue || 'ArtVault Virtual Studio (Global)'}</p>
        </div>

        <button
          onClick={handleReservation}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold py-3 rounded-xl transition uppercase tracking-wider text-sm shadow-md"
        >
          PAY & CONFIRM RESERVATION
        </button>

        <p className="text-[10px] text-gray-400 text-center">
          By confirming this reservation, you agree to our Workshop Terms of Service and Cancellation Policy.
        </p>
      </div>
    </main>
  );
}