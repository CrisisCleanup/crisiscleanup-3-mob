import axios from 'axios';

export default {
  async getMatchingAddressesGoogle(text, sessionToken) {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      {
        params: {
          input: text,
          sessiontoken: sessionToken,
          key: 'AIzaSyBuQPeETkH_q3QE00PeC3g8bHAyVseh7FY',
        },
      },
    );
    return response.data.predictions;
  },

  async getDetails(placeId) {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          key: 'AIzaSyBuQPeETkH_q3QE00PeC3g8bHAyVseh7FY',
        },
      },
    );
    const location = response.data.result;
    const { address_components } = location;
    return {
      address_components: {
        address: `${this.extractFromAddress(
          address_components,
          'street_number',
        )} ${this.extractFromAddress(address_components, 'route')}`,
        city: `${this.extractFromAddress(address_components, 'locality')}`,
        county: `${this.extractFromAddress(
          address_components,
          'administrative_area_level_2',
        )}`,
        state: `${this.extractFromAddress(
          address_components,
          'administrative_area_level_1',
        )}`,
        postal_code: `${this.extractFromAddress(
          address_components,
          'postal_code',
        )}`,
      },
      location: {
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng,
      },
    };
  },

  getLocationDetails({ longitude, latitude }) {
    const latlng = { lat: latitude, lng: longitude };
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const location = results[0];
          const { address_components } = location;
          resolve({
            address_components: {
              address: `${this.extractFromAddress(
                address_components,
                'street_number',
              )} ${this.extractFromAddress(address_components, 'route')}`,
              city: `${this.extractFromAddress(
                address_components,
                'locality',
              )}`,
              county: `${this.extractFromAddress(
                address_components,
                'administrative_area_level_2',
              )}`,
              state: `${this.extractFromAddress(
                address_components,
                'administrative_area_level_1',
              )}`,
              postal_code: `${this.extractFromAddress(
                address_components,
                'postal_code',
              )}`,
            },
            location: {
              lat: location.geometry.location.lat(),
              lng: location.geometry.location.lng(),
            },
          });
        } else {
          reject(`Can't find location: ${status}`);
        }
      });
    });
  },
  /**
   * Get the value for a given key in address_components
   *
   * @param {Array} components address_components returned from Google maps autocomplete
   * @param type key for desired address component
   * @returns {String} value, if found, for given type (key)
   */
  extractFromAddress(components, type) {
    return (
      components
        .filter((component) => component.types.includes(type))
        .map((item) => item.long_name)
        .pop() || null
    );
  },
};
