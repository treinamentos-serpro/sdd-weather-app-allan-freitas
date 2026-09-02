import type { Unit } from '../types/weather';

export function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

export function convertTemperature(celsius: number, unit: Unit): number {
  return unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius;
}

export function unitSymbol(unit: Unit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

/** Retorna o traço de dado ausente quando a temperatura não está disponível. */
export function formatTemperature(celsius: number | null, unit: Unit): string {
  if (celsius === null || !Number.isFinite(celsius)) {
    return '—';
  }
  return `${Math.round(convertTemperature(celsius, unit))}${unitSymbol(unit)}`;
}
