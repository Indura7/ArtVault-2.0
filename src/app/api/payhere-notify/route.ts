import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    // PayHere sends data as form-data, not raw JSON
    const formData = await req.formData();
    const order_id = formData.get("order_id") as string;
    const status_code = formData.get("status_code") as string;
    
    // Status code 2 strictly means "Successful Payment" in PayHere
    if (status_code === "2") {
      
      // Step A: Update the order status to "Paid" and grab the art_id
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .update({ status: "Paid" })
        .eq("order_id", order_id)
        .select("art_id")
        .single();

      if (orderError || !orderData) {
        console.error("Order update failed:", orderError);
        return NextResponse.json({ error: "Order update failed" }, { status: 500 });
      }

      // Step B: Mark the 1-of-1 artwork as "Sold" instantly
      const { error: artError } = await supabase
        .from("artwork")
        .update({ status: "Sold" })
        .eq("art_id", orderData.art_id);

      if (artError) {
        console.error("Artwork update failed:", artError);
        return NextResponse.json({ error: "Artwork update failed" }, { status: 500 });
      }

      return NextResponse.json({ message: "Payment successful, inventory locked." }, { status: 200 });
    }

    // Acknowledge receipt for pending or failed payments without updating inventory
    return NextResponse.json({ message: "Payment not completed." }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}