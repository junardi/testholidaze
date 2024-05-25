const baseUrl = "https://v2.api.noroff.dev/";

export const getProfileByName = async(user) => {

    const response = await fetch(`${baseUrl}holidaze/profiles/${user.data.name}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.data.accessToken}`,
            "X-Noroff-API-Key": user.apiKey
        },
    });

    const data = await response.json();
    return data;
};

export const getProfileVenues = async(user) => {

    const response = await fetch(`${baseUrl}holidaze/profiles/${user.data.name}/venues?_bookings=true`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.data.accessToken}`,
            "X-Noroff-API-Key": user.apiKey
        },
    });



    const data = await response.json();
    return data;
};

export const getProfileBookings = async(user) => {

    const response = await fetch(`${baseUrl}holidaze/profiles/${user.data.name}/bookings?_venue=true`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.data.accessToken}`,
            "X-Noroff-API-Key": user.apiKey
        },
    });

      

    const data = await response.json();
    return data;
};


export const updateProfile = async (user, data) => {
    const response = await fetch(`${baseUrl}holidaze/profiles/${user.data.name}`, {
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