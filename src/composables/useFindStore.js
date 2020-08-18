import { reactive, toRefs } from "vue";
import axios from "axios";
import geolib from "geolib";
import haversine from "haversine";

async function getLatLong(location) {
  try {
    const apiKey = import.meta.env.VITE_GEOCODING_KEY;
    const url = "https://maps.googleapis.com/maps/api/geocode/json";

    const {
      data: { results },
    } = await axios.get(url, {
      params: {
        address: location.split(" ").join("+"),
        key: apiKey,
      },
    });
    if (results.length === 0)
      return Promise.reject("Zero results - check address/zip");
    const {
      geometry: {
        location: { lat, lng },
      },
    } = results[0];
    return { lat, lng };
  } catch (error) {
    return Promise.reject("Problem with API. Please try again later");
  }
}

const sortByDistanceFromInputLatLog = (stores, inputLocation) => {
  stores.sort((a, b) => {
    const aTo = {
      latitude: +a.Latitude,
      longitude: +a.Longitude,
    };
    const bTo = {
      latitude: +b.Latitude,
      longitude: +b.Longitude,
    };
    return (
      geolib.getDistance(inputLocation, aTo) -
      geolib.getDistance(inputLocation, bTo)
    );
  });
  const {
    ["Store Name"]: storeName,
    Latitude: latitude,
    Longitude: longitude,
  } = stores[0];
  return {
    storeName,
    closestLocation: { latitude, longitude },
  };
};

const displayResults = (storeName, distance, unit) => {
  return `The closest store is ${storeName}: ${distance} ${unit}(s)`;
};

export default function useFindStore() {
  const obj = reactive({
    result: "",
    error: false,
    loading: false,
  });
  obj.findClosestStore = async (stores, location, unit) => {
    try {
      obj.loading = true;
      obj.error = false;
      const { lat: inputLat, lng: inputLng } = await getLatLong(location);
      const inputLocation = { latitude: inputLat, longitude: inputLng };
      const { storeName, closestLocation } = sortByDistanceFromInputLatLog(
        stores,
        inputLocation
      );
      const distance = haversine(inputLocation, closestLocation, {
        unit,
      }).toFixed(2);
      obj.result = displayResults(storeName, distance, unit);
    } catch (err) {
      obj.result = err;
      obj.error = true;
    } finally {
      obj.loading = false;
    }
  };
  return toRefs(obj);
}
