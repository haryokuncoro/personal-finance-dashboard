import Navbar from "@/components/navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center px-6">
        <div className="max-w-2xl">
          <h1 className="mb-6 text-5xl font-bold">
            Personal Finance Dashboard
          </h1>

          <p className="mb-6 text-lg text-gray-600">
            Track your income, expenses,
            and financial habits in one place.
          </p>

          <div className="flex gap-4">
            <a
              href="/register"
              className="rounded bg-black px-6 py-3 text-white"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="rounded border px-6 py-3"
            >
              Login
            </a>
          </div>
        </div>
      </main>
    </>
  );
}