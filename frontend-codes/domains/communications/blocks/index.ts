import { Block }   from "./types";

// Helper creators (keeps usage clean)
export const blocks = {
  text: (content: string): Block => ({ type: "text", content }),
  heading: (content: string): Block => ({ type: "heading", content }),
  list: (items: string[]): Block => ({ type: "list", items }),
  callout: (label: string, content: string): Block => ({
    type: "callout",
    label,
    content,
  }),
  cta: (label: string, url: string): Block => ({
    type: "cta",
    label,
    url,
  }),
  spacer: (size = 16): Block => ({ type: "spacer", size }),
}