"use client";

import { useState,useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface CommentProps {
  artworkId: string;
}

export default function ArtworkComments({ artworkId }: CommentProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);


  useEffect(() => {
    const fetchActiveUser = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      

      if (user && !authError) {
        // 2. Look up this user's integer ID in your 'customer' table
        // Note: Update 'auth_id' to whatever column in your customer table stores the Supabase UUID!
        const { data: customerData, error: dbError } = await supabase
          .from("customer")
          .select("customer_id") // Or whatever your primary key column is named (e.g., customer_id)
          .eq("auth_id", user.id) 
          .single();

        if (customerData) {
          setActiveUserId(customerData.customer_id);
        }else if(dbError){
          console.error("Error fetching customer data:", dbError);
        }
      }
    };

    fetchActiveUser();
  }, []);


  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("artwork_comments")
        // We join the user table to get names. 
        // Note: Change 'customer' to whatever your actual user table is named!
        .select(`
          comment_id,
          content,
          created_at,
          customer (first_name, last_name) 
        `)
        .eq("artwork_id", artworkId)
        .order("created_at", { ascending: false }); // Newest comments first

      if (data && !error) {
        setComments(data);
      }
    };

    fetchComments();
  }, [artworkId]);



  // 2. Insert New Comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("artwork_comments")
      .insert([
        {
          artwork_id: artworkId,
          user: activeUserId, 
          content: newComment,
        },
      ])
      .select(`
        comment_id,
        content,
        created_at,
        customer (first_name, last_name)
      `);

    if (!error && data) {
      setNewComment(""); // Clear the input box
      setComments([data[0], ...comments]); // Add new comment to the top of the UI instantly!
    } else {
      console.error("Error posting comment:", error);
    }
    
    setIsSubmitting(false);
  };


  return (
    <div className=" pt-10 mt-10">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Community Comments ({comments.length})</h3>
      
      {/* Input Section */}
      <div className="flex flex-col gap-3 mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={activeUserId ? "What do you think about this piece?" : "Please log in to post a comment."}
          className="w-full border rounded-lg p-3 text-gray-700 focus:outline-none focus:border-blue-500"
          rows={3}
          disabled={!activeUserId || isSubmitting}
        />
        <button 
          onClick={handlePostComment}
          disabled={!activeUserId || isSubmitting || !newComment.trim()}
          className="self-end px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition 
                    disabled:opacity-50 
                    disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>



      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.comment_id} className="flex gap-4">
              {/* Fake Avatar */}
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-purple-700 font-bold">
                  {comment.customer?.first_name?.charAt(0) || "U"}
                </span>
              </div>
              
              {/* Comment Content */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">
                    {comment.customer?.first_name} {comment.customer?.last_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}