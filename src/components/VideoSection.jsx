import React, { useRef, useState } from 'react';

export default function VideoSection() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100vh',
      overflow: 'hidden', background: '#1a1410',
    }}>
      <video
        ref={videoRef} autoPlay muted loop playsInline
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.4,
        }}
      >
        <source src="https://assets.mixkit.co/videos/4826/4826-720.mp4" type="video/mp4"/>
      </video>

      {/* Warm stone-brass gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(35,32,24,0.8) 0%, rgba(107,76,42,0.45) 50%, rgba(35,32,24,0.85) 100%)',
      }}/>

      {/* Brass shimmer top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(to right, transparent, var(--brass), transparent)',
        opacity: 0.7,
      }}/>

      {/* Overlay text */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 40px',
      }}>
        <p style={{
          fontFamily: 'var(--body)', fontSize: '0.7rem',
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'var(--brass-lt)', marginBottom: 28,
          opacity: 0, animation: 'fadeUp 0.8s 0.2s forwards',
        }}>
          The Movement Behind Commerce
        </p>
        <h2 style={{
          fontFamily: 'var(--sans)',
          fontSize: 'clamp(3rem, 8vw, 8rem)',
          fontWeight: 900, lineHeight: 0.95,
          letterSpacing: '-0.04em', color: 'var(--sand)',
          fontVariationSettings: "'opsz' 72",
          opacity: 0, animation: 'fadeUp 1s 0.4s forwards',
        }}>
          Every cargo.<br/>
          <span style={{ color: 'var(--brass-lt)' }}>Every mile.</span><br/>
          Accounted for.
        </h2>
      </div>

      {/* Mute toggle */}
      <button onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'} style={{
        position: 'absolute', bottom: 36, right: 36, zIndex: 3,
        background: 'rgba(181,146,42,0.2)', border: '1px solid rgba(181,146,42,0.35)',
        color: 'var(--brass-lt)', borderRadius: '50%',
        width: 44, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', backdropFilter: 'blur(8px)', fontSize: '1rem',
      }}>
        {muted ? '🔇' : '🔊'}
      </button>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 3,
        opacity: 0, animation: 'fadeIn 1s 1.2s forwards',
      }}>
        <div style={{
          width: 1, height: 50,
          background: 'linear-gradient(to bottom, var(--brass), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }}/>
      </div>

      {/* Brass shimmer bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(to right, transparent, var(--brass), transparent)',
        opacity: 0.7,
      }}/>
    </div>
  );
}
