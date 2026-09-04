'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreateWorkshopPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Selection Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675';

      // 1. Upload Cover Image to Supabase Storage (If selected)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `workshops/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('artvault-assets')
          .upload(filePath, imageFile);

        if (!uploadError) {
          const { data } = supabase.storage.from('artvault-assets').getPublicUrl(filePath);
          imageUrl = data.publicUrl;
        }
      }

      // 2. Insert Record into Supabase `workshop` Table
      const { error } = await supabase.from('workshop').insert([
        {
          title,
          category,
          price: parseFloat(price) || 0,
          description,
          date,
          time,
          duration,
          image_url: imageUrl,
          status: 'Pending',
          artist_id: 1,
        },
      ]);

      if (error) throw error;

      alert('Workshop submitted for approval successfully!');
      router.push('/workshops');

    } catch (err: any) {
      console.error('Error creating workshop:', err.message);
      alert('Failed to submit workshop. Please check inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FBFBFC] text-gray-800 font-sans">
      
      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto my-10 px-4">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm">
          
          <h1 className="text-3xl font-bold text-gray-900">Create Workshop</h1>
          <p className="text-sm text-gray-500 mt-1 mb-8">Provide all foundational and scheduling information for your workshop.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Workshop Title */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">WORKSHOP TITLE</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Digital Sculpting Masterclass"
                className="w-full border-b border-gray-300 pb-2 text-sm outline-none focus:border-purple-600 transition bg-transparent"
              />
            </div>

            {/* Category & Price Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">CATEGORY</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-b border-gray-300 pb-2 text-sm outline-none focus:border-purple-600 transition bg-transparent text-gray-600"
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Arcylic">Arcylic</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Oil Painting">Oil Painting</option>
                  <option value="Pastel">Pastel</option>
                  <option value="Pensil Sketch">Pensil Sketch</option>
                  <option value="Watercolor">Watercolor</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">PRICE (LKR)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="LKR 0.00"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-purple-600 transition bg-white"
                />
              </div>
            </div>

            {/* Drag and Drop Cover Image Upload */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">DRAG AND DROP</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center min-h-[160px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-32 object-cover rounded-lg" />
                ) : (
                  <>
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center mb-3">
                      🖼️
                    </div>
                    <p className="text-xs text-gray-600">
                      Drag & drop workshop cover image or <span className="text-blue-600 font-medium">browse files</span>
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1">(Max 5MB)</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">DESCRIPTION</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the inspiration, techniques, and narrative behind this piece..."
                className="w-full border-b border-gray-300 pb-2 text-sm outline-none focus:border-purple-600 transition bg-transparent resize-none"
              />
            </div>

            {/* Date, Time & Duration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">DATE</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-b border-gray-300 pb-2 text-sm outline-none focus:border-purple-600 transition bg-transparent text-gray-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">TIME</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border-b border-gray-300 pb-2 text-sm outline-none focus:border-purple-600 transition bg-transparent text-gray-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">DURATION</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2 Hours"
                  className="w-full border-b border-gray-300 pb-2 text-sm outline-none focus:border-purple-600 transition bg-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition cursor-pointer"
              >
                CANCEL 
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-8 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FOR APPROVAL'}
              </button>
            </div>

          </form>
        </div>
      </main>

    </div>
  );
}