export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #2A9D8F 0%, #6EC6B8 40%, #A8DDD4 70%, #D0F0EA 100%)" }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer circle */}
        <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="6" fill="none" />
        <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="3" fill="none" />

        {/* BOBBY text along top arc */}
        <defs>
          <path id="topArc" d="M 30,100 a 70,70 0 0,1 140,0" />
          <path id="bottomArc" d="M 170,108 a 70,70 0 0,1 -140,0" />
        </defs>
        <text fill="white" fontSize="24" fontWeight="900" fontFamily="sans-serif" letterSpacing="6">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">BOBBY</textPath>
        </text>

        {/* APPROVED text along bottom arc */}
        <text fill="white" fontSize="20" fontWeight="900" fontFamily="sans-serif" letterSpacing="4">
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">APPROVED</textPath>
        </text>

        {/* Stars */}
        <polygon points="38,82 40,77 42,82 38,82" fill="white" />
        <polygon points="36,78 38,72 40,78 36,78" fill="white" />
        <polygon points="158,82 160,77 162,82 158,82" fill="white" />
        <polygon points="160,78 162,72 164,78 160,78" fill="white" />

        {/* Thumbs up circle */}
        <circle cx="100" cy="96" r="32" stroke="white" strokeWidth="4" fill="none" />

        {/* Thumbs up icon */}
        <path d="M92 108 L92 94 M92 94 L96 82 C97 79 101 78 102 81 L100 90 L112 90 C115 90 117 93 116 96 L113 108 C112 110 110 112 108 112 L96 112 C94 112 92 110 92 108Z" fill="white" />
        <rect x="84" y="94" width="8" height="18" rx="2" fill="white" />

        {/* Sparkle dots (splatter effect) */}
        <circle cx="62" cy="68" r="1.5" fill="white" opacity="0.7" />
        <circle cx="56" cy="88" r="1" fill="white" opacity="0.5" />
        <circle cx="140" cy="72" r="1.5" fill="white" opacity="0.7" />
        <circle cx="68" cy="112" r="1" fill="white" opacity="0.6" />
        <circle cx="134" cy="108" r="1.2" fill="white" opacity="0.5" />
      </svg>
    </div>
  );
}
