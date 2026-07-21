import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-xs sm:px-6">
        <p>
          UK Census 2021 data explorer. Statistics from{" "}
          <a
            href="https://www.nomisweb.co.uk/"
            className="text-foreground underline-offset-4 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            NOMIS
          </a>{" "}
          (ONS).
        </p>
        <p>
          <Link
            href="/spike"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Data-layer spike
          </Link>
          <span> — live fetch, cache, and offline failure proof.</span>
        </p>
      </div>
    </footer>
  );
}
