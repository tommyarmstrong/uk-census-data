import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="animate-fade-in flex max-w-2xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          About
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
          UK Census Data is a frontend explorer for official Census 2021
          statistics for England and Wales. Charts load live from{" "}
          <a
            href="https://www.nomisweb.co.uk/"
            className="text-foreground hover:text-primary underline-offset-4 transition-colors hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            NOMIS
          </a>{" "}
          (Office for National Statistics).
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">Data source</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Figures are Census 2021 Topic Summary tables published via NOMIS.
          Geography coverage is England and Wales (and English regions / Wales).
          Scotland and Northern Ireland use separate statistical systems and are
          out of scope for these datasets.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">Licence</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Census 2021 / NOMIS statistics used in this application are Crown
          copyright and are available under the{" "}
          <a
            href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
            className="text-foreground hover:text-primary underline-offset-4 transition-colors hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open Government Licence v3.0
          </a>
          .
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          You are free to copy, publish, distribute and adapt the information,
          including commercially, provided you follow the licence terms. When
          you use this data, please include attribution such as:{" "}
          <span className="text-foreground">
            Source: Office for National Statistics licensed under the Open
            Government Licence v3.0.
          </span>
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This website is an independent tool and is not affiliated with the ONS
          or NOMIS. Always verify critical figures against the official NOMIS /
          ONS publications.
        </p>
      </section>

      <p className="text-sm">
        <Link
          href="/"
          className="text-primary font-medium underline-offset-4 transition-colors hover:underline"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}
