import { Button } from "@headlessui/react";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/lib/auth";
import { SpotifyIcon } from "@/components/utils/icons";

export const runtime = "edge";

export default async function Login({ searchParams }) {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  const handleLogin = async () => {
    "use server";
    await signIn("spotify", { redirectTo: "/" });
  };

  return (
    <main className="relative">
      <div className="flex flex-col items-center justify-center gap-8 relative z-10 h-svh w-svw">
        <div>
          <h1 className="text-5xl sm:text-7xl font-black text-center relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-zinc-200 to-zinc-500">
            Spotify Web Player
          </h1>

          <form
            action={handleLogin}
            className="mt-2 sm:mt-6 flex flex-col items-center justify-center"
          >
            {searchParams.error && (
              <p className="text-sm first-letter:text-zinc-400 mb-1">
                Something went wrong.
              </p>
            )}

            <Button
              type="submit"
              className="bg-zinc-800/50 data-[hover]:bg-zinc-800/75 backdrop-blur-xl text-zinc-100 px-3 py-1.5 rounded-md flex gap-2 items-center group"
            >
              <SpotifyIcon className="size-5 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
              <span className="font-medium select-none">
                Sign in with Spotify
              </span>
            </Button>
          </form>
        </div>
        <div className="sm:absolute bottom-10">
          <p className="text-sm text-zinc-400 max-w-xl text-center text-balance mt-3">
            This website is <span className="font-semibold">open-source</span>.
            You can find the code on{" "}
            <a
              href="https://github.com/r4ultv/spotify-web-player"
              className="font-semibold"
            >
              GitHub
            </a>
            . If you need more information you can check out my{" "}
            <a
              href="https://www.raulcarini.dev/blog/spotify-web-player"
              className="font-semibold"
            >
              blog post
            </a>
            .
          </p>

          <p className="text-sm text-zinc-400 max-w-xl text-center text-balance mt-3">
            Build for You by{" "}
            <a href="https://www.raulcarini.dev" className="font-semibold">
              Raul Carini
            </a>
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgbnVtT2N0YXZlcz0iMyIgc2VlZD0iMiIgcmVzdWx0PSJub2lzZSI+PC9mZVR1cmJ1bGVuY2U+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIj48L2ZlQ29sb3JNYXRyaXg+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-50" />
    </main>
  );
}
