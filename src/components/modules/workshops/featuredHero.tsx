import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Workshop } from '@/types/workshop';

interface FeaturedHeroProps {
  workshop: Workshop;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({ workshop }) => {
  // Safe Date Formatting
  const formattedDate = workshop.date
    ? new Date(workshop.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBD';

  // Safe Time Formatting
  const formattedTime = workshop.time
    ? workshop.time
    : workshop.date && workshop.date.includes('T')
    ? new Date(workshop.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '10:00 AM - 4:00 PM';

  return (
    <section className="w-full mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Side: Main Highlighted Banner */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-between p-6 sm:p-8 text-white shadow-lg">
          {/* Background Image with Dark Gradient Overlay */}
          <Image
            src={workshop.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675'}
            alt={workshop.title || 'Workshop Image'}
            fill
            className="object-cover -z-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 -z-10" />

          {/* Top Badge */}
          <div>
            <span className="inline-block bg-purple-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm">
              Featured Workshop
            </span>
          </div>

          {/* Bottom Info */}
          <div className="mt-auto pt-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              {workshop.title}
            </h1>
            <p className="text-gray-300 text-sm max-w-xl mb-4 line-clamp-2">
              {workshop.description || 'Join our featured hands-on session with industry experts.'}
            </p>

            {/* Date and Time */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-1.5">
                <span>📅</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>⏰</span>
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Featured Session Details Box */}
        <div className="bg-gray-50/80 rounded-2xl p-6 flex flex-col justify-between border border-gray-100 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Featured Session Details
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              {workshop.featured_details ||
                'This session includes a personal portfolio review, exclusive resource guides, and recorded masterclass access.'}
            </p>

            <div className="space-y-4 text-xs font-semibold tracking-wider uppercase">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-gray-500">Difficulty</span>
                <span className="text-purple-600 font-bold">
                  {workshop.difficulty || 'ALL LEVELS'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-gray-500">Availability</span>
                <span className="text-red-500 font-bold">
                  {workshop.seats_left !== undefined
                    ? `ONLY ${workshop.seats_left} SEATS LEFT`
                    : 'LIMITED SEATS'}
                </span>
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <Link href={`/workshops/${workshop.id}`}>
            <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md cursor-pointer">
              <span>RESERVE YOUR SPOT</span>
              <span>→</span>
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};