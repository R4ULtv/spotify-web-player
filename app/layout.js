import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Spotify Web Player - By Raul Carini",
  description:
    "A web player for Spotify. Visualize your music in real-time with a batter experience. You can control your playback if you have a Spotify premium account.",
  openGraph: {
    images: [
      {
        url: "https://www.raulcarini.dev/api/dynamic-og?title=Spotify%20Web%20Player&description=Visualize%20your%20music%20in%20real-time%20with%20a%20batter%20experience.",
        width: 843,
        height: 441,
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased scroll-smooth">
      <body
        className={`${GeistSans.className} bg-spotify-black selection:bg-zinc-600/25`}
      >
        {children}

        <Toaster
          toastOptions={{
            classNames: {
              toast:
                "border border-zinc-500/50 bg-zinc-900/75 text-zinc-200 gap-2",
            },
          }}
        />
      </body>
    </html>
  );
}
