export function PageNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <section
        aria-labelledby="not-found-title"
        className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center text-card-foreground shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-ieee-blue">
          Oops! Page Not Found
        </p>
        <h1 id="not-found-title" className="mt-3 text-2xl font-semibold">
          404
        </h1>
        <p className="mt-3 text-muted-foreground">
          We couldn't find this page.
        </p>
        <a
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-ieee-blue px-5 py-2 font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          href="/"
        >
          Return to homepage
        </a>
      </section>
    </main>
  )
}
