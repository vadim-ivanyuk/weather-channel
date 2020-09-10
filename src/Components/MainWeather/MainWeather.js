import React from 'react'
import days from '../../data/days'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSun,
  faMoon,
  faUmbrella,
  faWind,
  faThermometerQuarter,
  faTachometerAlt,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons'
import Swiper from 'react-id-swiper'
import classNames from 'classnames/bind'

class MainWeather extends React.Component {
  constructor() {
    super()

    this.state = {
      paramsSliderForWeatherToday: {
        slidesPerView: 7,
        rebuildOnUpdate: true,
      },
      paramsSliderForWeatherOtherDays: {
        slidesPerView: 5,
        rebuildOnUpdate: true,
      },
    }
  }

  convertToUtcTimeString = (item) => {
    const date = new Date(item * 1000)

    return date.toUTCString()
  }

  getTodayDay = () => {
    const { formatted } = this.props.date

    return new Date(
      formatted.substr(0, 4),
      formatted.substr(6, 1) - 1,
      formatted.substr(8, 2)
    ).getDay()
  }

  getWeatherForaSpecificDay = (weatherData, day) => {
    const { timezone_offset } = this.props.weather

    return weatherData.filter((item) => {
      return (
        this.convertToUtcTimeString(item.dt + timezone_offset).substr(5, 2) ===
        day
      )
    })
  }

  getOtherDays = () => {
    const beforeToday = days.filter((item) => item.id < this.getTodayDay())

    const afterToday = days.filter((item) => item.id > this.getTodayDay())

    const resultOtherDays = [...afterToday, ...beforeToday]

    return resultOtherDays
  }

  getVideoForFon = () => {
    const { hourly } = this.props.weather

    console.log(hourly[0].weather[0].icon)
    return (
      <video
        className="weather-video-fon"
        src={`weather-fon/${
          hourly[0].weather[0].icon === '01n'
            ? 'Clear-night'
            : hourly[0].weather[0].main
        }.mp4`}
        autoPlay={true}
        loop={true}
      ></video>
    )
  }

  getWeatherForOtherDays = () => {
    const { daily } = this.props.weather

    return daily.filter((item, index) => index !== 0)
  }

  getClassNameForFavouriteLocations = () => {
    const { favouriteLocations } = this.props
    const { cityName } = this.props.values
    let activeOrPassive = 'passive'

    if (favouriteLocations === null) {
      return favouriteLocations
    }

    if (favouriteLocations.length > 0) {
      favouriteLocations.map((item) => {
        if (item === cityName) {
          activeOrPassive = 'active'
        }
      })
    }

    return classNames(`favouriteLocations-block ${activeOrPassive}`)
  }

  addOrRemoveCityOnFavoutireLocations = () => {
    const {
      favouriteLocations,
      addFavouriteLocation,
      removeFavouriteLocation,
    } = this.props
    const { cityName } = this.props.values
    let proverka = false

    if (favouriteLocations === null) {
      return favouriteLocations
    }

    if (favouriteLocations.length > 0) {
      favouriteLocations.map((item) => {
        if (item === cityName) {
          proverka = true
        }
      })
      if (!proverka) {
        addFavouriteLocation()
      } else {
        removeFavouriteLocation()
      }
    } else {
      addFavouriteLocation()
    }
  }

