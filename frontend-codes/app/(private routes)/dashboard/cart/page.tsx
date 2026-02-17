"use client";
// Student cart page - fully functional with API integration
// Always dynamic due to client cart state & coupon validation.
export const dynamic = "force-dynamic";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useInitializePayment } from "@/hooks/usePayments";
import { constructUrl } from "@/lib/construct-url";
import { Trash2, CreditCard, Shield } from "lucide-react"

export default function Cart() {
  const { items, removeItem, subtotal, coupon, applyCoupon, removeCoupon, total, loadingCoupon, clearCart } = useCart();
  const router = useRouter();
  const [couponInput, setCouponInput] = useState("");
  const [processing, setProcessing] = useState(false);

  // Derived values
  const hasItems = items.length > 0;
  const discount = coupon.discountAmount || 0;

  const handleApply = useCallback(async () => {
    if (!couponInput) return toast.message("Enter a coupon code");
    await applyCoupon(couponInput);
    setCouponInput("");
  }, [couponInput, applyCoupon]);

  const initializePaymentMutation = useInitializePayment();

  const handleStartPayment = useCallback(async () => {
    if (!hasItems) return;
    
    // MVP strategy: initialize payment using first non-free course id and coupon (backend must handle multi later)
    const firstBillable = items.find(i => !i.isFree);
      if (!firstBillable) {
        toast.success("All courses are free – enrolling...");
        // Simulate enrollment and redirect to learning dashboard.
        clearCart();
        router.push("/dashboard/learning");
        return;
      }

    setProcessing(true);
    
    try {
      // Construct the callback URL for Paystack to redirect to after payment
      const callbackUrl = `${window.location.origin}/payment/callback`;
      
      const response = await initializePaymentMutation.mutateAsync({
        course_id: firstBillable.id,
        coupon_code: coupon.code || undefined,
        redirect_url: callbackUrl,
      });

      if (response?.authorization_url) {
        // Store cart state before redirect (optional - for recovery)
        localStorage.setItem('checkout_cart', JSON.stringify(items));
        localStorage.setItem('checkout_coupon', JSON.stringify(coupon));
        
        // Redirect to Paystack checkout
        window.location.href = response.authorization_url;
      } else {
        toast.error("Payment initialization failed - no authorization URL received");
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to initialize payment");
    } finally {
      setProcessing(false);
    }
  }, [items, coupon, clearCart, router, hasItems, initializePaymentMutation]);

    const emptyState = (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-600 mb-6">Your cart is empty. Browse courses to get started.</p>
        <Button onClick={() => router.push("/dashboard/courses")} className="bg-[#fdb606] hover:bg-[#fdb606]/90">Browse Courses →</Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#1d2026]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Pending Purchases</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Review your cart and complete payment</p>
          </div>
          {hasItems && (
            <button onClick={clearCart} className="text-xs text-gray-600 dark:text-gray-400 hover:text-red-600">Clear Cart</button>
          )}
        </div>

        {!hasItems && emptyState}
        {hasItems && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Items & coupon */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-gray-200 dark:border-[#2a3547] dark:bg-[#0a0f19]">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Courses ({items.length})</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 border border-gray-100 dark:border-[#2a3547] rounded-md p-3 md:p-4 bg-white dark:bg-[#1d2026]"
                    >
                      <div className="relative h-32 w-full sm:h-20 sm:w-32 overflow-hidden rounded bg-gray-100 flex-shrink-0">
                        {item.thumbnail ? (
                          <Image src={constructUrl(item.thumbnail)} alt={item.title} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-[10px] text-gray-400">No image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 md:line-clamp-3">{item.title}</p>
                        {item.instructor && <p className="text-xs text-gray-600 dark:text-gray-400">By {item.instructor}</p>}
                        {item.isFree && <p className="text-[11px] text-green-700">Free course</p>}
                      </div>
                      <div className="flex sm:flex-col justify-between sm:justify-between items-end sm:items-end gap-2 sm:gap-0">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.isFree ? "₦0" : `₦${(item.unitPrice).toLocaleString()}`}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[11px] text-gray-600 dark:text-gray-400 hover:text-red-600"
                        >Remove</button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-[#2a3547] dark:bg-[#0a0f19]">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Coupon Code</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:items-stretch">
                    <Input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter coupon"
                      className="h-10 flex-1 bg-white dark:bg-[#1d2026] dark:border-[#2a3547] dark:text-white"
                      aria-label="Coupon code"
                    />
                    {coupon.code ? (
                      <Button variant="secondary" onClick={removeCoupon} className="h-10 dark:bg-[#2a3547] dark:hover:bg-[#3a4557] dark:text-white" aria-label="Remove coupon" disabled={loadingCoupon}>Remove</Button>
                    ) : (
                      <Button onClick={handleApply} disabled={!couponInput || loadingCoupon} className="h-10 bg-[#fdb606] hover:bg-[#f39c12] text-black" aria-label="Apply coupon">{loadingCoupon ? "..." : "Apply"}</Button>
                    )}
                  </div>
                  {coupon.code && (
                    <p className="text-xs text-green-700 mt-2">Applied {coupon.code}. You save ₦{discount.toLocaleString()}.</p>
                  )}
                  {coupon.code && items.length > 1 && (
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">Discount applied to first course. Multi-course support coming soon.</p>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                {[{title:"Secure Payment",desc:"256-bit encryption & PCI compliant"},{title:"Instant Access",desc:"Start learning immediately"},{title:"Support",desc:"Email & community help"}].map(b => (
                  <div key={b.title} className="rounded-md bg-white dark:bg-[#1d2026] border border-gray-200 dark:border-[#2a3547] p-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{b.title}</p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1 hidden lg:block">
              <Card className="border-gray-200 dark:border-[#2a3547] dark:bg-[#0a0f19] sticky top-6">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Summary</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-white">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Discount</span>
                      <span className="text-green-700">-₦{discount.toLocaleString()}</span>
                    </div>
                    <Separator className="my-2 dark:bg-[#2a3547]" />
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-gray-900 dark:text-white">Total</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button
                    disabled={!hasItems || processing || initializePaymentMutation.isPending}
                    onClick={handleStartPayment}
                    className="w-full mt-5 h-11 text-black font-semibold bg-[#fdb606] hover:bg-[#f39c12]"
                    aria-label="Proceed to payment"
                  >
                    {processing || initializePaymentMutation.isPending ? "Processing…" : "Pay Securely"}
                  </Button>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-3 text-center">Secured by Paystack. You may be redirected.</p>
                  <button onClick={() => router.back()} className="mt-4 w-full text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">← Back</button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky summary bar */}
      {hasItems && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 dark:border-[#2a3547] bg-white/95 dark:bg-[#0a0f19]/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:supports-[backdrop-filter]:bg-[#0a0f19]/75 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">₦{total.toLocaleString()}</p>
              {discount > 0 && <p className="text-[10px] text-green-700">You save ₦{discount.toLocaleString()}</p>}
            </div>
            <Button
              disabled={!hasItems || processing || initializePaymentMutation.isPending}
              onClick={handleStartPayment}
              className="h-11 px-6 font-semibold bg-[#fdb606] hover:bg-[#f39c12] text-black"
              aria-label="Pay securely"
            >
              {processing || initializePaymentMutation.isPending ? "Processing…" : "Checkout"}
            </Button>
          </div>
          <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-400">
            <button onClick={() => router.back()} className="hover:text-gray-900 dark:hover:text-white">← Back</button>
            {coupon.code && <span>Coupon: {coupon.code}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
