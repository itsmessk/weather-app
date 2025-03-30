# Weather App - Real-time Weather Dashboard

[Weather App Banner](src/assets/images/banner-placeholder.jpg)

A modern, responsive weather application built with Angular that provides real-time weather information from locations around the world. This application leverages the WeatherAPI.com service to deliver accurate and up-to-date weather data with a clean, intuitive user interface.

## Features

- **Weather Dashboard**: View weather data for multiple locations in grid or list format
- **Dynamic UI**: Theme changes based on weather conditions with light/dark mode toggle
- **City Details**: Get detailed weather information for specific locations
- **Weather Forecasts**: View multi-day weather forecasts
- **Favorite Locations**: Save and manage your favorite locations
- **Customizable Settings**: Configure temperature units (C/F/K), refresh intervals, and layout preferences
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Auto-refresh**: Data automatically updates at configurable intervals

## Screenshots

![Dashboard View](src/assets/images/dashboard-screenshot-placeholder.jpg)
![City Details](src/assets/images/city-details-screenshot-placeholder.jpg)
![Settings Page](src/assets/images/settings-screenshot-placeholder.jpg)

## Technologies

- **Frontend**: Angular (latest version)
- **UI Components**: Custom Angular components with responsive design
- **State Management**: Services with RxJS for reactive state management
- **Type Safety**: TypeScript for robust type checking
- **API Integration**: HTTP Client for communication with WeatherAPI.com
- **Styling**: CSS with responsive design principles

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Angular CLI (v12.x or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a file named `environment.ts` in the `src/environments/` directory
   - Add your WeatherAPI.com API key:
     ```typescript
     export const environment = {
       production: false,
       weatherApiKey: 'YOUR_API_KEY'
     };
     ```

4. Start the development server:
   ```bash
   ng serve
   ```

5. Navigate to `http://localhost:4200/` in your browser.

## API Integration

This application uses [WeatherAPI.com](https://www.weatherapi.com/) for weather data. The following API endpoints are utilized:

- Current weather conditions
- Weather forecasts
- Location search
- Historical weather data
- Astronomy data
- Weather alerts
- Sports events weather

## Project Structure

```
src/
├── app/
│   ├── common/             # Common components (menu, footer, etc.)
│   ├── components/         # Feature components (weather dashboard, etc.)
│   ├── guards/             # Route guards for authentication
│   ├── models/             # TypeScript interfaces for data models
│   ├── pages/              # Page components (home, settings, etc.)
│   ├── pipes/              # Custom pipes for data formatting
│   ├── services/           # Services for API communication and state
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
├── assets/                 # Static assets (images, icons, etc.)
├── environments/           # Environment configuration
└── styles/                 # Global styles
```

## Features in Detail

### Weather Dashboard

- View weather information for your favorite locations
- Choose between grid or list layout
- Weather cards change appearance based on conditions
- Quick access to detailed city weather view

### City Weather Details

- Detailed current conditions
- Multi-day forecast
- Hourly forecast data
- Sunrise/sunset times
- Wind, humidity, and other weather metrics

### User Settings

- Temperature unit preference (Celsius, Fahrenheit, Kelvin)
- Dashboard layout preference (Grid or List)
- Auto-refresh interval configuration
- Manage favorite locations

## Future Enhancements

- Weather maps integration
- Push notifications for severe weather alerts
- Historical weather data visualization
- Offline support with PWA capabilities
- More detailed forecast graphs and charts

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.13.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

- Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/)
- Weather icons by [Weather Icons](https://erikflowers.github.io/weather-icons/)
- Bootstrap Icons for UI components
