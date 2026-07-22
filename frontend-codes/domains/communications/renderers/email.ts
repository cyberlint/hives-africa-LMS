import { Block } from "../blocks/types";

const baseTextStyle = `
  font-size:16px;
  line-height:1.75;
  color:#334155;
  margin:0 0 16px 0;
`;

const calloutVariants = {
  default: { background: "#f8fafc", border: "#e2e8f0", label: "#475569", text: "#334155", textAlign: "left", fontSize: "15px", fontWeight: "400", letterSpacing: "normal", },
  success: { background: "#f0fdf4", border: "#bbf7d0", label: "#15803d", text: "#166534", textAlign: "left", fontSize: "15px", fontWeight: "400", letterSpacing: "normal", },
  warning: { background: "#fffbeb", border: "#fde68a", label: "#ca8a04", text: "#92400e", textAlign: "left", fontSize: "15px", fontWeight: "400", letterSpacing: "normal", },
  danger: { background: "#fef2f2", border: "#fecaca", label: "#dc2626", text: "#991b1b", textAlign: "left", fontSize: "15px", fontWeight: "400", letterSpacing: "normal", },
  highlight: { background: "#fffbeb", border: "#fde68a", label: "#ca8a04", text: "#111827", textAlign: "center", fontSize: "34px", fontWeight: "700", letterSpacing: "8px", },
} as const;

export function renderEmailBlocks(blocks: Block[]) {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      switch (block.type) {

        case "heading":
          return `
            <h2 style="
              margin:0 0 12px 0;
              font-size:24px;
              font-weight:700;
              letter-spacing:-0.02em;
              line-height:1.2;
              color:#0f172a;
            ">
              ${block.content ?? ""}
            </h2>
          `;

        case "text":
          return `
            <p style="${baseTextStyle}">
              ${block.content ?? ""}
            </p>
          `;

        case "list":
          return `
            <ul style="
              margin:0 0 20px 0;
              padding-left:20px;
              color:#334155;
              font-size:16px;
              line-height:1.75;
            ">
              ${(block.items || [])
              .map(
                (item) => `
                    <li style="margin-bottom:8px;">
                      ${item}
                    </li>
                  `
              )
              .join("")}
            </ul>
          `;

        case "callout": {
          const variant =
            calloutVariants[
            block.variant ?? "default"
            ];

          return ` 
            <div style="
              background:${variant.background};
              border:1px solid ${variant.border};
              padding:16px 18px;
              border-radius:14px;
              margin:20px 0;
            ">

      ${block.label
              ? `<p style="
              margin:0 0 6px 0;
              font-size:11px;
              font-weight:700;
              letter-spacing:0.08em;
              text-transform:uppercase;
              color:${variant.label};
            ">
              ${block.label}
            </p>`
              : ""
            }

      <p style="
        margin:0;
        color:${variant.text};
        font-size:${variant.fontSize};
        font-weight:${variant.fontWeight};
        line-height:1.6;
        text-align:${variant.textAlign};
        letter-spacing:${variant.letterSpacing};
      ">
        ${block.content ?? ""}
      </p>

    </div>
  `;
        }
        case "cta":
          return `
            <div style="margin:24px 0 8px 0;">
              <a href="${block.url}"
                style="
                  display:inline-block;
                  background:#111827;
                  color:#ffffff;
                  font-weight:600;
                  font-size:14px;
                  line-height:1;
                  padding:14px 22px;
                  border-radius:999px;
                  text-decoration:none;
                  box-shadow:0 8px 20px rgba(15,23,42,0.12);
                ">
                ${block.label ?? "Continue"}
              </a>
            </div>
          `;

        case "spacer":
          return `
            <div style="height:${Math.max(10, block.size || 16)}px;"></div>
          `;

        default:
          return "";
      }
    })
    .join("");
}