## Cart & Checkout Implementation Summary

### 1. Objectives
Modernize the checkout experience by moving from a single-course, query-parameter based flow to a resilient, multi-course (now single-instance-per-course) cart with coupon validation, payment initialization, mobile responsiveness, and simplified canonical routing (removal of legacy `/home` prefix). Also eliminate prerender/build errors on `/checkout` caused by client-only dependencies and duplicated layout chrome.

### 2. High-Level Evolution
1. Fixed prerender error on `/checkout` by enforcing dynamic rendering and carefully isolating client-only state (localStorage cart persistence).
2. Replaced `/checkout?courseId=` flow with dynamic/multi-course cart state via a `CartContext`.
3. Introduced add-to-cart UX (replacing immediate navigation) with toast feedback.
4. Added coupon application + optimistic feedback + persisted coupon state.
5. Removed quantity manipulation (business decision: one logical seat per course) while retaining backward-compatible normalization for any legacy persisted items.
6. Refactored layouts: Root layout now only provides providers; public marketing chrome (Topbar / Navbar / Footer) moved into `(public routes)/layout.tsx`.
7. Normalized routes: Removed `/home` namespace; canonical paths now `/course`, `/course/[id]`, and `/checkout`.
8. Updated all navigation triggers (Links, router.push) and documentation references accordingly.

### 3. Core Architecture
| Concern | Implementation |
|---------|---------------|
| State container | `contexts/CartContext.tsx` (React Context + localStorage persistence) |
| Persistence keys | `lms_cart_v1`, `lms_cart_coupon_v1` |
| Duplicate handling | `addItem` early-return + toast (UI layer) |
| Quantity policy | Deprecated; any legacy `quantity > 1` coerced to `1` on hydration |
| Coupon validation | `PaymentsService.validateCoupon` (asynchronous) with stored coupon meta |
| Payment kickoff | Uses first (and only effective) paid course for transaction initialization |
| UI trigger | `components/lms/checkout-button.tsx` centralizes add + optional navigate |
| Layout strategy | Public chrome provisioned only in `(public routes)` segment layout |
| Routing policy | Absolute canonical paths: `/checkout`, `/course`, `/course/[id]` |

### 4. Data Model (Current Effective)
```ts
type CartItem = {
  id: string;          // course id
  title: string;
  price: number;       // numeric (parsed at ingestion)
  image?: string;
  // quantity?: number; // deprecated (ignored if present)
};

type CartState = {
  items: CartItem[];           // At most one per course id
  coupon?: { code: string; discountType: 'percent' | 'flat'; value: number };
  subtotal: number;            // Sum of item.price (quantity invariant)
  total: number;               // subtotal - coupon (bounded >= 0)
};
```

### 5. Key Behaviors
| Behavior | Notes |
|----------|-------|
| Add item | If id already exists: ignore (context) + show toast (button) |
| Remove item | Straight filter removal; totals recomputed |
| Apply coupon | Validates remotely; persisted when successful |
| Clear coupon | Resets discount path cleanly |
| Subtotal calc | Ignores (deprecated) quantity; purely additive |
| Hydration normalization | Coerces any legacy `quantity` to `1`; strips invalid items |

### 6. Checkout Page (`app/(public routes)/checkout/page.tsx`)
Provides: cart line items, coupon form, derived totals, payment action. Mobile-friendly layout adjustments applied (stacked sections, responsive spacing). Empty state routes to `/course` for discovery.

### 7. Add-to-Cart Button (`components/lms/checkout-button.tsx`)
Central logic:
* Parses/normalizes incoming price (accepts string or number props in source components).
* Guards duplicates (context already blocks; UI adds user-facing toast).
* Optional `autoNavigate` flag (defaults as needed) for contexts where immediate checkout makes sense.

### 8. Layout Refactor Rationale
Problem: Public chrome was rendering inside private/student layouts causing duplication and potential hydration divergence.
Solution: Root layout now only hosts providers (Auth, Query, Cart, Toaster). A `(public routes)/layout.tsx` wraps only marketing/public pages with shared chrome. Private/learning segments define their own scoped layout without public elements.

### 9. Routing Normalization
Legacy paths using `/home/...` replaced. Actions taken:
* Updated all `router.push('/home/checkout')` → `/checkout`.
* Updated course navigation: `/home/course/${id}` → `/course/${id}`.
* Empty/cart discovery links now point to `/course`.
* Documentation references (`PAYMENT_INTEGRATION.md`) updated.
* Legacy page `app/(public routes)/home/checkout/page.tsx` retained temporarily (candidate for deletion or redirect rule).