  render() {
    const { hourly, timezone_offset } = this.props.weather
    const { dt, sunrise, sunset } = this.props.weather.current
    const { cityName, country } = this.props.values

    return (
      <div className="main-weather-block">
        {this.getVideoForFon()}
        <div className="shadow-block">
          <div className="weather-today">
            <span
              className={this.getClassNameForFavouriteLocations()}
              onClick={this.addOrRemoveCityOnFavoutireLocations}
            >
              <FontAwesomeIcon icon={faBookmark} />
            </span>
            <div className="weather-today-topBlock">
              <div>
                <p className="weather-today-city">
                  {cityName}, {country}
                </p>
                <p className="weather-today-time">
                  {this.convertToUtcTimeString(dt + timezone_offset).substr(
                    17,
                    5
                  )}
                </p>
              </div>
              <div>
                <p className="weather-today-day">
                  {days[this.getTodayDay()].fullName}
                </p>
                <p className="weather-today-dayOnMonthAndMonth">
                  {this.convertToUtcTimeString(dt + timezone_offset).substr(
                    5,
                    6
                  )}
                </p>
                <div className="weather-today-sunRiseAndSet">
                  <p className="sunrise">
                    <FontAwesomeIcon icon={faSun} />{' '}
                    {this.convertToUtcTimeString(
                      sunrise + timezone_offset
                    ).substr(17, 5)}
                  </p>
                  <p className="sunset">
                    <FontAwesomeIcon icon={faMoon} />{' '}
                    {this.convertToUtcTimeString(
                      sunset + timezone_offset
                    ).substr(17, 5)}
                  </p>
                </div>
              </div>
            </div>
            <div className="weather-today-bottomBlock">
              <p className="weather-today-desc">
                {hourly[0].weather[0].main},{' '}
                <span>{hourly[0].weather[0].description}</span>
              </p>
              <div className="weather-today-items">
                <div className="weather-today-prompt">
                  <p title="Probability of precipitation, %">
                    <FontAwesomeIcon icon={faUmbrella} />
                  </p>
                  <p title="Wind speed, meter/sec">
                    <FontAwesomeIcon icon={faWind} />
                  </p>
                  <p title="Humidity, %">
                    <FontAwesomeIcon icon={faThermometerQuarter} />
                  </p>
                  <p title="Atmospheric pressure, hPa">
                    <FontAwesomeIcon icon={faTachometerAlt} />
                  </p>
                </div>
                <div className="weather-today-list">
                  <Swiper {...this.state.paramsSliderForWeatherToday}>
                    {this.getWeatherForaSpecificDay(
                      hourly,
                      this.convertToUtcTimeString(dt + timezone_offset).substr(
                        5,
                        2
                      )
                    ).map((item) => {
                      return (
                        <div
                          className="weather-today-item"
                          key={item.dt + timezone_offset}
                        >
                          <p>
                            {this.convertToUtcTimeString(
                              item.dt + timezone_offset
                            ).substr(17, 5)}
                          </p>
                          <img
                            className="weather-today-img"
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                            alt={item.weather[0].description}
                          />
                          <p className="weather-today-temp">
                            {Math.floor(item.temp)} °
                          </p>
                          <p className="weather-today-pop">{item.pop}%</p>
                          <p className="weather-today-wind">
                            {item.wind_speed.toFixed(1)} m/s
                          </p>
                          <p className="weather-today-humidity">
                            {item.humidity}%
                          </p>
                          <p className="weather-today-wind">
                            {item.pressure} hPa
                          </p>
                        </div>
                      )
                    })}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
          <div className="weather-otherDays">
            <div className="weather-otherDays-prompt">
              <p title="Probability of precipitation, %">
                <FontAwesomeIcon icon={faUmbrella} />
              </p>
              <p title="Wind speed, meter/sec">
                <FontAwesomeIcon icon={faWind} />
              </p>
              <p title="Humidity, %">
                <FontAwesomeIcon icon={faThermometerQuarter} />
              </p>
              <p title="Atmospheric pressure, hPa">
                <FontAwesomeIcon icon={faTachometerAlt} />
              </p>
            </div>
            <Swiper {...this.state.paramsSliderForWeatherOtherDays}>
              {this.getWeatherForOtherDays().map((item) => {
                return (
                  <div key={item.dt} className="weather-otherDays-item">
                    <p className="weather-otherDays-title">
                      {this.convertToUtcTimeString(item.dt).substr(0, 3)}
                      <br />
                      <span>
                        {this.convertToUtcTimeString(item.dt).substr(5, 6)}
                      </span>
                    </p>
                    <p className="weather-otherDays-desc">
                      {item.weather[0].main}
                    </p>
                    <img
                      className="weather-otherDays-img"
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                    />
                    <p className="weather-otherDays-max-minTemp">
                      {Math.floor(item.temp.max)}° / {Math.floor(item.temp.min)}
                      °
                    </p>
                    <p className="weather-otherDays-realFellTemp">Real Feel</p>
                    <p className="weather-otherDays-feelsLikeDayTemp">
                      {Math.floor(item.feels_like.day)} °
                    </p>
                    <p className="weather-otherDays-pop weather-otherDays-promptBlocks">
                      {item.pop}%
                    </p>
                    <p className="weather-otherDays-promptBlocks">
                      {item.wind_speed.toFixed(1)} m/s
                    </p>
                    <p className="weather-otherDays-promptBlocks">
                      {item.humidity}%
                    </p>
                    <p className="weather-otherDays-promptBlocks border-bottom">
                      {item.pressure} hPa
                    </p>
                  </div>
                )
              })}
            </Swiper>
          </div>
        </div>
      </div>
    )
  }
}

export default MainWeather
