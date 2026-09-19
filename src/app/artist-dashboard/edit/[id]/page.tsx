"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, AlertCircle,UploadCloud } from "lucide-react";

export default function EditArtwork() {
  const params = useParams();
  const router = useRouter();
  const artId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentImage, setCurrentImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [mediumList, setMediumList] = useState<any[]>([]);

  // State for all editable fields matching your showcase page
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    width: "",
    height: "",
    category: "",
    medium_id: "",
    description: "",
  });

  // 1. FETCH EXISTING DATA
  useEffect(() => {
    const fetchArtwork = async () => {
      if (!artId) return;
      
      const { data: mediumData } = await supabase
      .from("medium")
      .select("*");
      if (mediumData) {
        setMediumList(mediumData);
      }

      const { data, error } = await supabase
        .from("artwork")
        .select("*")
        .eq("art_id", artId)
        .single();

      if (data && !error) {
        setFormData({
          title: data.title || "",
          price: data.price?.toString() || "",
          width: data.width?.toString() || "",
          height: data.height?.toString() || "",
          category: data.category || "",
          medium_id: data.medium_id || "",
          description: data.description || "",
        });
        setCurrentImage(data.image_path || "");
      } else {
        console.error("Failed to load artwork", error);
      }
      setIsLoading(false);
    };

    fetchArtwork();
  }, [artId]);

  // 2. HANDLE INPUT CHANGES
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // 👈 Create a local preview instantly!
    }
  };

  // 3. SECURE UPDATE SUBMISSION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let finalImagePath = currentImage;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      // ⚠️ Make sure "artworks" matches the actual name of your Supabase Storage bucket!
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("artworks") 
        .upload(`public/${fileName}`, imageFile);

      if (uploadError) {
        console.error("Image upload failed", uploadError);
        setIsSaving(false);
        return; // Stop the form submission if upload fails
      }

      // Get the new public URL
      const { data: publicUrlData } = supabase.storage
        .from("artworks")
        .getPublicUrl(`public/${fileName}`);
        
      finalImagePath = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("artwork")
      .update({
        title: formData.title,
        price: Number(formData.price),
        width: Number(formData.width),
        height: Number(formData.height),
        medium_id: Number(formData.medium_id),
        description: formData.description,
        status: "Pending", 
        image_path: finalImagePath,
      })
      .eq("art_id", artId);

    if (!error) {
      // Redirect back to the dashboard after a successful edit
      router.push("/artist-dashboard");
    } else {
      console.error("Update failed", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading artwork details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <Link href="/artist-dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-purple-600 mb-6 transition">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Edit Artwork</h1>
        
        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 mb-8 text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p><strong>Security Notice:</strong> Saving changes will temporarily hide this artwork from the public gallery and change its status to <strong>Pending</strong> until an admin approves the updates.</p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          
            

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Artwork Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Artwork Image</label>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Image Preview */}
              <div className="w-40 h-40 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                <img 
                  src={imagePreview || currentImage || "https://via.placeholder.com/150"} 
                  alt="Artwork Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Upload Button */}
              <div className="flex-1 space-y-3">
                <p className="text-sm text-gray-500">Upload a new high-resolution image to replace the current one. Leave this empty if you want to keep the existing image.</p>
                <label className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer transition border border-purple-200">
                  <UploadCloud size={16} />
                  Choose New Image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Price (LKR)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Medium</label>
              <select
                name="medium_id"
                value={formData.medium_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
              >
                <option value="" disabled>Select Medium</option>
                {mediumList.map((m) => (
                  <option key={m.medium_id} value={m.medium_id}>
                    {m.medium_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Width (cm)</label>
              <input type="number" name="width" value={formData.width} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-8 py-3 rounded-full font-bold transition shadow-md shadow-purple-200">
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}