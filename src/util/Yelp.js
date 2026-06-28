// Requests go through the dev proxy at /api/yelp (see src/setupProxy.js),
// which injects the Authorization header and forwards to api.yelp.com.

// Yelp requires a location. When the user leaves "Where?" blank we fall
// back to this so a search still returns results instead of a 400.
const DEFAULT_LOCATION = 'New York, NY';

const Yelp = {
  search(term, location, sortBy) {
    const loc = (location && location.trim()) || DEFAULT_LOCATION;
    return fetch(
      `/api/yelp/v3/businesses/search?term=${encodeURIComponent(term)}&location=${encodeURIComponent(loc)}&sort_by=${sortBy}`
    )
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.businesses) {
          return jsonResponse.businesses.map((business) => ({
            id: business.id,
            imageSrc: business.image_url,
            name: business.name,
            address: business.location.address1,
            city: business.location.city,
            state: business.location.state,
            zipCode: business.location.zip_code,
            category: business.categories[0].title,
            rating: business.rating,
            reviewCount: business.review_count,
          }));
        }
        // No businesses key (e.g. validation error) -> empty list, never undefined.
        return [];
      })
      .catch(() => []); // network/parse failure -> empty list, don't crash the app.
  },
};

export default Yelp;
