import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const { status, data, error, query, search, retry } = useWeather();

  function renderContent() {
    switch (status) {
      case 'loading':
        return <LoadingState />;
      case 'error':
        return (
          <ErrorState
            message={error ?? 'Não foi possível carregar a previsão. Verifique sua conexão e tente novamente.'}
            onRetry={retry}
          />
        );
      case 'empty':
        return (
          <EmptyState
            title={`Nenhum resultado para “${query}”`}
            hint="Confira a grafia do nome da cidade ou tente uma cidade próxima."
          />
        );
      case 'success':
        return data ? (
          <div className="flex flex-col gap-6">
            <CurrentWeather city={data.location.city} current={data.current} unit={unit} />
            <ForecastList days={data.daily} unit={unit} />
          </div>
        ) : null;
      default:
        return (
          <EmptyState
            title="Busque uma cidade para começar"
            hint="Digite o nome de uma cidade no campo acima para ver o clima atual e a previsão dos próximos dias."
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-night-900 bg-gradient-to-b from-night-900 via-night-800 to-night-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="text-3xl leading-none">
                🌤️
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                SDD Weather
              </h1>
            </div>
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>

          <SearchBar onSearch={search} disabled={status === 'loading'} />
        </header>

        <main className="flex flex-col gap-6">{renderContent()}</main>
      </div>
    </div>
  );
}
