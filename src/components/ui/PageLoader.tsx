/**
 * Full-page loading skeleton with Bogornesia-themed shimmer.
 */
export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo mark */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-ping rounded-full bg-forest-600/30" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 border border-forest-700/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5 text-forest-400 animate-pulse"
            >
              <path d="M17.5 10c0 4.5-5.5 9-5.5 9S6.5 14.5 6.5 10a5.5 5.5 0 0 1 11 0z" />
              <circle cx="12" cy="10" r="2" />
            </svg>
          </div>
        </div>

        <p className="text-sm font-medium text-forest-500 animate-pulse">
          Memuat halaman…
        </p>
      </div>
    </div>
  );
}
