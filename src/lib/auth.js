export const isAuthenticated = () => {
    let retrievedObject = localStorage.getItem('user');
    
    if(JSON.parse(retrievedObject) && JSON.parse(retrievedObject).data.accessToken) {
        return true;
    } else {
        return false;
    }
    
};


export const getUserStorage = () => {
    let retrievedObject = localStorage.getItem('user');
    if(JSON.parse(retrievedObject) && JSON.parse(retrievedObject).data.accessToken) {
        return JSON.parse(retrievedObject);
    } else {
        return null;
    }   
};



