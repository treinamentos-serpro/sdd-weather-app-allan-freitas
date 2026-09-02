import { formatDayLabel, formatPercent, formatShortDate } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const dayLabel = formatDayLabel(day.dateLocal);
  const maxTemperature = formatTemperature(day.maxTemperatureCelsius, unit);
  const minTemperature = formatTemperature(day.minTemperatureCelsius, unit);

  return (
    <li className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-glass backdrop-blur-md">
      <p className="text-sm font-semibold text-white">{dayLabel}</p>
      <p className="text-xs text-white/60">{formatShortDate(day.dateLocal)}</p>

      <span aria-hidden="true" className="text-3xl leading-none">
        {getWeatherIcon(day.condition.code)}
      </span>
      <p className="text-xs text-white/70">{day.condition.label}</p>

      <p className="text-base font-semibold text-white">
        <span className="text-sun">{maxTemperature}</span>
        <span className="px-1 text-white/40">/</span>
        <span className="text-white/70">{minTemperature}</span>
        <span className="sr-only">
          {` máxima de ${maxTemperature} e mínima de ${minTemperature}`}
        </span>
      </p>

      <p className="text-xs text-white/70">Chuva {formatPercent(day.rainProbabilityPercent)}</p>
    </li>
  );
}
