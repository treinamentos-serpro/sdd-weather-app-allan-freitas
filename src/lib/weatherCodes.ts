import type { WeatherCondition } from '../types/weather';

interface WeatherCodeInfo {
  label: string;
  iconAlt: string;
  icon: string;
}

/** Códigos WMO usados pela Open-Meteo. */
const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { label: 'Céu limpo', iconAlt: 'Sol sem nuvens', icon: '☀️' },
  1: { label: 'Predominantemente limpo', iconAlt: 'Sol com poucas nuvens', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', iconAlt: 'Sol entre nuvens', icon: '⛅' },
  3: { label: 'Nublado', iconAlt: 'Céu encoberto por nuvens', icon: '☁️' },
  45: { label: 'Nevoeiro', iconAlt: 'Neblina', icon: '🌫️' },
  48: { label: 'Nevoeiro com geada', iconAlt: 'Neblina congelante', icon: '🌫️' },
  51: { label: 'Garoa fraca', iconAlt: 'Nuvem com garoa', icon: '🌦️' },
  53: { label: 'Garoa moderada', iconAlt: 'Nuvem com garoa', icon: '🌦️' },
  55: { label: 'Garoa intensa', iconAlt: 'Nuvem com garoa', icon: '🌦️' },
  56: { label: 'Garoa congelante fraca', iconAlt: 'Nuvem com garoa congelante', icon: '🌧️' },
  57: { label: 'Garoa congelante intensa', iconAlt: 'Nuvem com garoa congelante', icon: '🌧️' },
  61: { label: 'Chuva fraca', iconAlt: 'Nuvem com gotas de chuva', icon: '🌧️' },
  63: { label: 'Chuva moderada', iconAlt: 'Nuvem com chuva', icon: '🌧️' },
  65: { label: 'Chuva forte', iconAlt: 'Nuvem com chuva forte', icon: '🌧️' },
  66: { label: 'Chuva congelante fraca', iconAlt: 'Nuvem com chuva congelante', icon: '🌧️' },
  67: { label: 'Chuva congelante forte', iconAlt: 'Nuvem com chuva congelante', icon: '🌧️' },
  71: { label: 'Neve fraca', iconAlt: 'Nuvem com neve', icon: '🌨️' },
  73: { label: 'Neve moderada', iconAlt: 'Nuvem com neve', icon: '🌨️' },
  75: { label: 'Neve forte', iconAlt: 'Nuvem com neve intensa', icon: '❄️' },
  77: { label: 'Grãos de neve', iconAlt: 'Partículas de neve', icon: '❄️' },
  80: { label: 'Pancadas de chuva fracas', iconAlt: 'Nuvem com pancada de chuva', icon: '🌦️' },
  81: { label: 'Pancadas de chuva moderadas', iconAlt: 'Nuvem com pancada de chuva', icon: '🌧️' },
  82: { label: 'Pancadas de chuva fortes', iconAlt: 'Nuvem com pancada de chuva forte', icon: '⛈️' },
  85: { label: 'Pancadas de neve fracas', iconAlt: 'Nuvem com pancada de neve', icon: '🌨️' },
  86: { label: 'Pancadas de neve fortes', iconAlt: 'Nuvem com pancada de neve intensa', icon: '🌨️' },
  95: { label: 'Tempestade com trovoadas', iconAlt: 'Nuvem com raio', icon: '⛈️' },
  96: { label: 'Tempestade com granizo fraco', iconAlt: 'Nuvem com raio e granizo', icon: '⛈️' },
  99: { label: 'Tempestade com granizo forte', iconAlt: 'Nuvem com raio e granizo', icon: '⛈️' },
};

const UNKNOWN_CONDITION: WeatherCodeInfo = {
  label: 'Condição indisponível',
  iconAlt: 'Condição climática desconhecida',
  icon: '❓',
};

export function getWeatherCodeInfo(code: number | null): WeatherCodeInfo {
  if (code === null) {
    return UNKNOWN_CONDITION;
  }
  return WEATHER_CODES[code] ?? UNKNOWN_CONDITION;
}

export function toWeatherCondition(code: number | null): WeatherCondition {
  const info = getWeatherCodeInfo(code);
  return { code, label: info.label, iconAlt: info.iconAlt };
}

export function getWeatherIcon(code: number | null): string {
  return getWeatherCodeInfo(code).icon;
}
