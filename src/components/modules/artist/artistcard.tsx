'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  UserPlus, 
  UserCheck, 
  ArrowRight, 
  X, 
  Sparkles, 
  Mail, 
  Image as ImageIcon, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Palette, 
  Share2 
} from 'lucide-react';

export interface Artist {
  id: string | number;
  name: string;
  handle: string;
  image: string;
  tags: string[];
  bio: string;
  artworksCount: number;
  category?: string;
  location?: string;
  email?: string;
  featuredArtworks?: string[];
}

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing((prev) => !prev);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText?.(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* CARD CONTAINER */}
      <div 
        className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {/* Banner / Showcase Image with Glassmorphism Tag Badges */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />
          {/* Subtle gradient overlay for tag legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

          {/* Tags Pills at bottom-left */}
          <div className="absolute bottom-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
            {artist.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/60 backdrop-blur-md text-white/90 border border-white/20 shadow-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Top Quick Actions (Share) */}
          <button
            onClick={handleShare}
            title="Share Artist Profile"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Share"
          >
            <Share2 size={13} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow justify-between bg-white">
          <div>
            {/* Header: Name, Handle & Follow Action */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-snug truncate">
                  {artist.name}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mt-0.5 tracking-tight truncate">
                  {artist.handle.startsWith('@') ? artist.handle : `@${artist.handle}`}
                </p>
              </div>

              {/* Follow Button */}
              <button
                onClick={toggleFollow}
                title={isFollowing ? 'Following' : 'Follow Artist'}
                className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  isFollowing
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm hover:bg-blue-700 scale-105'
                    : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-600'
                }`}
                aria-label={isFollowing ? 'Unfollow' : 'Follow'}
              >
                {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
              </button>
            </div>

            {/* Bio Description with Inline Expansion Support */}
            <div className="mt-3.5 mb-5">
              <p className={`text-xs text-slate-500 leading-relaxed ${isBioExpanded ? '' : 'line-clamp-3'}`}>
                {artist.bio}
              </p>
              {artist.bio.length > 130 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBioExpanded(!isBioExpanded);
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-0.5"
                >
                  {isBioExpanded ? (
                    <>Show less <ChevronUp size={12} /></>
                  ) : (
                    <>Read more <ChevronDown size={12} /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Card Footer: Artwork Count & View Profile */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {artist.artworksCount} ARTWORKS
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-wide group/btn transition-colors"
            >
              VIEW PROFILE
              <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK VIEW PROFILE MODAL (Full details in-card with no external page needed) */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Banner */}
            <div className="relative h-48 sm:h-64 w-full bg-slate-900">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Tags on Header */}
              <div className="absolute bottom-4 left-6 flex flex-wrap gap-2">
                {artist.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md text-white border border-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Artist Name & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">{artist.name}</h2>
                  <p className="text-sm font-semibold text-blue-600">
                    {artist.handle.startsWith('@') ? artist.handle : `@${artist.handle}`}
                  </p>
                  {artist.location && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{artist.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleFollow}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={15} /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} /> Follow Creator
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      alert(`Message inquiry initiated for ${artist.name}`);
                    }}
                    className="px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <Mail size={14} /> Contact
                  </button>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-900">{artist.artworksCount}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Artworks</div>
                </div>
                <div className="border-x border-slate-200">
                  <div className="text-lg font-bold text-slate-900">
                    {artist.category || artist.tags[0] || 'Visual Arts'}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Focus Area</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600 flex items-center justify-center gap-1">
                    <Sparkles size={14} /> 4.9 / 5.0
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Rating</div>
                </div>
              </div>

              {/* About / Bio */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About The Artist</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{artist.bio}</p>
              </div>

              {/* Featured Artworks Mini Gallery */}
              {artist.featuredArtworks && artist.featuredArtworks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ImageIcon size={14} /> Selected Works
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {artist.featuredArtworks.map((artSrc, idx) => (
                      <div key={idx} className="relative h-24 sm:h-32 rounded-lg overflow-hidden border border-slate-200 group/work bg-slate-100">
                        <Image
                          src={artSrc}
                          alt={`${artist.name} artwork ${idx + 1}`}
                          fill
                          className="object-cover group-hover/work:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
