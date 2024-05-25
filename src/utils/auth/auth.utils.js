const baseUrl = "https://v2.api.noroff.dev/";

export const registerUser = async (data) => {

    const response = await fetch(`${baseUrl}auth/register` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();
};


export const loginUser = async (data) => {

    const response = await fetch(`${baseUrl}auth/login` , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();
};

export const createAPiKey = async (token) => {

    const response = await fetch(`${baseUrl}auth/create-api-key` , {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await response.json();
};