import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window { Pusher: typeof Pusher }
}

let echo: Echo | null = null;

export function getEcho(): Echo {
  if (!echo) {
    window.Pusher = Pusher;
    echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
      wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? "8080"),
      wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT ?? "8080"),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http") === "https",
      enabledTransports: ["ws", "wss"],
    });
  }
  return echo;
}
