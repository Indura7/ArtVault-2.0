'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, User, Video, Award, CheckCircle } from 'lucide-react';

interface WorkshopDetail {
  workshop_id: number;
  title: string;
  description?: string;
  price?: number;
  location?: string;
  image_url?: string;
  category?: string;
  seats_left?: number;
  date?: string;
  venue?: string;
  artist?: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    profile_image?: string;
  };
}

export default function WorkshopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [workshop, setWorkshop] = useState<WorkshopDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkshopDetail() {
      const { data, error } = await supabase
        .from('workshop')
        .select('*, artist(*)')
        .eq('workshop_id', resolvedParams.id)
        .single();

      if (!error && data) {
        setWorkshop(data);
      }
      setLoading(false);
    }

    fetchWorkshopDetail();
  }, [resolvedParams.id]);

  if (loading) return <div className="p-20 text-center text-gray-500">Loading details... ⏳</div>;
  if (!workshop) return <div className="p-20 text-center text-red-500">Workshop not found!</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={workshop.image_url || 'https://vknetjgebapvlncovblp.supabase.co/storage/v1/object/public/artworks/digital%20scripting.jpg'}
          alt={workshop.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <span className="bg-purple-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {workshop.category || 'WORKSHOP DETAIL'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">{workshop.title}</h1>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Details & Instructor) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">DATE</p>
                <p className="font-semibold text-gray-800">{workshop.date || 'Oct 24, 2026'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">TIME</p>
                <p className="font-semibold text-gray-800">10:00 AM – 4:00 PM EST</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-600 font-semibold">
              <User className="w-5 h-5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">AVAILABILITY</p>
                <p>{workshop.seats_left ? `Only ${workshop.seats_left} seats left!` : 'Sold Out'}</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">ABOUT THIS WORKSHOP</h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {workshop.description || 'Join us for an interactive session designed to enhance your creative skills with hands-on techniques.'}
            </p>
          </section>

          {/* Instructor Card */}
          <section className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex gap-5 items-start">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-purple-500 bg-gray-200">
              <img
                src={workshop.artist?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                alt="Instructor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-600 uppercase">INSTRUCTOR</span>
              <h3 className="text-lg font-bold text-gray-900">
                {workshop.artist?.first_name ? `${workshop.artist.first_name} ${workshop.artist.last_name || ''}` : 'Featured Instructor'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {workshop.artist?.bio || 'Professional artist with extensive experience in leading workshops and creative sessions.'}
              </p>
            </div>
          </section>

          {/* Community Dialogue */}
          <section className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Community Dialogue</h2>
            <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-3">
              <textarea
                rows={3}
                placeholder="Ask a question about this workshop..."
                className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition">
                POST QUESTION
              </button>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-md transition">
              RESERVE YOUR SPOT ({workshop.price ? `${workshop.price} LKR` : 'Free'})
            </button>

            <ul className="space-y-3 text-xs text-gray-600 border-b pb-6">
              <li className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" /> Live HD Session + Recordings
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" /> Digital Certificate of Mastery
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" /> Exclusive Artist Community Access
              </li>
            </ul>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-gray-800 uppercase">Platform & Access</h4>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Platform</span>
                <span className="font-medium text-gray-800">{workshop.venue || 'Visual Arts Studio'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Pre-requisites</span>
                <span className="font-medium text-gray-800">Basic Knowledge</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Language</span>
                <span className="font-medium text-gray-800">English (US)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}