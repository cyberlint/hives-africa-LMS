"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymentsService } from "@/services/payments";
import { toast } from "sonner";

export default function CheckoutCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");

  useEffect(() => {
    const ref = params.get("reference") || params.get("trxref");
    if (!ref) {
      toast.error("Missing payment reference");
      router.replace("/dashboard");
      return;
    }
    const verify = async () => {
      try {
        const res = await PaymentsService.verifyPayment(ref);
        setStatus("success");
        toast.success(res?.message || "Payment successful");
        setTimeout(() => router.replace("/dashboard"), 800);
      } catch (e: any) {
        setStatus("failed");
        toast.error(e?.message || "Payment verification failed");
        setTimeout(() => router.replace("/dashboard"), 1500);
      }
    };
    verify();
  }, [params, router]);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4" />
            <p className="text-sm text-[#6E7485]">Verifying your payment…</p>
          </>
        )}
        {status === "success" && (
          <p className="text-green-700 font-medium">Payment verified. Redirecting…</p>
        )}
        {status === "failed" && (
          <p className="text-red-600 font-medium">Verification failed. Redirecting…</p>
        )}
      </div>
    </div>
  );
}
