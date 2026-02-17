import { ImageResponse } from 'next/og';

export const alt = 'NextHive - Connect with the Swarm';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#262226',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #FDB606 0%, #262226 70%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}>
        {/* Subtle tech pattern overlay */}
        <div style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          top: '-10%',
          left: '-10%',
          backgroundImage: 'url("https://nexthive-lms.t3.storage.dev/Brand%20Identity/hex-pattern.png")',
          opacity: 0.05,
          backgroundRepeat: 'repeat',
        }} />

        {/* Logo Container */}
        <div style={{
          display: 'flex',
          background: '#FDB606',
          borderRadius: '50%',
          padding: '35px',
          marginBottom: '25px',
          boxShadow: '0 0 60px rgba(253,182,6,0.6)',
        }}>
          <img
            src="https://nexthive-lms.t3.storage.dev/Brand%20Identity/NextHive%20Logo%20-%20Orange%20BG.png"
            width="180" height="180" alt="NextHive Logo"
          />
        </div>

        {/* Brand Text */}
        <h1 style={{
          fontSize: 80,
          fontWeight: 800,
          color: 'white',
          margin: 0,
          textShadow: '3px 3px 15px rgba(0,0,0,0.6)',
        }}>
          NextHive
        </h1>
        <p style={{
          fontSize: 32,
          fontWeight: 500,
          color: '#FDB606',
          marginTop: 12,
          textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
        }}>
          The Pan-African AI School
        </p>
      </div>
    ),
    { ...size }
  );
}