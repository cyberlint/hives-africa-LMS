"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PaymentsService } from "@/services/payments";
import { toast } from "sonner";

export interface CartCourseItem {
  id: string; // course id
  title: string;
  slug?: string;
  thumbnail?: string;
  unitPrice: number; // numeric price (kobo not assumed)
  quantity: number;
  isFree?: boolean;
  instructor?: string;
}

interface CouponState {
  code: string | null;
  discountAmount: number; // absolute amount applied to cart
  raw?: any;
}

interface CartContextValue {
  items: CartCourseItem[];
  addItem: (item: Omit<CartCourseItem, "quantity"> & { quantity?: number }) => void; // quantity ignored (single-item mode)
  removeItem: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void; // retained as no-op for backward compatibility
  clearCart: () => void;
  subtotal: number;
  coupon: CouponState;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  total: number;
  loadingCoupon: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "lms_cart_v1";
const COUPON_KEY = "lms_cart_coupon_v1";

function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartCourseItem[]>(() => loadStored<CartCourseItem[]>(STORAGE_KEY, []));
  const [coupon, setCoupon] = useState<CouponState>(() => loadStored<CouponState>(COUPON_KEY, { code: null, discountAmount: 0 }));
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  // Persist
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
  }, [coupon]);

  const addItem = useCallback((item: Omit<CartCourseItem, "quantity"> & { quantity?: number }) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        // Single-item-per-course: do not increment, just warn (toast handled upstream in button)
        return prev;
      }
      return [...prev, { ...item, quantity: 1 }]; // force quantity = 1
    });
  }, []);

  const removeItem = useCallback((courseId: string) => {
    setItems(prev => prev.filter(p => p.id !== courseId));
  }, []);

  const updateQuantity = useCallback((_courseId: string, _quantity: number) => {
    // No-op in single-item mode. Kept to avoid runtime errors in components not yet refactored.
    return;
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((acc, i) => acc + (i.isFree ? 0 : i.unitPrice), 0), [items]);

  // Normalize any persisted multi-quantity legacy data to quantity=1
  useEffect(() => {
    let mutated = false;
    setItems(prev => prev.map(i => {
      if (i.quantity !== 1) { mutated = true; return { ...i, quantity: 1 }; }
      return i;
    }));
    if (mutated) {
      toast.message("Cart updated to new single-item mode");
    }
  // run only once after mount / load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyCoupon = useCallback(async (code: string): Promise<void> => {
    if (!items.length) {
      toast.message("Cart is empty");
      return;
    }
    const firstCourse = items[0];
    try {
      setLoadingCoupon(true);
      const res = await PaymentsService.validateCoupon(code, firstCourse.id);
      if (res.valid) {
        setCoupon({ code: res.coupon.code, discountAmount: res.discount_amount, raw: res });
        toast.success("Coupon applied");
      }
    } catch (e: any) {
      toast.error(e?.message || "Invalid coupon");
      setCoupon({ code: null, discountAmount: 0 });
    } finally { setLoadingCoupon(false); }
    return; // explicit void
  }, [items]);

  const removeCoupon = useCallback(() => setCoupon({ code: null, discountAmount: 0 }), []);

  const total = useMemo(() => Math.max(0, subtotal - (coupon.discountAmount || 0)), [subtotal, coupon]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    total,
    loadingCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
