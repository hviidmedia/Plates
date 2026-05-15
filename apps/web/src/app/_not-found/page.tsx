export default function TenantNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Restaurant not found</h1>
      <p className="text-zinc-600">
        We could not find a restaurant at this address. Check the URL, or visit{" "}
        <a href="https://counter.app" className="underline">
          counter.app
        </a>{" "}
        to learn more.
      </p>
    </main>
  );
}
