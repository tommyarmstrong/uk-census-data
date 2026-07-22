export function SiteFooter() {
  return (
    <footer className="border-border/80 bg-card/40 border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-8 text-xs leading-relaxed sm:px-6">
        <p>
          UK Census 2021 data explorer. Statistics from{" "}
          <a
            href="https://www.nomisweb.co.uk/"
            className="text-foreground hover:text-primary underline-offset-4 transition-colors hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            NOMIS
          </a>{" "}
          (ONS).
        </p>
      </div>
    </footer>
  );
}
