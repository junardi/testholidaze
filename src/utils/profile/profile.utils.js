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

    const response = await fetch(`${baseUrl}holidaze/profiles/${user.data.name}/venues`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${user.data.accessToken}`,
            "X-Noroff-API-Key": user.apiKey
        },
    });

    const data = await response.json();
    return data;
};
