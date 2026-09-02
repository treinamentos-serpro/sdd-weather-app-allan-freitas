/**
 * Acesso a dados da Open-Meteo. Nenhum componente deve chamar `fetch`
 * diretamente; toda a rede fica isolada aqui (ver plans/weather-app-plan.md).
 */

import { toWeatherCondition } from '../lib/weatherCodes';
import type { CurrentWeather, DailyForecast, City, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const FORECAST_DAYS = 5;
const CARDINAL_DIRECTIONS = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
const REQUEST_TIMEOUT_MS = 10_000;

/** Erro de domínio com mensagem já pronta para exibir ao usuário. */
export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

/** Faz fetch com timeout de 10s, normalizando timeout e falha de rede em WeatherServiceError. */
async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais.');
    }
    throw new WeatherServiceError('Falha de rede.');
  } finally {
    clearTimeout(timeoutId);
  }
}

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

function mapGeocodingResult(result: GeocodingResult): City {
  return {
    id: result.id,
    name: result.name,
    country: result.country ?? '',
    countryCode: result.country_code,
    region: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

/** Busca sugestões de cidade pelo nome. Retorna [] sem chamar a rede se `name` estiver vazio. */
export async function searchCities(name: string): Promise<City[]> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(trimmedName)}&count=5&language=pt&format=json`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível buscar cidades. Tente novamente.');
  }

  const data: GeocodingResponse = await response.json();
  return (data.results ?? []).map(mapGeocodingResult);
}

interface ForecastCurrentResponse {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m?: number;
  precipitation?: number;
  weather_code: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
  uv_index?: number;
}

interface ForecastDailyResponse {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: Array<number | null>;
  sunrise: string[];
  sunset: string[];
}

interface ForecastResponse {
  timezone: string;
  current?: ForecastCurrentResponse;
  daily?: ForecastDailyResponse;
}

/** Converte graus (0–360) em ponto cardeal aproximado; `null` quando o grau é desconhecido. */
function toCardinalDirection(degrees: number | null | undefined): string | null {
  if (degrees === null || degrees === undefined || !Number.isFinite(degrees)) {
    return null;
  }
  const index = Math.round(degrees / 45) % CARDINAL_DIRECTIONS.length;
  return CARDINAL_DIRECTIONS[index];
}

function mapCurrentWeather(current: ForecastCurrentResponse): CurrentWeather {
  return {
    temperatureCelsius: current.temperature_2m,
    apparentTemperatureCelsius: current.apparent_temperature,
    condition: toWeatherCondition(current.weather_code ?? null),
    precipitationLast24hMm: current.precipitation ?? null,
    humidityPercent: current.relative_humidity_2m ?? null,
    windSpeedKmh: current.wind_speed_10m ?? null,
    windDirectionDegrees: current.wind_direction_10m ?? null,
    windDirectionCardinal: toCardinalDirection(current.wind_direction_10m),
    pressureHpa: null,
    uvIndex: current.uv_index ?? null,
    measuredAtLocal: current.time,
  };
}

function mapDailyForecast(daily: ForecastDailyResponse): DailyForecast[] {
  return daily.time.slice(0, FORECAST_DAYS).map((dateLocal, index) => ({
    dateLocal,
    minTemperatureCelsius: daily.temperature_2m_min[index] ?? null,
    maxTemperatureCelsius: daily.temperature_2m_max[index] ?? null,
    condition: toWeatherCondition(daily.weather_code[index] ?? null),
    rainProbabilityPercent: daily.precipitation_probability_max[index] ?? null,
    precipitationMm: daily.precipitation_sum[index] ?? null,
    sunriseLocal: daily.sunrise[index] ?? null,
    sunsetLocal: daily.sunset[index] ?? null,
  }));
}

function buildDisplayName(city: City): string {
  const parts = [city.name, city.region, city.country].filter(Boolean);
  return parts.join(', ');
}

/** Busca clima atual e previsão de 5 dias para a cidade. Lança WeatherServiceError se `current`/`daily` faltarem. */
export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    timezone: city.timezone || 'auto',
    forecast_days: String(FORECAST_DAYS),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset',
    wind_speed_unit: 'kmh',
    temperature_unit: 'celsius',
    precipitation_unit: 'mm',
  });

  const response = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível obter a previsão do tempo. Tente novamente.');
  }

  const data: ForecastResponse = await response.json();

  if (!data.current || !data.daily) {
    throw new WeatherServiceError('Resposta incompleta do serviço de clima.');
  }

  return {
    location: { city, displayName: buildDisplayName(city) },
    current: mapCurrentWeather(data.current),
    daily: mapDailyForecast(data.daily),
    source: 'Open-Meteo',
    fetchedAt: new Date().toISOString(),
    timezone: data.timezone,
  };
}