### 10. Error / Edge Handling
| Edge Case | Strategy |
|-----------|----------|
| Prerender mismatch | Forced dynamic behavior where client-only state needed |
| Duplicate add | Non-mutating early-return + user toast |
| Legacy quantity data | Normalization effect ensures forward compatibility |
| Empty cart payment attempt | Payment action guarded (no initialization if zero paid items) |
| Coupon on empty cart | UI disables / no-op (guard) |
| Stale coupon after item removal | Recompute totals each render (derived, not cached) |

### 11. Performance Considerations
* Cart size small (bounded by unique courses user selects) → O(n) recomputations acceptable.
* LocalStorage reads limited to initial hydration + explicit writes.
* Derived subtotal/total kept simple; no memoization required under current scale.

### 12. Testing / Validation Conducted (Informal)
* Manual add/remove cycles confirming single-instance rule.
* Duplicate add toasts verified.
* Coupon application path triggers remote validation (assumed service reliability; future: add debounce + loading state).
* Navigation from course listings and navbar cart button resolves to canonical `/checkout`.
* Mobile layout visually simplified (stack orientation) – further visual QA recommended in varied breakpoints.

### 13. Known Legacy / Transitional Artifacts
| Artifact | Status | Recommendation |
|----------|--------|----------------|
| `quantity` field (commented in UI / ignored in logic) | Present | Remove after confidence window; run migration to drop from persisted payloads |
| `/home/checkout` page file | Present (unused) | Convert to server redirect or delete |
| `/home/course/*` segment components | May still exist physically | Relocate/remove after confirming no deep links |
| Mixed price input types (string/number) | Supported by normalization | Standardize source data shape (number) |

### 14. Suggested Next Steps
1. Implement redirect: Add a lightweight route handler or page in legacy `/home/checkout` returning a permanent redirect to `/checkout` (then remove file after crawl stabilization).
2. Remove deprecated quantity logic entirely (types + UI traces) once metrics confirm no adverse user reports.
3. Add lightweight unit tests (e.g., for `CartContext` reducer-like behaviors) if test harness exists.
4. Extend coupon model to support course-specific applicability (prepare for multi-pricing tiers).
5. Introduce optimistic skeleton/loading states for payment initialization.
6. Instrument analytics: events for add_to_cart, remove_from_cart, apply_coupon, init_payment.
7. Guard against mixed-currency or dynamic pricing changes (if roadmap includes localized pricing).

### 15. Removal Checklist (When Finalizing Cleanup)
[] Delete or redirect legacy `/home/checkout` page.
[] Search & purge any remaining `/home/course` deep links or references (including SEO artifacts / sitemap generators).
[] Strip `quantity` from persisted state transformation & types.
[] Update documentation diagrams (if any) to reflect simplified model.

### 16. Architectural Rationale Recap
Simplification (single-instance cart) reduces cognitive & UI complexity while keeping path open for future expansion (reinstate quantity if business need emerges). Centralizing all cart mutations in one context enforces invariants (no duplicates, normalized pricing) and minimizes conditional logic spread across the component tree. Layout segmentation prevents UI duplication and resolves hydration risks from environment-dependent chrome.

### 17. Risk Register (Current)
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Forgotten legacy deep links to `/home/course/:id` | Medium | 404 / SEO loss | Temporary redirect mapping; sitemap refresh |
| Coupon service latency | Medium | Perceived slowness | Add loading state + debounce |
| Persisted stale coupon after model change | Low | Incorrect discount | Version stamp cart payload; invalidate on schema bump |
| Future multi-currency requirement | Medium | Rework totals & coupon logic | Abstract pricing pipeline early |

### 18. Quick Reference (Developer Cheatsheet)
* Add to cart: `useCart().addItem({ id, title, price })`
* Remove: `useCart().removeItem(id)`
* Apply coupon: `useCart().applyCoupon(code)`
* Canonical checkout route: `/checkout`
* Course listing: `/course`
* Do not reintroduce `/home` prefix.

### 19. Status
Implementation complete; awaiting optional cleanup + test hardening. This document should be updated as subsequent refinements (redirects, type removals) are shipped.

---
Maintainer: (Add name/owner)
Last Updated: (Insert date when editing)
