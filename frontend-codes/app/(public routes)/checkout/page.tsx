"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { PaymentsService } from "@/services/payments";
import { CoursesService, CourseSummary } from "@/services/courses";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();


  const courseId = params.get("courseId");
  const courseSlug = params.get("slug");

  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [initialPrice, setInitialPrice] = useState<number>(0);
  const [paymentLoading, setPaymentLoading] = useState(false);

 

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId && !courseSlug) return;
      setLoading(true);
      try {
        let result: CourseSummary;
        if (courseSlug) result = await CoursesService.getBySlug(courseSlug);
        else result = await CoursesService.getById(courseId as string);
        setCourse(result);
        setInitialPrice(result.current_price);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId, courseSlug]);

  const finalAmount = useMemo(() => {
    const price = initialPrice || 0;
    return Math.max(0, Number(price) - Number(discount || 0));
  }, [initialPrice, discount]);

  const handleApplyCoupon = async () => {
    if (!coupon) return toast.message("Enter a coupon code");
    if (!course) return;
    try {
      setLoading(true);
      const res = await PaymentsService.validateCoupon(coupon, course.id);
      if (res.valid) {
        setAppliedCoupon(res.coupon.code);
        setDiscount(res.discount_amount);
        toast.success("Coupon applied");
      }
    } catch (e: any) {
      toast.error(e?.message || "Invalid coupon");
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCoupon("");
  };

  const startPayment = async () => {
    if (!course) return;
    try {
      setPaymentLoading(true);
      const payload = { course_id: course.id, coupon_code: appliedCoupon || undefined };
      const res = await PaymentsService.initializePayment(payload);
      // Redirect to Paystack authorization_url
      if (res?.authorization_url) {
        // Include our own callback reference in URL for client-side verify later
        window.location.href = `${res.authorization_url}`;
      } else {
        toast.error("Payment init failed");
      }
    } catch (e: any) {
      toast.error(e?.message || "Unable to initialize payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-darkBlue-300">Checkout</h1>
          <p className="text-sm text-[#6E7485]">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <h2 className="text-lg font-semibold text-darkBlue-300">Order Summary</h2>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-28 flex items-center justify-center text-sm text-[#6E7485]">Loading course…</div>
                ) : course ? (
                  <div className="flex gap-4">
                    <div className="relative h-20 w-32 rounded-md overflow-hidden bg-gray-100">
                      {course.thumbnail ? (
                        <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-gray-400">No image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-darkBlue-300">{course.title}</p>
                      <p className="text-xs text-[#6E7485]">By {course.instructor?.name || "Instructor"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-darkBlue-300">₦{(initialPrice || 0).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[#6E7485]">No course selected</div>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <h2 className="text-lg font-semibold text-darkBlue-300">Have a coupon?</h2>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="h-10"
                  />
                  {appliedCoupon ? (
                    <Button variant="secondary" onClick={handleRemoveCoupon} className="h-10">
                      Remove
                    </Button>
                  ) : (
                    <Button onClick={handleApplyCoupon} disabled={!coupon || loading} className="h-10 bg-orange hover:bg-orange/90">
                      Apply
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-green-700 mt-2">Applied coupon {appliedCoupon}. You save ₦{discount.toLocaleString()}.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-gray-200 sticky top-6">
              <CardHeader>
                <h2 className="text-lg font-semibold text-darkBlue-300">Payment</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6E7485]">Subtotal</span>
                    <span className="font-medium text-darkBlue-300">₦{(initialPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7485]">Discount</span>
                    <span className="text-green-700">-₦{(discount || 0).toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-darkBlue-300">Total</span>
                    <span className="font-semibold text-darkBlue-300">₦{finalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  disabled={!course || paymentLoading}
                  onClick={startPayment}
                  className={cn("w-full mt-4 h-11 text-white font-semibold", "bg-orange hover:bg-orange/90")}
                >
                  {paymentLoading ? "Processing…" : "Pay Securely"}
                </Button>

                <p className="text-[11px] text-[#6E7485] mt-3 text-center">
                  Secured by Paystack. You will be redirected to complete payment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
