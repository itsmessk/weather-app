import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {
  transform(value: number, unit: string = 'C'): string {
    if (value === null || isNaN(value)) {
      return 'N/A';
    }

    if (unit === 'F') {
      // Convert Celsius to Fahrenheit
      const fahrenheit = (value * 9/5) + 32;
      return `${fahrenheit.toFixed(1)}°F`;
    } else if (unit === 'K') {
      // Convert Celsius to Kelvin
      const kelvin = value + 273.15;
      return `${kelvin.toFixed(1)}K`;
    } else {
      // Default to Celsius
      return `${value.toFixed(1)}°C`;
    }
  }
}
