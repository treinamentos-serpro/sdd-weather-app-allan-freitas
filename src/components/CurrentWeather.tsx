import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherModel, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherModel;
  unit: Unit;
}

function formatMetric(value: number | null, suffix: string, fractionDigits = 0): string {
  if (value === null || !Number.isFinite(value)) {
    return '—';
  }
  return `${value.toFixed(fractionDigits)}${suffix}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const { condition } = current;
  const windValue = formatMetric(current.windSpeedKmh, ' km/h', 1);
  const wind =
    current.windSpeedKmh !== null && current.windDirectionCardinal
      ? `${windValue} ${current.windDirectionCardinal}`
      : windValue;

  const metrics = [
    { label: 'Umidade', value: formatMetric(current.humidityPercent, '%') },
    { label: 'Vento', value: wind },
    { label: 'Precipitação (24h)', value: formatMetric(current.precipitationLast24hMm, ' mm', 1) },
    { label: 'Pressão', value: formatMetric(current.pressureHpa, ' hPa') },
  ];

  return (
    <section
      aria-label={`Clima atual em ${city.name}`}
      className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md sm:p-8"
    >
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{city.name}</h2>
        <p className="text-sm text-white/60">
          {[city.region, city.country].filter(Boolean).join(', ')}
        </p>
      </header>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
        <span aria-hidden="true" className="text-6xl leading-none sm:text-7xl">
          {getWeatherIcon(condition.code)}
        </span>

        <div className="flex flex-col items-center sm:items-start">
          <p className="text-6xl font-bold tracking-tight text-white sm:text-7xl">
            {formatTemperature(current.temperatureCelsius, unit)}
          </p>
          <p className="mt-1 text-base text-white/80">{condition.label}</p>
          <p className="text-sm text-white/60">
            Sensação térmica {formatTemperature(current.apparentTemperatureCelsius, unit)}
          </p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-white/10 bg-night-800/50 p-4 backdrop-blur-xs"
          >
            <dt className="text-xs uppercase tracking-wide text-white/60">{metric.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-white">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
