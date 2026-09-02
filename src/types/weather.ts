/**
 * Contratos internos do domínio de clima.
 * Fonte da verdade: plans/weather-app-plan.md (seção Data Model).
 */

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface CitySuggestion {
  id: number;
  name: string;
  country: string;
  countryCode?: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherLocation {
  city: CitySuggestion;
  displayName: string;
}

export interface WeatherCondition {
  code: number | null;
  label: string;
  iconAlt: string;
}

export interface CurrentWeather {
  temperatureCelsius: number;
  apparentTemperatureCelsius: number;
  condition: WeatherCondition;
  precipitationLast24hMm: number | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  windDirectionDegrees: number | null;
  windDirectionCardinal: string | null;
  pressureHpa: number | null;
  uvIndex: number | null;
  measuredAtLocal: string;
}

export interface DailyForecast {
  dateLocal: string;
  minTemperatureCelsius: number | null;
  maxTemperatureCelsius: number | null;
  condition: WeatherCondition;
  rainProbabilityPercent: number | null;
  precipitationMm: number | null;
  sunriseLocal: string | null;
  sunsetLocal: string | null;
}

export interface WeatherReport {
  location: WeatherLocation;
  current: CurrentWeather;
  daily: DailyForecast[];
  source: 'Open-Meteo';
  fetchedAt: string;
  timezone: string;
}

export interface CachedWeatherReport {
  report: WeatherReport;
  cachedAt: string;
  expiresAt: string;
}

export type WeatherViewStatus =
  | 'idle'
  | 'validating'
  | 'loading-suggestions'
  | 'loading-weather'
  | 'invalid-input'
  | 'empty-results'
  | 'network-error'
  | 'timeout-error'
  | 'rate-limit-error'
  | 'invalid-response-error'
  | 'cached-data';

/** Aliases curtos usados na UI. */
export type Unit = TemperatureUnit;
export type City = CitySuggestion;
export type ForecastDay = DailyForecast;
export type WeatherData = WeatherReport;
