import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const inputId = useId();
  const [value, setValue] = useState('');

  const trimmedValue = value.trim();
  const canSubmit = trimmedValue.length > 0 && !disabled;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    onSearch(trimmedValue);
  }

  return (
    <form
      role="search"
      aria-label="Buscar cidade"
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md sm:flex-row sm:items-end"
    >
      <div className="flex w-full flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-white/80">
          Cidade
        </label>
        <input
          id={inputId}
          type="search"
          name="city"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          autoComplete="off"
          placeholder="Ex.: Brasília"
          className="w-full rounded-xl border border-white/10 bg-night-800/60 px-4 py-3 text-base text-white placeholder:text-white/40 backdrop-blur-xs focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-xl bg-accent-500 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buscar
      </button>
    </form>
  );
}
