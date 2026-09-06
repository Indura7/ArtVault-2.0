"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from 'next/image';
import React, { ChangeEvent } from 'react';
import { UploadCloud, X, ArrowRight, UploadCloudIcon,Trash  } from "lucide-react";

export default function UploadArtworkPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [title, setTitle] = useState("");
  const [mediumList, setMediumList] = useState<any[]>([]);
  const [medium, setMedium] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  
  useEffect(() => {
    async function fetchArtists() {
      const { data } = await supabase.from("artist").select("artist_id, first_name, last_name");
      if (data) setArtists(data);

      
    }
    fetchArtists();
  }, []);

    useEffect(() => {
    async function fetchMediums() {
      const { data } = await supabase.from("medium").select("medium_id, medium_name");
      if (data) setMediumList(data);
    }
    fetchMediums();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedArtist) return alert("Please select an artist and upload an image!");

    setUploading(true);
    try {
      // 1. Upload File to Supabase Storage Bucket ('artworks')
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: storageError } = await supabase.storage
        .from("artworks")
        .upload(fileName, file);

      if (storageError) throw storageError;

      // Get Public URL
      const { data: urlData } = supabase.storage.from("artworks").getPublicUrl(fileName);

      // 2. Insert into Supabase Database ('artwork')
      const { error: dbError } = await supabase.from("artwork").insert([
        {
          title,
          medium,
          width: parseFloat(width),
          height: parseFloat(height),
          
          description,
          price: parseFloat(price),
          image_path: urlData.publicUrl,
          artist_id: parseInt(selectedArtist), // Temporary manual selection
          /* date_added: new Date().toISOString().split("T")[0], */
        },
      ]);

      if (dbError) throw dbError;

      alert("Artwork uploaded successfully! 🎉");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Header */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-bold text-blue-600 text-lg">ArtVault</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-l pl-3">
            Artist Portal
          </span>
        </div>
        <button type="button" className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-black">
          <X size={14} /> CANCEL
        </button>
      </div>

      {/* Main Form Card */}
      <div className="max-w-3xl mx-auto mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Artwork Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide the foundational metadata for your creative work.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Temporary Dev Mode: Select Artist */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <label className="block text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
              Select Artist (Dev Mode)
            </label>
            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="w-full bg-white border border-purple-200 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">-- Choose Artist --</option>
              {artists.map((a) => (
                <option key={a.artist_id} value={a.artist_id}>
                  {a.first_name} {a.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Title of Artwork
              </label>
              <input
                type="text"
                placeholder="e.g. Neon Serenity #04"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

          {/*   <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Painting">Painting</option>
                <option value="Photograph">Photograph</option>
                <option value="Digital Art">Digital Art</option>
                <option value="Drawing">Drawing</option>
              </select>
            </div> */}
          </div>

          {/* Row 2: Medium & Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Medium
              </label>
             {/*  <input
                type="text"
                placeholder="e.g. Acrylic on Canvas"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500"
                required
              /> */}
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500 mt-2"
                required
                >
                <option value="">Select Medium</option>
                {mediumList.map((m) => (
                  <option key={m.medium_id} value={m.medium_name}>
                    {m.medium_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Width (cm)
              </label>
              <input
                type="number"
                placeholder="e.g. 30"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                placeholder="e.g. 60"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 text-center">
              Upload Your Artwork Picture
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    setImagePreview(URL.createObjectURL(selectedFile));
                  } else {
                    setFile(null);
                    setImagePreview(null);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-md overflow-hidden ho">
                <div className="absolute inset-0 w-full h-full hover:scale-110 transition-transform">
                <Image 
                  src={imagePreview} 
                  alt="Artwork Preview" 
                  fill 
                  className="object-contain" // object-contain ensures no parts of the artwork are cropped out!
                />
                </div>
                 <button type="button" onClick={() => { setFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
                  <Trash className="w-5 h-5" />
                </button>
              </div>

             
            ) : (
              <div className="flex flex-col items-center text-slate-500">
                <UploadCloudIcon className="w-10 h-10 text-blue-500 mb-2" />
                <span className="font-semibold text-sm">Click to upload or drag and drop</span>
                <span className="text-xs mt-1">Supported formats: JPEG, PNG. Max file size: 5MB</span>
                
              </div>
            )}
            
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the inspiration, techniques, and narrative behind this piece..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Price (LKR)
            </label>
            <div className="flex border border-gray-300 rounded-md overflow-hidden max-w-xs focus-within:border-blue-500">
              <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-2.5 border-r border-gray-300">
                LKR
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 text-sm outline-none"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-4 pt-6">
            <button
              type="button"
              className="px-6 py-2.5 bg-purple-100 text-purple-700 text-xs font-bold uppercase rounded-full hover:bg-purple-200 transition"
            >
              Cancel ⊗
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center gap-2 px-8 py-2.5 bg-purple-700 text-white text-xs font-bold uppercase rounded-full hover:bg-purple-800 transition disabled:bg-gray-400"
            >
              {uploading ? "Submitting..." : "Submit for Approval"} <ArrowRight size={14} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}