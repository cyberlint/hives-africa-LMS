import { Block } from "../blocks/types";

const baseTextStyle = `
  font-size:15.5px;
  line-height:1.7;
  color:#27272a;
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
              margin:0 0 10px 0;
              font-size:20px;
              font-weight:800;
              letter-spacing:-0.4px;
              color:#111827;
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
              margin:0 0 18px 0;
              padding-left:18px;
              color:#27272a;
              font-size:15px;
              line-height:1.7;
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
              background:#fffbeb;
              border:1px solid #fde68a;
              padding:16px 16px;
              border-radius:12px;
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
                      color:#a16207;
                    ">
                      ${block.label}
                    </p>`
                  : ""
              }

              <p style="
                margin:0;
                font-size:15px;
                line-height:1.6;
                color:#78350f;
              ">
                ${block.content ?? ""}
              </p>
            </div>
          `;

        case "cta":
          return `
            <div style="margin:26px 0 8px 0;">
              <a href="${block.url}"
                style="
                  display:inline-block;
                  background:#FDB606;
                  color:#111827;
                  font-weight:700;
                  font-size:14px;
                  padding:12px 20px;
                  border-radius:8px;
                  text-decoration:none;
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