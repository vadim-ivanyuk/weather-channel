import React from 'react'
import './App.css'
import { weather_api, time_zone_api } from './utils/apies'
import TopBlock from './Components/TopBlock/TopBlock'
import MainWeather from './Components/MainWeather/MainWeather'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudSunRain } from '@fortawesome/free-solid-svg-icons'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      coord: {
        lat: 50.4333,
        lon: 30.5167,
      },
      values: {
        city: 'Kyiv',
        cnt: 1,
      },
      geo_options: {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 10000,
      },
      favouriteLocations: JSON.parse(
        localStorage.getItem('favouriteLocations')
      ),
    }
  }

  componentDidMount() {
    this.getWeatherWithCityName()
    this.getDateWithTimeZoneDB()
    this.getWeatherWithCoord()
  }

  getWeatherWithCoord = () => {
    return fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.coord.lat}&lon=${this.state.coord.lon}&appid=${weather_api}&units=Metric`
    )
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({ weather: data })
      })
  }

  getCityWithCoord = () => {
    const { cnt } = this.state.values
    const { lat, lon } = this.state.coord

    return fetch(
      `https://api.openweathermap.org/data/2.5/forecast?appid=${weather_api}&lang=en&lat=${lat}&lon=${lon}&cnt=${cnt}&units=Metric`
    )
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.cod === '200') {
          this.setState({
            values: {
              ...this.state.values,
              cityName: data.city.name,
              country: data.city.country,
            },
          })
        }
      })
  }

  getWeatherWithCityName = () => {
    const { city, cnt } = this.state.values

    return fetch(
      `https://api.openweathermap.org/data/2.5/forecast?appid=${weather_api}&lang=en&q=${city}&cnt=${cnt}&units=Metric`
    )
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.cod === '200') {
          this.setState({
            coord: { lat: data.city.coord.lat, lon: data.city.coord.lon },
            errorWeather: undefined,
            values: {
              ...this.state.values,
              cityName: data.city.name,
              country: data.city.country,
            },
          })
        } else {
          this.setState({ errorWeather: data })
        }
      })
  }

  getDateWithTimeZoneDB = () => {
    const { lat, lon } = this.state.coord

    return fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=${time_zone_api}&format=json&by=position&lat=${lat}&lng=${lon}`
    )
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({ date: data })
      })
  }

  onChangeValues = (e) => {
    this.setState({
      values: {
        ...this.state.values,
        [e.target.name]: e.target.value,
      },
    })
  }

  searchWithCity = (e) => {
    e.preventDefault()

    this.getWeatherWithCityName()
    setTimeout(() => {
      this.getWeatherWithCoord()
      this.getDateWithTimeZoneDB()
    }, 500)
  }

  searchWithFavouriteLocation = (item, index, e) => {
    this.setState({
      values: {
        ...this.state.values,
        city: item,
      },
    })

    setTimeout(() => {
      this.getWeatherWithCityName()
    }, 500)

    setTimeout(() => {
      this.getWeatherWithCoord()
      this.getDateWithTimeZoneDB()
    }, 1000)
  }

  isLoading = (item) => {
    return item === undefined ? false : true
  }

  geo_success = (position) => {
    this.setState({
      coord: {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      },
    })
  }

  geo_error = () => {
    alert('')
  }

  useMyLocationForWeather = () => {
    navigator.geolocation.getCurrentPosition(
      this.geo_success,
      this.geo_error,
      this.state.geo_options
    )

    setTimeout(() => {
      this.getWeatherWithCoord()
      this.getCityWithCoord()
      this.getDateWithTimeZoneDB()
    }, 500)
  }

  addFavouriteLocation = () => {
    const updateFavouriteLocations = this.state.favouriteLocations
    updateFavouriteLocations.push(this.state.values.cityName)

    localStorage.setItem(
      'favouriteLocations',
      JSON.stringify(updateFavouriteLocations)
    )

    this.setState({
      favouriteLocations: updateFavouriteLocations,
    })
  }

  removeFavouriteLocation = () => {
    this.setState({
      favouriteLocations: this.state.favouriteLocations.filter((item) => {
        return item !== this.state.values.cityName
      }),
    })

    setTimeout(() => {
      localStorage.setItem(
        'favouriteLocations',
        JSON.stringify(this.state.favouriteLocations)
      )
    }, 500)
  }

  render() {
    if (
      !this.isLoading(this.state.weather) ||
      !this.isLoading(this.state.date) ||
      !this.isLoading(this.state.weather)
    ) {
      return (
        <div className="center-block">
          <p className="load-logo">
            Weather{' '}
            <span>
              Channel <FontAwesomeIcon icon={faCloudSunRain} />
            </span>
          </p>
        </div>
      )
    }
    return (
      <>
        <TopBlock
          onChangeValues={this.onChangeValues}
          searchWithCity={this.searchWithCity}
          errorWeather={this.state.errorWeather}
          useMyLocationForWeather={this.useMyLocationForWeather}
          favouriteLocations={this.state.favouriteLocations}
          searchWithFavouriteLocation={this.searchWithFavouriteLocation}
          city={this.state.values.city}
        />
        <MainWeather
          weather={this.state.weather}
          date={this.state.date}
          values={this.state.values}
          favouriteLocations={this.state.favouriteLocations}
          addFavouriteLocation={this.addFavouriteLocation}
          removeFavouriteLocation={this.removeFavouriteLocation}
        />
      </>
    )
  }
}

export default App
