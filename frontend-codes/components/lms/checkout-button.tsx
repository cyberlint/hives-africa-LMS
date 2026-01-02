"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useEnrollment } from "@/hooks/useEnrollment";

export interface CheckoutButtonProps {
  courseId?: string | number; // Accept number from mock list, convert to string
  slug?: string;
  price?: string | number; // If "Free" or 0 => direct enroll flow placeholder
  title?: string;
  thumbnail?: string;
  instructor?: string;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  label?: string; // Override button text
  autoNavigate?: boolean; // if true navigate to /checkout after add
  showAddedToast?: boolean; // show toast feedback
  analyticsId?: string; // Optional analytics hook id
  onFreeEnroll?: (courseId?: string) => Promise<void> | void; // Allows parent to handle free enrollment
  isEnrolled?: boolean; // Check if user is already enrolled
}

/**
 * Central button to route user into the checkout flow consistently.
 * Ensures a single source of truth for the /checkout URL shape.
 */
export function CheckoutButton({
  courseId,
  slug,
  price,
  title,
  thumbnail,
  instructor,
  className,
  variant = "primary",
  size = "md",
  label,
  autoNavigate = true,
  showAddedToast = true,
  analyticsId,
  onFreeEnroll,
  isEnrolled = false,
}: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addItem, items } = useCart();
  const { enrollInFreeCourse } = useEnrollment();

  const isFree = (typeof price === "string" && price.toLowerCase() === "free") || Number(price) === 0;

  const handleClick = useCallback(async (event: React.MouseEvent) => {
    // Prevent event bubbling to parent elements (like course cards)
    event.stopPropagation();

    if (!courseId && !slug) return;
    
    try {
      setLoading(true);
      const idStr = String(courseId ?? "");
      
      // If already enrolled, go to learning page
      if (isEnrolled) {
        router.push(`/dashboard/learning`);
        return;
      }

      if (isFree) {
        // Free enrollment path: enroll user and redirect to course
        try {
          if (onFreeEnroll) {
            await onFreeEnroll(idStr);
          } else {
            await enrollInFreeCourse(idStr);
          }
          toast.success("Enrolled successfully!", {
            description: "You can now access the course content",
          });
          router.push(`/${idStr}/chapter/1`);
        } catch (error) {
          toast.error("Enrollment failed", {
            description: error instanceof Error ? error.message : "Please try again",
          });
        }
        return;
      }
      
      if (courseId) {
        // Normalize numeric price (strip currency symbols / commas if any)
        const numericPrice = typeof price === "string"
          ? (price.toLowerCase() === "free" ? 0 : Number(price.replace(/[^0-9.]/g, "")) || 0)
          : Number(price || 0);

        const already = items.some(i => i.id === idStr);
        if (already) {
          if (showAddedToast) {
            toast.message("Already in cart", {
              description: title || "This course is already in your cart",
            });
          }
          // Still navigate if autoNavigate is true
          if (autoNavigate) router.push(`/checkout`);
          return; // Early exit; avoid duplicate add logic
        }

        addItem({
            id: idStr,
            title: title || `Course ${idStr}`,
            slug,
            thumbnail,
            unitPrice: numericPrice,
            quantity: 1,
            isFree: numericPrice === 0,
            instructor,
        });
        if (showAddedToast) {
          toast.success("Added to cart", { description: title || "Course added" });
        }
      }

      if (autoNavigate) router.push(`/checkout`);
    } finally {
      setLoading(false);
    }
  }, [courseId, slug, isFree, isEnrolled, router, onFreeEnroll, enrollInFreeCourse, addItem, price, title, thumbnail, instructor, autoNavigate, showAddedToast, items]);

  const text = label || (isEnrolled ? "Continue Learning" : isFree ? "Enroll Free" : autoNavigate ? "Buy Now" : "Add to Cart");

  return (
    <Button
      aria-label={text}
      data-analytics-id={analyticsId}
      onClick={handleClick}
      disabled={loading || (!courseId && !slug)}
      className={cn(
        "font-semibold transition-colors",
        variant === "primary" && "bg-yellow hover:bg-yellow/90 text-white",
        variant === "outline" && "border-yellow text-yellow hover:bg-yellow hover:text-white",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className
      )}
    >
      {loading ? (isFree ? "Enrolling…" : "Loading…") : text}
    </Button>
  );
}

export default CheckoutButton;
