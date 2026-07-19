import { ImageResponse } from "next/og";
import { getEventById } from "../events-actions";
import { constructUrl } from "@/lib/construct-url";

export const alt = "NextHive Event";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOGO_URL =
  "https://nexthive-lms.t3.storage.dev/Brand%20Identity/NextHive%20Logo%20-%20Orange%20BG.png";
const AMBER = "#FDB606";
const CHARCOAL = "#262226";

export default async function OpengraphImage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await getEventById(params.eventId);

  const startDate = new Date(event.startdate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const bgImage = event.imageKey ? constructUrl(event.imageKey) : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          overflow: "hidden",
          backgroundColor: CHARCOAL,
          background: bgImage
            ? CHARCOAL
            : `radial-gradient(circle at 50% 40%, ${AMBER} 0%, ${CHARCOAL} 70%)`,
          fontFamily: "sans-serif",
        }}
      >
        {/* Event banner as background, when available */}
        {bgImage && (
          <img
            src={bgImage}
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1200px",
              height: "630px",
              objectFit: "cover",
            }}
          />
        )}

        {/* Brand watermark, faint, matches root OG treatment */}
        <img
          src={LOGO_URL}
          width={1440}
          height={756}
          style={{
            position: "absolute",
            width: "120%",
            height: "120%",
            top: "-10%",
            left: "-10%",
            objectFit: "cover",
            opacity: bgImage ? 0.04 : 0.06,
          }}
        />

        {/* Scrim so text reads over any banner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            background: bgImage
              ? `linear-gradient(180deg, rgba(38,34,38,0.1) 0%, rgba(38,34,38,0.6) 55%, rgba(38,34,38,0.96) 100%)`
              : "transparent",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px",
            gap: "18px",
          }}
        >
          {/* Small brand mark, top-left feel via margin-bottom before title */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                background: AMBER,
                borderRadius: "50%",
                padding: "10px",
              }}
            >
              <img src={LOGO_URL} width={28} height={28} alt="" />
            </div>
            <div
              style={{
                display: "flex",
                color: AMBER,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              NextHive
            </div>
          </div>

          {/* Category badge */}
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              backgroundColor: "rgba(253,182,6,0.16)",
              border: `1px solid ${AMBER}`,
              borderRadius: "999px",
              padding: "7px 18px",
              color: AMBER,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {event.eventCategory}
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 54,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "1020px",
            }}
          >
            {event.title}
          </div>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginTop: "6px",
              fontSize: 24,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex" }}>📅</div>
              <div style={{ display: "flex" }}>{startDate}</div>
            </div>
            <div style={{ display: "flex", color: AMBER }}>•</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex" }}>{event.isOnline ? "🌐" : "📍"}</div>
              <div style={{ display: "flex" }}>
                {event.isOnline ? "Virtual Event" : event.venue}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}