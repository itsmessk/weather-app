import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weatherIcon'
})
export class WeatherIconPipe implements PipeTransform {
  transform(code: number, isDay: boolean = true): string {
    // Map weather condition codes to Bootstrap icons
    const iconMap: { [key: number]: { day: string, night: string } } = {
      // Clear/Sunny
      1000: { day: 'bi-sun', night: 'bi-moon-stars' },
      
      // Partly cloudy
      1003: { day: 'bi-cloud-sun', night: 'bi-cloud-moon' },
      
      // Cloudy
      1006: { day: 'bi-cloud', night: 'bi-cloud' },
      1009: { day: 'bi-clouds', night: 'bi-clouds' },
      
      // Mist/Fog
      1030: { day: 'bi-cloud-fog', night: 'bi-cloud-fog' },
      1135: { day: 'bi-cloud-fog', night: 'bi-cloud-fog' },
      1147: { day: 'bi-cloud-fog', night: 'bi-cloud-fog' },
      
      // Rain
      1063: { day: 'bi-cloud-drizzle', night: 'bi-cloud-drizzle' },
      1180: { day: 'bi-cloud-drizzle', night: 'bi-cloud-drizzle' },
      1183: { day: 'bi-cloud-rain', night: 'bi-cloud-rain' },
      1186: { day: 'bi-cloud-rain', night: 'bi-cloud-rain' },
      1189: { day: 'bi-cloud-rain', night: 'bi-cloud-rain' },
      1192: { day: 'bi-cloud-rain-heavy', night: 'bi-cloud-rain-heavy' },
      1195: { day: 'bi-cloud-rain-heavy', night: 'bi-cloud-rain-heavy' },
      1240: { day: 'bi-cloud-drizzle', night: 'bi-cloud-drizzle' },
      1243: { day: 'bi-cloud-rain', night: 'bi-cloud-rain' },
      1246: { day: 'bi-cloud-rain-heavy', night: 'bi-cloud-rain-heavy' },
      
      // Snow
      1066: { day: 'bi-cloud-snow', night: 'bi-cloud-snow' },
      1210: { day: 'bi-cloud-snow', night: 'bi-cloud-snow' },
      1213: { day: 'bi-cloud-snow', night: 'bi-cloud-snow' },
      1216: { day: 'bi-cloud-snow', night: 'bi-cloud-snow' },
      1219: { day: 'bi-cloud-snow', night: 'bi-cloud-snow' },
      1222: { day: 'bi-cloud-snow', night: 'bi-cloud-snow' },
      1225: { day: 'bi-cloud-snow', night: 'bi-cloud-snow' },
      1255: { day: 'bi-cloud-snow', night: 'bi-cloud-snow' },
      1258: { day: 'bi-cloud-snow', night: 'bi-cloud-snow' },
      
      // Thunderstorm
      1087: { day: 'bi-cloud-lightning', night: 'bi-cloud-lightning' },
      1273: { day: 'bi-cloud-lightning-rain', night: 'bi-cloud-lightning-rain' },
      1276: { day: 'bi-cloud-lightning-rain', night: 'bi-cloud-lightning-rain' },
      1279: { day: 'bi-cloud-lightning-rain', night: 'bi-cloud-lightning-rain' },
      1282: { day: 'bi-cloud-lightning-rain', night: 'bi-cloud-lightning-rain' },
    };
    
    // Default icon if code not found
    const defaultIcon = { day: 'bi-cloud', night: 'bi-cloud' };
    
    // Get the icon based on weather code and time of day
    const icon = iconMap[code] || defaultIcon;
    return isDay ? icon.day : icon.night;
  }
}
