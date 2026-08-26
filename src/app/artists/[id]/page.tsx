'use client';

import { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  UserPlus,
  UserCheck,
  Palette,
  Eye,
  Share2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PageProps {
  params?: Promise<{ id: string }> | { id: string };
}

export default function IndividualArtistDetailPage(props: PageProps) {
  const hookParams = useParams();
  let rawSlug = '';

  // Extract route params cleanly
  if (props?.params) {
    if (typeof (props.params as any)?.then === 'function') {
      const unwrapped = use(props.params as Promise<{ id: string }>);
      rawSlug = unwrapped?.id || '';
    } else if ((props.params as any)?.id) {
      rawSlug = (props.params as any).id;
    }
  }

  if (!rawSlug && hookParams?.id) {
    rawSlug = typeof hookParams.id === 'string' ? hookParams.id : hookParams.id[0];
  }

  const cleanSlug = decodeURIComponent(rawSlug || '').trim();
  const rawHandleOrName = cleanSlug.replace(/^@/, '');
  const isNumeric = /^\d+$/.test(rawHandleOrName);

  const [artist, setArtist] = useState<any>({
    id: cleanSlug,
    name: rawHandleOrName.replace(/[-_]/g, ' '),
    handle: cleanSlug.startsWith('@') ? cleanSlug : `@${cleanSlug}`,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    tags: ['CONTEMPORARY'],
    bio: 'Visual artist creating unique contemporary works.',
    artworksCount: 0,
    followersCount: '1.2k',
    location: 'Global',
    artworks: [],
  });

  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadArtistData() {
      if (!cleanSlug) return;
      setIsLoading(true);
      setNotFound(false);

      try {
        let dbArtist: any = null;

        // --- Step 1: numeric id lookup, split into two SEPARATE queries ---
        // Combining `id.eq.X,artist_id.eq.X` in one .or() breaks silently
        // if either column's type doesn't accept the value (e.g. uuid vs int).
        if (isNumeric) {
          const { data: byId, error: byIdErr } = await supabase
            .from('artist')
            .select('*')
            .eq('id', rawHandleOrName)
            .maybeSingle();
          if (byIdErr) console.warn('[artist lookup] id.eq failed:', byIdErr.message);
          dbArtist = byId;

          if (!dbArtist) {
            const { data: byArtistId, error: byArtistIdErr } = await supabase
              .from('artist')
              .select('*')
              .eq('artist_id', rawHandleOrName)
              .maybeSingle();
            if (byArtistIdErr) console.warn('[artist lookup] artist_id.eq failed:', byArtistIdErr.message);
            dbArtist = byArtistId;
          }
        } else {
          // Non-numeric slug: try matching id as text too, in case ids are
          // stored as strings/uuids rather than numbers.
          const { data: byIdText, error: byIdTextErr } = await supabase
            .from('artist')
            .select('*')
            .eq('id', cleanSlug)
            .maybeSingle();
          if (byIdTextErr) console.warn('[artist lookup] id.eq (text) failed:', byIdTextErr.message);
          dbArtist = byIdText;
        }

        // --- Step 2: fall back to username / display_name / full_name text match ---
        if (!dbArtist) {
          const nameGuess = rawHandleOrName.replace(/[-_]/g, ' ');
          const { data: textData, error: textErr } = await supabase
            .from('artist')
            .select('*')
            .or(
              `username.ilike.%${rawHandleOrName}%,display_name.ilike.%${nameGuess}%,full_name.ilike.%${nameGuess}%`
            )
            .limit(1)
            .maybeSingle();
          if (textErr) console.warn('[artist lookup] text search failed:', textErr.message);
          dbArtist = textData;
        }

        if (!dbArtist) {
          console.warn('[artist lookup] no artist found for slug:', cleanSlug);
          if (isMounted) setNotFound(true);
          return;
        }

        const targetId = dbArtist.id ?? dbArtist.artist_id ?? cleanSlug;

        // --- Step 3: fetch artworks, retrying with a string-cast id if empty ---
        let dbArtworks: any[] = [];
        {
          const { data, error } = await supabase
            .from('artwork')
            .select('*')
            .eq('artist_id', targetId);

          if (error) {
            console.warn('[artwork lookup] eq(artist_id) failed:', error.message);
          } else if (data && data.length > 0) {
            dbArtworks = data;
          } else {
            const { data: retryData, error: retryErr } = await supabase
              .from('artwork')
              .select('*')
              .eq('artist_id', String(targetId));
            if (retryErr) console.warn('[artwork lookup] retry failed:', retryErr.message);
            dbArtworks = retryData || [];
          }
        }

        if (!isMounted) return;

        const fullName =
          dbArtist.display_name ||
          dbArtist.full_name ||
          dbArtist.name ||
          `${dbArtist.first_name || ''} ${dbArtist.last_name || ''}`.trim() ||
          rawHandleOrName.replace(/[-_]/g, ' ');

        const formattedArtworks = dbArtworks.map((art: any) => ({
          id: art.id || art.art_id,
          title: art.title || 'Untitled Work',
          type: art.type || art.category || 'Artwork',
          price: art.price ? `${art.price} LKR` : 'Price on Request',
          image:
            art.image_url ||
            art.image_path ||
            art.image ||
            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
        }));

        setArtist({
          id: String(targetId),
          name: fullName,
          handle: dbArtist.username ? `@${dbArtist.username.replace(/^@/, '')}` : `@${rawHandleOrName}`,
          image:
            dbArtist.avatar_url ||
            dbArtist.profile_image ||
            dbArtist.image_url ||
            dbArtist.image ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
          tags: dbArtist.category ? [dbArtist.category.toUpperCase()] : ['CONTEMPORARY'],
          bio: dbArtist.bio || 'Passionate visual creator exploring modern art.',
          artworksCount: formattedArtworks.length || dbArtist.artworks_count || 0,
          followersCount: dbArtist.followers_count || '1.2k',
          location: dbArtist.location || 'Global Studio',
          artworks: formattedArtworks,
        });
      } catch (err) {
        console.error('Error loading artist details:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadArtistData();

    return () => {
      isMounted = false;
    };
  }, [cleanSlug, rawHandleOrName, isNumeric]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-2xs hover:shadow-xs transition"
          >
            <ArrowLeft size={15} />
            <span>Back to All Artists</span>
          </Link>
        </div>

        {notFound && !isLoading && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4">
            No artist record matched this profile URL. Check the browser console for the
            lookup warnings, and confirm the slug (<code>{cleanSlug}</code>) matches an{' '}
            <code>id</code>, <code>artist_id</code>, or <code>username</code> value in your{' '}
            <code>artist</code> table.
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md bg-slate-900 shrink-0 border border-slate-100">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
                    {artist.name}
                  </h1>
                  <div className="flex flex-wrap gap-1.5">
                    {artist.tags?.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-blue-500 font-semibold text-sm">{artist.handle}</p>

                {artist.location && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin size={13} />
                    <span>{artist.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                  isFollowing
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition relative"
                title="Share Profile"
              >
                <Share2 size={16} />
                {copiedLink && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
              {artist.bio}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-8">
            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Artworks
              </span>
              <span className="text-xl font-extrabold text-slate-900">
                {artist.artworksCount}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Followers
              </span>
              <span className="text-xl font-extrabold text-slate-900">
                {artist.followersCount}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Artworks Grid */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 capitalize">
              <Palette size={20} className="text-blue-600" />
              <span>Artworks by {artist.name}</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {artist.artworks?.length || 0} Artworks
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading artworks...
            </div>
          ) : artist.artworks && artist.artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.artworks.map((art: any) => (
                <div
                  key={art.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                      {art.type}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                        {art.title}
                      </h3>
                      <p className="text-xs font-bold text-blue-600 mt-1">{art.price}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Original Available</span>
                      <Link
                        href={`/artworks/${art.id}`}
                        className="font-bold text-blue-600 hover:text-blue-700 text-[11px] uppercase tracking-wider inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <Eye size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-400 text-xs">
              No artworks listed for this artist at this time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}