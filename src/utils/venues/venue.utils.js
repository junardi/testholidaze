const baseUrl = "https://v2.api.noroff.dev/";

export const fetchVenues = async () => {
  const response = await fetch(`${baseUrl}holidaze/venues`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

