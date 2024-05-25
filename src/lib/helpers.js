export const isValidEmail = (email) => {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const isValidUrl = (str) => {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
};


export const combineErrors = (errors) => {
    const errorsArray = [];

    errors.forEach((el, index) => {
        errorsArray.push(el.message)
    });

    return errorsArray.join(', ');
};

export const getDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    let currentEndDate = new Date(endDate);
  
    while (currentDate <= currentEndDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    //console.log('dates', dates);
    return dates;
}

export const isSameDate = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}


export const formatDate = (date) => {
    if(date) {
        const setDate = new Date(date);
        const dayOfMonth = setDate.getDate();
        const fullMonthName = setDate.toLocaleString('default', { month: 'long' });
        const year = setDate.getFullYear();
        return fullMonthName + ' ' + dayOfMonth + ", " + year;
    } else {
        return "";
    }
}; 


export const isDateGreaterOrEqual = (givenDateStr) =>  {
    
    let givenDate = new Date(givenDateStr);
    let currentDate = new Date();

    // Set the time part to 00:00:00 to only compare dates
    givenDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (givenDate >= currentDate) {
        return true;
    } else {
        return false;
    }
}