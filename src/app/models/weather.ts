// Weather API response models

// Location model
export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

// Weather Location (simplified location for UI)
export interface WeatherLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

// Current weather condition model
export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

// Current weather model
export interface CurrentWeather {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
  air_quality?: AirQuality;
}

// Air quality model
export interface AirQuality {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  us_epa_index: number;
  gb_defra_index: number;
}

// Day forecast model
export interface DayForecast {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: WeatherCondition;
  uv: number;
}

// Hour forecast model
export interface HourForecast {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

// Forecast day model
export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayForecast;
  astro: Astronomy;
  hour: HourForecast[];
}

// Forecast model
export interface Forecast {
  forecastday: ForecastDay[];
}

// Astronomy model
export interface Astronomy {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: string;
  is_moon_up: number;
  is_sun_up: number;
}

// Alert model
export interface Alert {
  headline: string;
  msgtype: string;
  severity: string;
  urgency: string;
  areas: string;
  category: string;
  certainty: string;
  event: string;
  note: string;
  effective: string;
  expires: string;
  desc: string;
  instruction: string;
}

// Sports model
export interface Sports {
  football: FootballMatch[];
  cricket: CricketMatch[];
  golf: GolfEvent[];
}

export interface FootballMatch {
  stadium: string;
  country: string;
  region: string;
  tournament: string;
  start: string;
  match: string;
}

export interface CricketMatch {
  stadium: string;
  country: string;
  region: string;
  tournament: string;
  start: string;
  match: string;
}

export interface GolfEvent {
  stadium: string;
  country: string;
  region: string;
  tournament: string;
  start: string;
  match: string;
}

// Main weather response models
export interface CurrentWeatherResponse {
  location: Location;
  current: CurrentWeather;
}

export interface ForecastResponse {
  location: Location;
  current: CurrentWeather;
  forecast: Forecast;
}

export interface AstronomyResponse {
  location: Location;
  astronomy: {
    astro: Astronomy;
  };
}

export interface AlertsResponse {
  location: Location;
  alerts: {
    alert: Alert[];
  };
}

export interface SportsResponse {
  location?: Location;
  football?: FootballMatch[];
  cricket?: CricketMatch[];
  golf?: GolfEvent[];
}

export interface HistoricalResponse {
  location: Location;
  forecast: Forecast;
}
