/**
 * Utility functions for purchase and payment operations
 */

export interface Purchase {
  id: string
  courseTitle: string
  instructor: string
  instructorAvatar: string
  courseThumbnail: string
  purchaseDate: string
  amount: number
  originalPrice: number
  discount: number
  paymentMethod: string
  status: "completed" | "pending" | "refunded"
  receiptUrl: string
  category: string
  rating?: number
  courseId?: string
  paymentReference?: string
}

export interface ReceiptData {
  id: string
  reference: string
  courseTitle: string
  instructor: string
  purchaseDate: string
  originalPrice: number
  discount: number
  discountAmount: number
  amount: number
  currency: string
  status: string
  category: string
  receiptUrl?: string
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

/**
 * Formats currency amount
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Calculates discount percentage
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice === 0) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Calculates discount amount
 */
export function calculateDiscountAmount(originalPrice: number, salePrice: number): number {
  return Math.max(0, originalPrice - salePrice)
}

/**
 * Filters purchases based on status and search query
 */
export function filterPurchases(
  purchases: Purchase[],
  searchQuery: string,
  filterStatus: string
): Purchase[] {
  return purchases.filter((purchase) => {
    const matchesSearch =
      purchase.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.instructor.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && purchase.status === filterStatus
  })
}

/**
 * Sorts purchases based on sort option
 */
export function sortPurchases(
  purchases: Purchase[],
  sortBy: string
): Purchase[] {
  const sorted = [...purchases]

  switch (sortBy) {
    case "recent":
      return sorted.sort(
        (a, b) =>
          new Date(b.purchaseDate).getTime() -
          new Date(a.purchaseDate).getTime()
      )
    case "amount":
      return sorted.sort((a, b) => b.amount - a.amount)
    case "alphabetical":
      return sorted.sort((a, b) =>
        a.courseTitle.localeCompare(b.courseTitle)
      )
    default:
      return sorted
  }
}

/**
 * Calculates purchase statistics
 */
export function calculatePurchaseStats(purchases: Purchase[]) {
  const completedPurchases = purchases.filter((p) => p.status === "completed")

  return {
    totalSpent: completedPurchases.reduce((sum, p) => sum + p.amount, 0),
    totalSaved: completedPurchases.reduce((sum, p) => sum + p.discount, 0),
    completedCount: completedPurchases.length,
    thisMonth: completedPurchases.filter((p) => {
      const purchaseDate = new Date(p.purchaseDate)
      const now = new Date()
      return (
        purchaseDate.getMonth() === now.getMonth() &&
        purchaseDate.getFullYear() === now.getFullYear()
      )
    }).length,
  }
}

/**
 * Downloads receipt by opening Paystack receipt PDF URL
 */
export async function downloadReceipt(paymentId: string, receiptUrl?: string): Promise<void> {
  try {
    // If receiptUrl is provided directly and is a full URL, open/download it
    if (receiptUrl && receiptUrl.startsWith('http')) {
      if (receiptUrl.toLowerCase().endsWith('.pdf')) {
        const a = document.createElement("a");
        a.href = receiptUrl;
        a.download = `receipt-${paymentId}.pdf`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(receiptUrl, '_blank');
      }
      return;
    }

    // Otherwise fetch the receipt data to get the URL
    const response = await fetch(`/api/purchases/${paymentId}/receipt`);

    if (!response.ok) {
      throw new Error("Failed to fetch receipt");
    }

    const receipt = await response.json();
    const receiptData = receipt.data;

    // Try to open/download Paystack receipt URL
    if (receiptData && receiptData.receiptUrl && receiptData.receiptUrl.startsWith('http')) {
      const url = receiptData.receiptUrl;
      if (url.toLowerCase().endsWith('.pdf')) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `receipt-${receiptData.reference || paymentId}.pdf`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(url, '_blank');
      }
    } else {
      // Fallback: download as text file if no URL is available
      const receiptContent = generateReceiptContent(receiptData);
      const blob = new Blob([receiptContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${receiptData.reference || paymentId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error("Error downloading receipt:", error);
    throw error;
  }
}

/**
 * Generate receipt content as text (used by backend)
 */
export function generateReceiptContent(receipt: ReceiptData): string {
  const divider = "=".repeat(50)
  const lines = [
    divider,
    "PURCHASE RECEIPT",
    divider,
    "",
    `Receipt #: ${receipt.reference}`,
    `Date: ${receipt.purchaseDate}`,
    `Status: ${receipt.status.toUpperCase()}`,
    "",
    divider,
    "COURSE DETAILS",
    divider,
    `Title: ${receipt.courseTitle}`,
    `Instructor: ${receipt.instructor}`,
    `Category: ${receipt.category}`,
    "",
    divider,
    "PAYMENT SUMMARY",
    divider,
    `Original Price: ${receipt.currency} ${receipt.originalPrice.toFixed(2)}`,
    ...(receipt.discount > 0
      ? [
        `Discount (${receipt.discount}%): -${receipt.currency} ${receipt.discountAmount.toFixed(2)}`,
      ]
      : []),
    `Total Paid: ${receipt.currency} ${receipt.amount.toFixed(2)}`,
    "",
    divider,
    `Generated on: ${new Date().toLocaleString()}`,
    divider,
  ]

  return lines.join("\n")
}
