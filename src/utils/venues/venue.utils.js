const baseUrl = "https://v2.api.noroff.dev/";

export const fetchVenues = async(limit, page) => {
  const response = await fetch(`${baseUrl}holidaze/venues?limit=${limit}&page=${page}&_bookings=true`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};


export const searchVenues = async(limit, page, q) => {


  const response = await fetch(`${baseUrl}holidaze/venues/search?limit=${limit}&page=${page}&_bookings=true&q=${q}`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};


export const createVenue = async (user, data) => {
  const response = await fetch(`${baseUrl}holidaze/venues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.data.accessToken}`,
      "X-Noroff-API-Key": user.apiKey, 
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });


  return await response.json();
};

export const updateVenue = async (user, data, id) => {
  const response = await fetch(`${baseUrl}holidaze/venues/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${user.data.accessToken}`,
      "X-Noroff-API-Key": user.apiKey, 
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });


  return await response.json();
};


export const deleteVenue = async (user, id) => {
  const response = await fetch(`${baseUrl}holidaze/venues/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${user.data.accessToken}`,
      "X-Noroff-API-Key": user.apiKey, 
      'Content-type': 'application/json'
    }
  });

  console.log(response);

};

export const getVenueById = async(id) => {
  const response = await fetch(`${baseUrl}holidaze/venues/${id}?_bookings=true`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};


export const createBookingInAVenue = async (user, data) => {
  const response = await fetch(`${baseUrl}holidaze/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.data.accessToken}`,
      "X-Noroff-API-Key": user.apiKey, 
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });


  return await response.json();
};



