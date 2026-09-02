import { type KeyboardEvent, useRef } from 'react';
import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const OPTIONS: ReadonlyArray<{ value: Unit; symbol: string; label: string }> = [
  { value: 'celsius', symbol: '°C', label: 'Celsius' },
  { value: 'fahrenheit', symbol: '°F', label: 'Fahrenheit' },
];

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = OPTIONS.findIndex((option) => option.value === unit);
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % OPTIONS.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + OPTIONS.length) % OPTIONS.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = OPTIONS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextOption = OPTIONS[nextIndex];
    if (!nextOption) {
      return;
    }
    buttonRefs.current[nextIndex]?.focus();
    if (nextOption.value !== unit) {
      onChange(nextOption.value);
    }
  }

  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      onKeyDown={handleKeyDown}
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md"
    >
      {OPTIONS.map((option, index) => {
        const isActive = option.value === unit;
        return (
          <button
            key={option.value}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            aria-pressed={isActive}
            aria-label={`Exibir temperatura em ${option.label}`}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 ${
              isActive
                ? 'bg-accent-500 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {option.symbol}
          </button>
        );
      })}
    </div>
  );
}
