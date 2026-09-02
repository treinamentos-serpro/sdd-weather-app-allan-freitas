import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ days, unit }: ForecastListProps) {
  return (
    <section aria-label="Previsão para os próximos dias" className="w-full">
      <h2 className="mb-3 text-lg font-semibold text-white">Próximos dias</h2>

      {days.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur-md">
          Nenhuma previsão disponível para esta cidade.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {days.map((day) => (
            <ForecastCard key={day.dateLocal} day={day} unit={unit} />
          ))}
        </ul>
      )}
    </section>
  );
}
