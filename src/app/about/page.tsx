import React from 'react';
import Link from 'next/link';
import { Award, Users, Heart, Sparkles, Send } from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    { 
      name: 'Indura', 
      role: 'CO-FOUNDER & CURATOR', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' 
    },
    { 
      name: 'Nethma', 
      role: 'HEAD OF TECHNOLOGY', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' 
    },
    { 
      name: 'Keshan', 
      role: 'CHIEF STRATEGY', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' 
    },
    { 
      name: 'Sandali', 
      role: 'COMMUNITY & TALENT LEAD', 
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' 
    },
    { 
      name: 'Mishad', 
      role: 'CREATIVE & ART DIRECTOR', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' 
    }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white py-24 px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="block mb-3 text-xs font-bold tracking-widest text-purple-400 uppercase">
            WELCOME TO THE VAULT
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-serif">
            About <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtVault</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed pt-2">
            Bridging physical mastery and pioneering digital canvases. We are a secure, curated space empowering world-class creators to share their vision with global collectors.
          </p>
          <div className="pt-6">
            <Link href="/artworks">
              <button className="px-6 py-3 bg-white text-black font-semibold text-xs rounded-full uppercase tracking-wider hover:bg-gray-100 transition cursor-pointer shadow-lg">
                EXPLORE OUR GALLERY
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. BRIDGING HERITAGE & MODERN EXPRESSION */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="block mb-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
            OUR STORY
          </span>
          <h2 className="text-3xl font-bold font-serif leading-tight mb-4">
            Bridging Heritage & Modern Expression
          </h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              ArtVault was established to address a clear feature gap in modern art spaces: connecting authentic craftsmanship with secure digital ownership. We believe that physical traditional art and digital creations belong side by side.
            </p>
            <p>
              Every piece showcased on our platform undergoes careful evaluation by expert curators, providing absolute transparency and provenance for physical and digital artworks alike.
            </p>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
          <img 
            src="https://vknetjgebapvlncovblp.supabase.co/storage/v1/object/public/workshops/wall%20art.jpg" 
            alt="Gallery Studio" 
            className="w-full h-80 object-cover"
          />
        </div>
      </section>

      {/* 3. METRICS / STATS SECTION */}
      <section className="bg-slate-50 border-y border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-purple-600">500+</h3>
            <p className="text-xs font-bold text-gray-500 uppercase mt-2">ARTWORKS CURATED</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-purple-600">200+</h3>
            <p className="text-xs font-bold text-gray-500 uppercase mt-2">VERIFIED ARTISTS</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-purple-600">50+</h3>
            <p className="text-xs font-bold text-gray-500 uppercase mt-2">LIVE WORKSHOPS</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-purple-600">10K+</h3>
            <p className="text-xs font-bold text-gray-500 uppercase mt-2">ACTIVE COLLECTORS</p>
          </div>
        </div>
      </section>

    {/* 4. OUR FOUNDATION / VALUES */}
        <section className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
            <span className="block mb-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
            OUR FOUNDATION
            </span>
            <h2 className="text-3xl font-bold font-serif mb-3">
            Designed Around Vision & Security
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Every decision we make serves to strengthen our creative core, protect authenticity, and support artistic autonomy.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
            <Award className="w-8 h-8 text-purple-600" />
            <h4 className="font-bold text-base">Curated Excellence</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
                We select works that spark emotion, challenge conventional definitions, and push visual boundaries across traditional & digital borders.
            </p>
            </div>

            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
            <Users className="w-8 h-8 text-purple-600" />
            <h4 className="font-bold text-base">Artist Empowerment</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
                We prioritize creator equity, offering direct transparency on pricing, reliable proof of authenticity, and sustainable platforms for work.
            </p>
            </div>

            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
            <Heart className="w-8 h-8 text-purple-600" />
            <h4 className="font-bold text-base">Community First</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
                We facilitate direct dialogue and learning between creators and collectors through dynamic interactive workshops, live streams, and events.
            </p>
            </div>

            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h4 className="font-bold text-base">Artistic Innovation</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
                We welcome creative tools of tomorrow. Embracing digital rendering, virtual assets, and physical materials with equal reverence.
            </p>
            </div>
        </div>
        </section>

    {/* 5. TEAM MEMBERS */}
        <section className="bg-gray-50/50 py-20 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="block mb-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
                THE TEAM
            </span>
            <h2 className="text-3xl font-bold font-serif mb-3">
                The Minds Behind the Vault
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Meet our dedicated team of artists, technical architects, and community organizers working together in Brooklyn.
            </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
                <div key={index} className="text-center space-y-4 group">
                {/* Dashed Border Avatar Container */}
                <div className="relative w-28 h-28 mx-auto p-1.5 rounded-full border-2 border-dashed border-purple-400 group-hover:border-purple-600 transition">
                    <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full rounded-full object-cover"
                    />
                </div>

                {/* Name & Post */}
                <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug">
                    {member.name}
                    </h3>
                    <p className="text-[10px] font-bold text-purple-600 tracking-wider uppercase">
                    {member.role}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>

      {/* 6. CALL TO ACTION (NEWSLETTER) */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <Send className="w-10 h-10 mx-auto opacity-90" />
          <h2 className="text-3xl font-bold">Stay Informed & Inspired</h2>
          <p className="text-xs sm:text-sm text-purple-100">
            Join our curated newsletter to receive updates about new gallery drops, upcoming workshops, and featured artist interviews.
          </p>
          <div className="flex justify-center pt-2">
            <Link href="/auth/register">
              <button className="px-8 py-3 bg-white text-purple-700 font-bold text-xs rounded-full uppercase tracking-wider hover:bg-gray-100 transition shadow-lg cursor-pointer">
                JOIN THE COMMUNITY
              </button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}