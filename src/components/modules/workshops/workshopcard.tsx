import Image from "next/image";
import { User, Calendar, MapPin, Users } from "lucide-react";

interface WorkshopProps {
  workshop: {
    workshop_id: number;
    title: string;
    description?: string;
    image_url?: string;
    price?: number;
    date?: string;
    category?: string;
    seats_left?: number;
    venue?: string;
    artist?: {
      first_name?: string;
      last_name?: string;
    };
  };
}

export default function WorkshopCard({ workshop }: WorkshopProps) {
  // Safe Date Formatting (if haven't date, not shows the error)
  const formattedDate = workshop.date
    ? new Date(workshop.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date TBD";

  // Fallback Image (if you haven't dbms image_url, then show default image)
  const displayImage =
    workshop.image_url && workshop.image_url.trim() !== ""
      ? workshop.image_url
      : "https://images.unsplash.com/photo-1579783902614-a3fb3927b675";

  return (
    <div className="card bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Workshop Image */}
      <div className="relative w-full h-48 bg-slate-100">
        <Image
          src={displayImage}
          alt={workshop.title || "Workshop Image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          className="object-cover rounded-t-lg"
        />
      </div>

      <div className="p-4 space-y-2 bg-white">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
            {workshop.title}
          </h3>
          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide whitespace-nowrap">
            {workshop.category || "General"}
          </span>
        </div>

        {/* Artist Detail */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <User size={16} className="text-gray-500" />
          <span>
            {workshop.artist?.first_name
              ? `${workshop.artist.first_name} ${workshop.artist.last_name || ""}`
              : "Unknown Artist"}
          </span>
        </div>
              

        {/* Date */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-500" />
          <span>{formattedDate}</span>
        </div>

        {/* Venue */}
        {workshop.venue && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-500" />
            <span className="line-clamp-1">{workshop.venue}</span>
          </div>
        )}

        {/* Seats & Price */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users size={16} className="text-gray-500" />
            <span>{workshop.seats_left ?? 0} seats left</span>
          </div>
          <p className="text-sm font-semibold text-purple-600">
            {Number(workshop.price ?? 0).toFixed(2)} LKR
          </p>
        </div>
      </div>
    </div>
  );
}
