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
          (ONS). Installable as an app; offline uses last cached chart data
          only.
        </p>
      </div>
    </footer>
  );
}
