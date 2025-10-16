import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

import midtransClient from "midtrans-client"
import { getSystemSetting } from "@/utils/getSystemSetting"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createClient()

    // Ambil server & client key dari system_settings
    const serverKey = await getSystemSetting("MIDTRANS_SERVER_KEY")
    const clientKey = await getSystemSetting("MIDTRANS_CLIENT_KEY")

    // Ambil user_id dari body atau session
    const userId = body.userId

    // Ambil nama & email user dari user_profiles
    const { data: profile, error: profileError } = await (await supabase)
      .from("user_profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Buat Snap transaction
    const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: serverKey as string,
        clientKey: clientKey as string, // tambahkan ini
      })
      

    const parameter = {
      transaction_details: {
        order_id: `order-${Date.now()}`,
        gross_amount: body.amount,
      },
      customer_details: {
        first_name: profile.full_name,
        email: profile.email,
      },
      item_details: body.items,
    }

    const transaction = await snap.createTransaction(parameter)

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      clientKey,
    })
  } catch (err: any) {
    console.error("Midtrans error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
