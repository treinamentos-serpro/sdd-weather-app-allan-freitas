/**
 * Orquestra busca de cidade -> seleção -> clima, expondo uma máquina de
 * estados simples para a UI (ver plans/weather-app-plan.md).
 */

import { useCallback, useRef, useState } from 'react';
import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

type LastOperation = { type: 'search'; name: string } | { type: 'selectCity'; city: City };

const UNEXPECTED_ERROR_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente.';

function toErrorMessage(error: unknown): string {
  return error instanceof WeatherServiceError ? error.message : UNEXPECTED_ERROR_MESSAGE;
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const lastOperationRef = useRef<LastOperation | null>(null);

  const loadWeatherForCity = useCallback(async (city: City) => {
    setStatus('loading');
    setError(null);
    try {
      const weather = await getWeather(city);
      setData(weather);
      setStatus('success');
    } catch (err) {
      setData(null);
      setError(toErrorMessage(err));
      setStatus('error');
    }
  }, []);

  const search = useCallback(
    async (name: string) => {
      lastOperationRef.current = { type: 'search', name };
      setQuery(name);
      setStatus('loading');
      setError(null);
      setData(null);

      try {
        const results = await searchCities(name);
        setCities(results);

        if (results.length === 0) {
          setStatus('empty');
          return;
        }

        await loadWeatherForCity(results[0]);
      } catch (err) {
        setCities([]);
        setError(toErrorMessage(err));
        setStatus('error');
      }
    },
    [loadWeatherForCity],
  );

  const selectCity = useCallback(
    async (city: City) => {
      lastOperationRef.current = { type: 'selectCity', city };
      setQuery(city.name);
      await loadWeatherForCity(city);
    },
    [loadWeatherForCity],
  );

  const retry = useCallback(async () => {
    const lastOperation = lastOperationRef.current;
    if (!lastOperation) {
      return;
    }
    if (lastOperation.type === 'search') {
      await search(lastOperation.name);
    } else {
      await selectCity(lastOperation.city);
    }
  }, [search, selectCity]);

  return { status, data, cities, error, query, search, selectCity, retry };
}
