interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-glass backdrop-blur-md">
      <span aria-hidden="true" className="text-3xl leading-none">
        🔍
      </span>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="max-w-md text-sm text-white/70">{hint}</p>
    </div>
  );
}
