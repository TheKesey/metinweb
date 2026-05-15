interface KeseyMarkProps {
  size?: number;
  glow?: boolean;
}

export function KeseyMark({ size = 32, glow = true }: KeseyMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={glow ? { filter: "drop-shadow(0 0 12px rgba(34,197,224,0.45))" } : undefined}
    >
      <defs>
        <linearGradient id="kg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7df0ff" />
          <stop offset="55%"  stopColor="#22c5e0" />
          <stop offset="100%" stopColor="#0a6b7e" />
        </linearGradient>
      </defs>
      <path
        d="M20 4 L44 4 L60 20 L60 44 L44 60 L20 60 L4 44 L4 20 Z"
        fill="none"
        stroke="url(#kg)"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <path
        d="M22 10 L42 10 L54 22 L54 42 L42 54 L22 54 L10 42 L10 22 Z"
        fill="none"
        stroke="url(#kg)"
        strokeWidth="0.6"
        opacity="0.5"
      />
      <path
        d="M22 16 L22 48 M22 32 L36 16 M22 32 L38 48"
        fill="none"
        stroke="url(#kg)"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <circle cx="46" cy="22" r="1.5" fill="#cdf5ff" />
    </svg>
  );
}
