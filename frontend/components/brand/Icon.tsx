interface IconProps { size?: number; className?: string; style?: React.CSSProperties; }

const i = (d: string | React.ReactNode, extra?: string) =>
  ({ size = 16, className, style }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} style={style} {...(extra ? { strokeLinecap: "round" as const, strokeLinejoin: "round" as const } : {})}>
      {typeof d === "string" ? <path d={d} /> : d}
    </svg>
  );

import type React from "react";

export const HomeIcon     = i("M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z");
export const NewsIcon     = i(<><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M7 8h10M7 12h6M7 16h8"/></>);
export const TrophyIcon   = i(<><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M5 5H3v2a3 3 0 0 0 3 3M19 5h2v2a3 3 0 0 1-3 3M9 14h6M12 11v3M8 20h8"/></>);
export const UsersIcon    = i(<><circle cx="9" cy="9" r="3.5"/><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5"/><circle cx="17" cy="8" r="2.5"/><path d="M15 19c.4-2 2-3.5 4-3.5s3.5 1.4 4 3.5"/></>);
export const ShopIcon     = i(<><path d="M4 7h16l-1.4 12.2A2 2 0 0 1 16.6 21H7.4a2 2 0 0 1-2-1.8z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></>);
export const DownloadIcon = i("M12 4v11m0 0l-4-4m4 4l4-4M4 19h16");
export const UserIcon     = i(<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>);
export const CartIcon     = i(<><path d="M3 4h2l2.5 12.5A2 2 0 0 0 9.5 18h8a2 2 0 0 0 2-1.7L21 9H7"/><circle cx="10" cy="21" r="1.2"/><circle cx="17" cy="21" r="1.2"/></>);
export const CoinIcon     = i(<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><path d="M12 9v6M10 11h4M10 13h4"/></>);
export const ArrowRightIcon = i("M5 12h14m0 0l-5-5m5 5l-5 5");
export const ArrowLeftIcon  = i("M19 12H5m0 0l5-5m-5 5l5 5");
export const CheckIcon    = i(<path d="M4 12l5 5L20 6" strokeWidth={2} />);
export const XIcon        = i("M6 6l12 12M18 6L6 18");
export const SearchIcon   = i(<><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></>);
export const GridIcon     = i(<><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></>);
export const ListIcon     = i("M4 6h16M4 12h16M4 18h16");
export const PlusIcon     = i("M12 5v14m-7-7h14");
export const MinusIcon    = i("M5 12h14");
export const GlobeIcon    = i(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>);
export const LockIcon     = i(<><rect x="4" y="10" width="16" height="11" rx="1.5"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></>);
export const MailIcon     = i(<><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/></>);
export const ClockIcon    = i(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>);
export const CardIcon     = i(<><rect x="3" y="6" width="18" height="13" rx="1.5"/><path d="M3 10h18M7 16h4"/></>);
export const RefreshIcon  = i("M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4");
export const CrownIcon    = i("M3 8l4 5 5-7 5 7 4-5v11H3z");
export const MenuIcon     = i("M4 6h16M4 12h16M4 18h16");
export const ChevronDownIcon = i("M6 9l6 6 6-6");
export const LogOutIcon   = i(<><path d="M16 17l5-5-5-5M21 12H9M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8"/></>);
export const BookIcon     = i(<><path d="M4 19V5a2 2 0 0 1 2-2h13v14"/><path d="M4 19a2 2 0 0 0 2 2h13M4 19h13"/></>);

export function SpinnerIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export const CLASS_ICONS = {
  warrior:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 4l6 6-9 9-2 1-1-1 1-2 9-9-4-4z"/><path d="M3 21l5-5"/></svg>,
  assassin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 5l9 9-2 5-5-5z"/><path d="M19 5l-9 9"/></svg>,
  shaman:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="6"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>,
  archer:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20L20 4M14 4h6v6M9 9l2 2M15 15l2 2"/></svg>,
};

export const REALM_COLORS: Record<string, { fg: string; bg: string; brd: string }> = {
  red:    { fg: "#e5536b", bg: "rgba(229,83,107,0.10)", brd: "rgba(229,83,107,0.35)" },
  blue:   { fg: "#5ec1f5", bg: "rgba(94,193,245,0.10)", brd: "rgba(94,193,245,0.35)" },
  yellow: { fg: "#f0c270", bg: "rgba(240,194,112,0.10)", brd: "rgba(240,194,112,0.35)" },
};
