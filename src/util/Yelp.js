const apiKey = "bmaWHnJ-0UZZ5UjxqTTOGYlPQfVBMgIuuBoGFjFsFGQKZEaDGIfgv8hhX7uzUkHYdLI0XAtmOegObydjFzeChgsoSa9aRyXPcbA6-4jQ6dW-5n9qu66gMLbs_-TbYXYx";

const Yelp = {
    search (term, location, sortBy) {
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`, {
        headers: {
            Authorization: `Bearer ${apiKey}` 
          },
    }).then((response) => {
        return response.json();
    }).then((jsonResponse) => {
        if(jsonResponse.businesses) {
            return jsonResponse.businesses.map(((business) => {
                console.log(business);
                return {
                    id: business.id,
                    imageSrc: business.image_url,
                    name: business.name,
                    address: business.location.address1,
                    city: business.location.city,
                    state: business.location.state,
                    zipCode: business.location.zip_Code,
                    category: business.categories[0].title,
                    rating: business.rating,
                    reviewCount: business.review_count,
                };
            }))
        }
    })
    
}};

export default Yelp;