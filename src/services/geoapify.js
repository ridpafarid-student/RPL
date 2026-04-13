const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1';

async function requestGeoapify(url) {
  if (!GEOAPIFY_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function searchPlaces(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery || !GEOAPIFY_API_KEY) {
    return [];
  }

  const params = new URLSearchParams({
    text: trimmedQuery,
    categories: 'tourism.sights,entertainment,leisure',
    filter: 'circle:106.806,-6.595,35000',
    limit: '8',
    apiKey: GEOAPIFY_API_KEY,
  });

  const data = await requestGeoapify(
    `${GEOAPIFY_BASE_URL}/places?${params.toString()}`
  );

  return (
    data?.features?.map((item) => ({
      placeId:
        item.properties.place_id || item.properties.datasource?.raw?.place_id,
      name: item.properties.name || item.properties.formatted || trimmedQuery,
      address: item.properties.formatted || 'Bogor, Jawa Barat',
      lat: item.properties.lat,
      lng: item.properties.lon,
    })) || []
  );
}

export async function getPlaceSuggestions(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery || trimmedQuery.length < 3 || !GEOAPIFY_API_KEY) {
    return [];
  }

  const params = new URLSearchParams({
    text: trimmedQuery,
    limit: '5',
    filter: 'circle:106.806,-6.595,35000',
    format: 'json',
    apiKey: GEOAPIFY_API_KEY,
  });

  const data = await requestGeoapify(
    `${GEOAPIFY_BASE_URL}/geocode/autocomplete?${params.toString()}`
  );

  return (
    data?.results?.map((item) => ({
      placeId:
        item.place_id || item.rank?.confidence_city_level || item.formatted,
      name: item.name || item.address_line1 || item.formatted,
      address: item.formatted || 'Bogor, Jawa Barat',
      lat: item.lat,
      lng: item.lon,
    })) || []
  );
}
