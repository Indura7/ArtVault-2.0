'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserPlus, UserCheck, ArrowRight } from 'lucide-react';

export interface Artist {
  id?: string | number;
  artist_id?: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  full_name?: string;
  handle?: string;
  username?: string;
  image?: string;
  profile_image?: string;
  avatar_url?: string;
  tags?: string[];
  category?: string;
  bio?: string;
  artworksCount?: number;
  artwork_count?: number;
  location?: string;
  email?: string;
  featuredArtworks?: string[];
}

export interface ArtistCardProps {
  artist: Artist;
  onSelect?: (artist: Artist) => void;
}

export default function ArtistCard({ artist, onSelect }: ArtistCardProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  // Guard: never crash if a bad/undefined entry slips into the list
  if (!artist) {
    console.warn('[ArtistCard] rendered with no artist prop, skipping');
    return null;
  }

  // Normalize name
  const rawName =
    artist.name ||
    artist.display_name ||
    artist.full_name ||
    `${artist.first_name || ''} ${artist.last_name || ''}`.trim() ||
    'Featured Artist';

  // Normalize handle
  const rawHandle =
    artist.handle ||
    (artist.username ? `@${artist.username.replace(/^@/, '')}` : `@${rawName.toLowerCase().replace(/\s+/g, '_')}`);

  const displayHandle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;

  // Normalize profile image
  const displayImage =
    artist.image ||
    artist.profile_image ||
    artist.avatar_url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop';

  // Normalize tags
  const displayTags =
    artist.tags && artist.tags.length > 0
      ? artist.tags
      : artist.category
      ? [artist.category.toUpperCase()]
      : ['CONTEMPORARY'];

  // Normalize bio description
  const displayBio =
    artist.bio ||
    'Passionate visual creator exploring modern form, balance, and artistic narratives through rich creative expressions.';

  // Normalize artwork counts
  const artworksTotal =
    artist.artworksCount !== undefined
      ? artist.artworksCount
      : artist.artwork_count !== undefined
      ? artist.artwork_count
      : 12;

  // Only use a REAL identifier for the profile link. Never fabricate one
  // (like a slugified name or an array-index-based id) — those can never
  // match a database row and will always dead-end on the detail page.
  const realId =
    artist.id !== undefined && artist.id !== ''
      ? artist.id
      : artist.artist_id !== undefined
      ? artist.artist_id
      : undefined;

  const usernameSlug = artist.username
    ? artist.username.replace(/^@/, '')
    : artist.handle
    ? artist.handle.replace(/^@/, '')
    : undefined;

  const slugOrId = realId ?? usernameSlug;

  const profileUrl = slugOrId ? `/artists/${encodeURIComponent(String(slugOrId))}` : null;

  if (!profileUrl) {
    console.warn('[ArtistCard] artist has no id/artist_id/username, cannot build profile link:', artist);
  }

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing((prev) => !prev);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(artist);
    } else if (profileUrl) {
      router.push(profileUrl);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
        profileUrl || onSelect ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Top Media Section */}
      <div className="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden">
        <Image
          src={displayImage}
          alt={rawName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Floating Category Pills */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
          {displayTags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white/95 text-[10px] font-semibold tracking-wider uppercase border border-white/20 shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 text-lg leading-snug truncate group-hover:text-blue-600 transition-colors">
                {rawName}
              </h3>
              <p className="text-blue-500 font-medium text-xs mt-0.5 tracking-tight hover:underline">
                {displayHandle}
              </p>
            </div>

            {/* Follow Button */}
            <button
              onClick={handleFollowToggle}
              title={isFollowing ? 'Following' : 'Follow Artist'}
              aria-label={`Follow ${rawName}`}
              className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center shrink-0 ${
                isFollowing
                  ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 shadow-xs'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-blue-600 hover:border-blue-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
            </button>
          </div>

          {/* Bio Preview */}
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-3.5">
            {displayBio}
          </p>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">
            {artworksTotal} ARTWORKS
          </span>

          {profileUrl ? (
            <Link
              href={profileUrl}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider text-[11px] group-hover:gap-1.5 transition-all"
            >
              <span>VIEW PROFILE</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <span className="text-[11px] text-slate-300 uppercase tracking-wider">No Profile</span>
          )}
        </div>
      </div>
    </div>
  );
}