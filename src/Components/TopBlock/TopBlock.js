import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudSunRain,
  faSearch,
  faMapMarkerAlt,
  faExclamation,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import styled, { keyframes } from 'styled-components'
import { flash, fadeIn } from 'react-animations'

const Flash = styled.div`
  animation: 1s ${keyframes`${flash}`};
`
const FadeIn = styled.div`
  animation: 0.3s ${keyframes`${fadeIn}`};
`

class TopBlock extends React.Component {
  constructor() {
    super()

    this.state = {
      show: false,
    }
  }

  showFavouriteLocations = () => {
    this.setState({
      show: !this.state.show,
    })
  }

  favouriteLocationsHidden = () => {
    this.setState({
      show: false,
    })
  }

  render() {
    const {
      onChangeValues,
      searchWithCity,
      errorWeather,
      useMyLocationForWeather,
      searchWithFavouriteLocation,
      favouriteLocations,
      city,
    } = this.props

    return (
      <div className="top-block">
        <div className="top-logo-block">
          <p className="top-logo">
            Weather{' '}
            <span>
              Channel <FontAwesomeIcon icon={faCloudSunRain} />
            </span>
          </p>
          <div className="top-Favourite-block">
            <FontAwesomeIcon
              className="top-Favourite-block__icon"
              icon={faStar}
              onClick={this.showFavouriteLocations}
            />{' '}
            <span>{favouriteLocations.length}</span>
            {this.state.show && (
              <div className={`favourite-locations`}>
                {favouriteLocations.map((item, index) => (
                  <FadeIn key={item}>
                    <p
                      className="favourite-locations__name"
                      onClick={searchWithFavouriteLocation.bind(this, item)}
                    >
                      {index + 1}. {item}
                    </p>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="top-settings-block" onClick={this.favouriteLocationsHidden}>
          <div className="top-searchCity-block">
            {errorWeather !== undefined && (
              <Flash>
                <p className="error-cityName" title={errorWeather.message}>
                  <FontAwesomeIcon icon={faExclamation} />
                </p>
              </Flash>
            )}
            <form onSubmit={searchWithCity}>
              <input
                onChange={onChangeValues}
                name="city"
                placeholder="Search city"
                className="search-city"
                value={city}
              />
              <label onClick={searchWithCity}>
                <FontAwesomeIcon icon={faSearch} />
              </label>
            </form>
          </div>
          <div
            className="top-useMyLocation-block"
            onClick={useMyLocationForWeather}
          >
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} />{' '}
              <span>Use my location</span>
            </p>
          </div>
          <div className="top-addLocations-block">
            <div>
              {/* <p>
                <FontAwesomeIcon icon={faPlusCircle} />
              </p> */}
            </div>
            <div>
              <p className="top-addLocations-title">Add location</p>
              <p className="top-addLocations-subTitle">
                Did you know you can add favourite locations?
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TopBlock
