interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex w-full flex-col items-center gap-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-center shadow-glass backdrop-blur-md"
    >
      <span aria-hidden="true" className="text-3xl leading-none">
        ⚠️
      </span>
      <p className="text-sm text-white/90">{message}</p>

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900"
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
