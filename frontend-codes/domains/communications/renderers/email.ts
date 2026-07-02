import { Block } from "../blocks/types";

const baseTextStyle = `
  font-size:16px;
  line-height:1.75;
  color:#334155;
  margin:0 0 16px 0;
`;

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

        case "callout":
          return `
            <div style="
              background:#f8fafc;
              border:1px solid #e2e8f0;
              padding:16px 18px;
              border-radius:14px;
              margin:20px 0;
            ">
              ${
                block.label
                  ? `<p style="
                      margin:0 0 6px 0;
                      font-size:11px;
                      font-weight:700;
                      letter-spacing:0.08em;
                      text-transform:uppercase;
                      color:#475569;
                    ">
                      ${block.label}
                    </p>`
                  : ""
              }

              <p style="
                margin:0;
                font-size:15px;
                line-height:1.6;
                color:#334155;
              ">
                ${block.content ?? ""}
              </p>
            </div>
          `;

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