import { Button } from "@headlessui/react";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/lib/auth";

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                fill="currentColor"
                className="size-5 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75"
              >
                <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z" />
              </svg>
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
