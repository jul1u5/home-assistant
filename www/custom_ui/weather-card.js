import {
  LitElement,
  html,
} from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';

const transformDayNight = {
  below_horizon: 'night',
  above_horizon: 'day',
};

const windDirections = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
  'N',
];

class WeatherCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  update(_) {
    this.weatherIcons = {
      'clear-day': 'day',
      'clear-night': 'night',
      rain: 'rainy-5',
      snow: 'snowy-6',
      sleet: 'rainy-6',
      wind: 'cloudy',
      fog: 'cloudy',
      cloudy: 'cloudy',
      'partly-cloudy-day': 'cloudy-day-3',
      'partly-cloudy-night': 'cloudy-night-3',
      hail: 'rainy-7',
      lightning: 'thunder',
      thunderstorm: 'thunder',
      'windy-variant': `cloudy-${transformDayNight[this.state(this.config.entity_sun)]}-3`,
      exceptional: '!!',
    };

    this.currentConditions = this.state(this.config.entity_current_conditions);
    this.humidity = this.state(this.config.entity_humidity);
    this.pressure = Math.round(this.state(this.config.entity_pressure));
    this.temperature = Math.round(this.state(this.config.entity_temperature));
    this.visibility = this.state(this.config.entity_visibility);
    this.windBearing = windDirections[Math.round((this.state(this.config.entity_wind_bearing) / 360) * 16)];
    this.windSpeed = Math.round(this.state(this.config.entity_wind_speed));

    super.update();
  }

  state(entity) {
    return this.hass.states[entity].state;
  }

  getUnit(measure) {
    const lengthUnit = this.hass.config.unit_system.length;
    switch (measure) {
      case 'air_pressure':
        return lengthUnit === 'km' ? 'hPa' : 'inHg';
      case 'length':
        return lengthUnit;
      case 'precipitation':
        return lengthUnit === 'km' ? 'mm' : 'in';
      default:
        return this.hass.config.unit_system[measure] || '';
    }
  }

  render() {
    return html`
      <ha-card>
        ${this.style()}
        <div class="card">
          <span class="icon bigger" style="background-image: url(/local/icons/weather_icons/animated/${this.weatherIcons[this.currentConditions]}.svg)"></span>
          <span class="temp">${this.temperature}</span>
          <span class="tempc"> ${this.getUnit('temperature')}</span>
          <span>
            <ul class="variations right">
              <li>
                <ha-icon icon="mdi:water-percent"></ha-icon>
                ${this.humidity} <span class="unit"> %</span>
              </li>
              <li>
                <ha-icon icon="mdi:gauge"></ha-icon>
                ${this.pressure}
                <span class="unit"> ${this.getUnit('air_pressure')}</span>
              </li>
            </ul>
            <ul class="variations">
              <li>
                <ha-icon icon="mdi:weather-windy"></ha-icon>
                ${this.windBearing} ${this.windSpeed}
                <span class="unit"> ${this.getUnit('length')}/h</span>
              </li>
              <li>
                <ha-icon icon="mdi:weather-fog"></ha-icon>
                ${this.visibility}
                <span class="unit"> ${this.getUnit('length')}</span>
              </li>
            </ul>
          </span>
          <div class="forecast clear">${this.forecast()}</div>
          <br>
          <span class="unit">
            ${this.state(this.config.entity_daily_summary)}
          </span>
          <br>
        </div>
      </ha-card>
    `;
  }

  forecast() {
    const today = new Date();
    const forecast = Array(5).fill()
      .map((_, i) => i + 1)
      .map(day => {
        const date = new Date();
        date.setDate(today.getDate() + day);

        return {
          date: date.toString().split(' ')[0],
          icon: this.weatherIcons[this.state(this.config[`entity_forecast_icon_${day}`])],
          tempHigh: Math.round(this.state(this.config[`entity_forecast_high_temp_${day}`])),
          tempLow: Math.round(this.state(this.config[`entity_forecast_low_temp_${day}`])),
        };
      });

    return forecast.map(daily => html`
      <div class="day">
        <span class="day-name">${daily.date}</span>
        <i class="icon" style="background-image: url(/local/icons/weather_icons/animated/${daily.icon}.svg)"></i>
        <span class="high-temp">
          ${daily.tempHigh} ${this.getUnit('temperature')}
        </span>
        <span class="low-temp">
          ${daily.tempLow} ${this.getUnit('temperature')}
        </span>
      </div>
    `);
  }

  style() {
    return html`
      <style>
        .card {
          margin: auto;
          padding-top: 2em;
          padding-bottom: 1em;
          padding-left: 1em;
          padding-right: 1em;
          position: relative;
        }

        .icon.bigger {
          width: 10em;
          height: 10em;
          margin-top: -4em;
          position: absolute;
          left: 0em;
          background-size: contain;
        }

        .icon {
          height: 50px;
          background-position: center center;
          background-repeat: no-repeat;
        }

        ha-icon {
          height: 18px;
          margin-right: 5px;
          color: var(--paper-item-icon-color);
        }

        .temp {
          font-weight: 300;
          font-size: 4em;
          color: var(--primary-text-color);
          position: absolute;
          right: 1em;
        }

        .tempc {
          font-weight: 300;
          font-size: 1.5em;
          color: var(--primary-text-color);
          position: absolute;
          right: 1em;
          margin-top: -14px;
          margin-right: 7px;
        }

        .variations {
          font-weight: 300;
          color: var(--primary-text-color);
          list-style: none;
          margin-left: -2em;
          margin-top: 4.5em;
        }

        .variations.right {
          position: absolute;
          right: 1em;
          margin-left: 0;
          margin-right: 1em;
        }

        .unit {
          font-size: 0.8em;
        }

        .forecast {
          height: 9em;
          display: flex;
        }

        .forecast > .day:not(:last-child) {
          border-right: 0.1em solid #d9d9d9;
        }

        .day {
          width: 20%;
          text-align: center;
          color: var(--primary-text-color);
          line-height: 2;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .day-name {
          text-transform: uppercase;
        }

        .high-temp {
          font-weight: bold;
        }

        .low-temp {
          color: var(--secondary-text-color);
        }
      </style>
    `;
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('weather-card', WeatherCard);
