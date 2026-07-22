  // Core block types
// export type Block =
//   | { type: "text"; content: string }
//   | { type: "heading"; content: string }
//   | { type: "list"; items: string[] }
//   | { type: "callout"; label?: string; content: string }
//   | { type: "cta"; label: string; url: string }
//   | { type: "spacer"; size?: number }

export type CalloutVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "highlight";

export type Block =
  | {
      type: "text";
      content: string;
    }
  | {
      type: "heading";
      content: string;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "callout";
      label?: string;
      content: string;
      variant?: CalloutVariant;
    }
  | {
      type: "cta";
      label: string;
      url: string;
    }
  | {
      type: "spacer";
      size?: number;
    };