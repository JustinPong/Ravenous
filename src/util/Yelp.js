// Requests go through the dev proxy at /api/yelp (see src/setupProxy.js),
// which injects the Authorization header and forwards to api.yelp.com.
const Yelp = {
  search(term, location, sortBy) {
    return fetch(
      `/api/yelp/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`
    )
      .then((response) => {
        return response.json();
      })
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
      });
  },
};

export default Yelp;
