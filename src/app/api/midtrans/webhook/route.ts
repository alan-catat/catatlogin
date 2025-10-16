// app/api/midtrans/webhook/route.ts
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@/utils/supabase/client"

// Ambil server key dari environment atau Supabase system_settings
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-yourkey"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Midtrans mengirim signature_key untuk verifikasi
    const signatureKey = body.signature_key
    const orderId = body.order_id
    const statusCode = body.status_code
    const grossAmount = body.gross_amount
    const transactionStatus = body.transaction_status
    const fraudStatus = body.fraud_status

    // Validasi signature
    const hash = crypto
      .createHash("sha512")
      .update(orderId + statusCode + grossAmount + SERVER_KEY)
      .digest("hex")

    if (hash !== signatureKey) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Supabase client
    const supabase = createClient()

    // Update transaksi di DB sesuai order_id
    // Misal order_id kita simpan format: order-{timestamp}-{userId}-{planId}
    // Split order_id untuk ambil info
    const parts = orderId.split("-")
    const userId = parts[2]
    const planId = parts[3]

    // Update payment status
    const { error } = await supabase
      .from("payments")
      .update({
        payment_status: transactionStatus,
        fraud_status: fraudStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId)

    if (error) {
      console.error("Supabase update error:", error)
      return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
    }

    console.log(`Webhook processed for order_id: ${orderId}, status: ${transactionStatus}`)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Webhook error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
