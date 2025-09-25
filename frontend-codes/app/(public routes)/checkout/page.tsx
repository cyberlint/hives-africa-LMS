"use client";
// Multi-course cart checkout page (enterprise style)
// Always dynamic due to client cart state & coupon validation.
export const dynamic = "force-dynamic";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PaymentsService } from "@/services/payments";

export default function CartCheckoutPage() {
  const { items, removeItem, updateQuantity, subtotal, coupon, applyCoupon, removeCoupon, total, loadingCoupon, clearCart } = useCart();
  const router = useRouter();
  const [couponInput, setCouponInput] = useState("");
  const [processing, setProcessing] = useState(false);

  // Derived values
  const hasItems = items.length > 0;
  const discount = coupon.discountAmount || 0;

  const handleApply = useCallback(async () => {
    if (!couponInput) return toast.message("Enter a coupon code");
    await applyCoupon(couponInput);
  }, [couponInput, applyCoupon]);

  const handleStartPayment = useCallback(async () => {
    if (!hasItems) return;
    // MVP strategy: initialize payment using first non-free course id and coupon (backend must handle multi later)
    const firstBillable = items.find(i => !i.isFree);
    if (!firstBillable) {
      toast.success("All courses are free – enrolling...");
      // Simulate enrollment and redirect to learning dashboard.
      clearCart();
      router.push("/learning");
      return;
    }
    try {
      setProcessing(true);
      const res = await PaymentsService.initializePayment({ course_id: firstBillable.id, coupon_code: coupon.code || undefined });
      if (res?.authorization_url) window.location.href = res.authorization_url; else toast.error("Payment init failed");
    } catch (e: any) {
      toast.error(e?.message || "Unable to initialize payment");
    } finally { setProcessing(false); }
  }, [items, coupon, clearCart, router, hasItems]);

  const emptyState = (
    <div className="py-16 text-center">
      <p className="text-sm text-[#6E7485] mb-6">Your cart is empty. Browse courses to get started.</p>
      <Button onClick={() => router.push("/home/course")} className="bg-yellow hover:bg-yellow/90">Browse Courses →</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-darkBlue-300">Checkout</h1>
            <p className="text-sm text-[#6E7485]">Review your cart and complete payment</p>
          </div>
          {hasItems && (
            <button onClick={clearCart} className="text-xs text-[#6E7485] hover:text-red-600">Clear Cart</button>
          )}
        </div>

        {!hasItems && emptyState}
        {hasItems && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items & coupon */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-darkBlue-300">Courses ({items.length})</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 border border-gray-100 rounded-md p-3 bg-white">
                      <div className="relative h-20 w-32 overflow-hidden rounded bg-gray-100 flex-shrink-0">
                        {item.thumbnail ? (
                          <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-[10px] text-gray-400">No image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm font-medium text-darkBlue-300 line-clamp-2">{item.title}</p>
                        {item.instructor && <p className="text-xs text-[#6E7485]">By {item.instructor}</p>}
                        {item.isFree && <p className="text-[11px] text-green-700">Free course</p>}
                        {!item.isFree && (
                          <div className="flex items-center gap-2 mt-1">
                            <label className="text-[11px] text-[#6E7485]" htmlFor={`qty-${item.id}`}>Qty</label>
                            <input
                              id={`qty-${item.id}`}
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
                              className="w-16 h-8 rounded border border-gray-300 bg-white px-2 text-sm"
                            />
                          </div>
                        )}
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-semibold text-darkBlue-300">{item.isFree ? "₦0" : `₦${(item.unitPrice * item.quantity).toLocaleString()}`}</p>
                          {!item.isFree && item.quantity > 1 && (
                            <p className="text-[10px] text-[#6E7485]">₦{item.unitPrice.toLocaleString()} ea</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[11px] text-[#6E7485] hover:text-red-600"
                        >Remove</button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-darkBlue-300">Coupon Code</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter coupon"
                      className="h-10"
                      aria-label="Coupon code"
                    />
                    {coupon.code ? (
                      <Button variant="secondary" onClick={removeCoupon} className="h-10" aria-label="Remove coupon" disabled={loadingCoupon}>Remove</Button>
                    ) : (
                      <Button onClick={handleApply} disabled={!couponInput || loadingCoupon} className="h-10 bg-yellow hover:bg-yellow/90" aria-label="Apply coupon">{loadingCoupon ? "..." : "Apply"}</Button>
                    )}
                  </div>
                  {coupon.code && (
                    <p className="text-xs text-green-700 mt-2">Applied {coupon.code}. You save ₦{discount.toLocaleString()}.</p>
                  )}
                  {coupon.code && items.length > 1 && (
                    <p className="text-[10px] text-[#6E7485] mt-1">Discount validated against first course. Future enhancement: proportional distribution.</p>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                {[{title:"Secure Payment",desc:"256-bit encryption & PCI compliant"},{title:"Instant Access",desc:"Start learning immediately"},{title:"Support",desc:"Email & community help"}].map(b => (
                  <div key={b.title} className="rounded-md bg-white border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-darkBlue-300">{b.title}</p>
                    <p className="text-[11px] text-[#6E7485] mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="border-gray-200 sticky top-6">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-darkBlue-300">Payment Summary</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#6E7485]">Subtotal</span>
                      <span className="font-medium text-darkBlue-300">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E7485]">Discount</span>
                      <span className="text-green-700">-₦{discount.toLocaleString()}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-darkBlue-300">Total</span>
                      <span className="font-semibold text-darkBlue-300">₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button
                    disabled={!hasItems || processing}
                    onClick={handleStartPayment}
                    className="w-full mt-5 h-11 text-white font-semibold bg-yellow hover:bg-yellow/90"
                    aria-label="Proceed to payment"
                  >
                    {processing ? "Processing…" : "Pay Securely"}
                  </Button>
                  <p className="text-[11px] text-[#6E7485] mt-3 text-center">Secured by Paystack. You may be redirected.</p>
                  <button onClick={() => router.back()} className="mt-4 w-full text-xs text-[#6E7485] hover:text-darkBlue-300">← Back</button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
