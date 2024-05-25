import { Fragment, useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import mapPin from '../../assets/images/map-pin.svg';
import styles from './venue.styles.module.scss';
import { FaCoffee, FaParking, FaDog, FaWifi  } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getDates, isSameDate, formatDate } from '../../lib/helpers';
import { createBookingInAVenue } from '../../utils/venues/venue.utils';
import { getUserStorage } from '../../lib/auth';

const VenueComponent = ({data, showEditDelete, showView, setEdit, setDelete, showCalendar, setTrigger, trigger}) => {

    
    const navigate = useNavigate();
    
    const { media, location, name, price, rating, description, maxGuests, meta, id, bookings, _count } = data;
    const [currentBookingDates, setCurrentBookingDates] = useState([]);

    useEffect(() => {
        if(bookings) {
            const betaDates = [];
            bookings.forEach(el => {
                const datesArray = getDates(el.dateFrom, el.dateTo);

                datesArray.forEach((val) => {
                    betaDates.push(val);
                })
            });

            setCurrentBookingDates(betaDates);
        }

    }, [bookings]);




    const checkIfExistsInDates = (dateValue) => {
    
        if(currentBookingDates) {
          const found = currentBookingDates.find(date =>{
          
            return isSameDate(date, dateValue);
          });
          
          if(found) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
        
    };

    const tileDisabled = ({activeStartDate, date, view}) => {
        if(checkIfExistsInDates(date)) {
          return true;
        } else {
    
          return false;
        }
    };

   
    const doView = (id) => {
        navigate(`/venue/${id}`);
    };

    const [value, onChange] = useState(null);
    const [minDate, setMinDate] = useState(new Date(Date.now() + 86400000));
    const [maxDate, setMaxDate] = useState(null);
    const [isRange, setIsRange] = useState(false);

    const setCalendarValue = async(val) => {

        console.log('value is ', val);
        setIsRange(true);
        if(Array.isArray(val)) {

            // if value is array 

            console.log('the value is array');
            
            if(val.length === 1) {
      
              if(currentBookingDates && currentBookingDates.length) {
              
        
                const filteredDates = currentBookingDates.filter(date => date >= val[0]);
              
                const diffInMs = Math.abs(filteredDates[0] - val[0]);
                const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
                if(diffInDays > 1) {
                  const noOfDaysToAdd = diffInDays - 1;
                
                  const copyDate = new Date(val[0]);
                  copyDate.setDate(copyDate.getDate() + noOfDaysToAdd);
                
        
                  setMaxDate(copyDate);
                } else if(diffInDays === 1) {
        
                  
                  setMaxDate(val[0]);
                } else if(diffInDays === 0) {
                  setMaxDate(val[0]);
                }
        
              }
            
              setMinDate(val[0]);
            } else if(val.length === 2) {
              setMinDate(val[0]);
            }
      
        } else {
      
            console.log('THE VALUE IS NOT AN ARRAY');
      
            // if value is not an array 
            if(currentBookingDates && currentBookingDates.length) {
            
              //console.log('there is existing dates');
              const filteredDates = currentBookingDates.filter(date => date >= val);
              
      
              const diffInMs = Math.abs(filteredDates[0] - val);
              const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      
              if(diffInDays > 1) {
                const noOfDaysToAdd = diffInDays - 1;
              
                const copyDate = new Date(val);
                copyDate.setDate(copyDate.getDate() + noOfDaysToAdd);
                
      
                setMaxDate(copyDate);
              } else if(diffInDays === 1) {
    
                setMaxDate(val);
              } else if (diffInDays === 0) {
                setMaxDate(val);
              }
      
            }
      
            setMinDate(val);
           
          }


        onChange(val);



    };

    const [calendarKey, setCalendarKey] = useState(1);
    const clearSelection = () => {
        setIsRange(false);
        onChange(null);
        setMinDate(new Date(Date.now() + 86400000));
        setMaxDate(null);
        setCalendarKey((prevState) => prevState+1);
    };

    const [formData, setFormData] = useState({
        numGuests: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const doCreateBooking = async() => {

        if(!value || formData.numGuests === 0) {
            toast("Seleted Calendar Data and Number of guests are required");
            return;
        }

        if(formData.numGuests > maxGuests) {
            toast(`Guest limit is only ${maxGuests}`);
        }

        const user = getUserStorage();

        const data = {
            "dateFrom": Array.isArray(value) ? value[0] : value,
            "dateTo": Array.isArray(value) ? value[0] : value,
            "guests": parseInt(formData.numGuests),
            "venueId": id
        };


        console.log('data to pass is ', data);

        const create = await createBookingInAVenue(user, data);
        console.log(create);


        toast(`Succesfully create booking`);
        clearSelection();
        setTrigger(!trigger);
        
    
    };

    

    return (
        <div className={styles.venueItem}>
            <div className={styles.venueItemInner}>          
                { media && media.length &&
                    <img
                        src={media[0].url}
                        alt={media[0].alt}
                    />
                }

                <div className={styles.details}>
                    <h6>{name}</h6>
                    <p className={styles.location}>
                        <img src={mapPin} alt="Location pin" /> {location.address} , {location.city} {location.country}                     
                    </p>
                    <p className={styles.description}>
                        {description}
                    </p>

                    { 
                        <ul className={styles.ulList}>
                            {meta.breakfast && (
                                <li>
                                    <FaCoffee />
                                    Breakfast Included
                                </li>
                            )}
                            {meta.parking && (
                                <li>
                                    <FaParking />
                                    Free Parking
                                </li>
                            )}
                            {meta.pets && (
                                <li>
                                    <FaDog/>
                                    Pets Allowed
                                </li>
                            )}
                            {meta.wifi && (
                                <li>
                                    <FaWifi />
                                    Free WiFi
                                </li>
                            )}
                        </ul>
                    }

                
                    <div className={styles.buttonsContainerAction}>
                        {
                            showView &&

                            <Button variant="secondary" onClick={() => doView(id)}>View</Button>
                        }
                        
                        {
                            showEditDelete &&
                            <Fragment>
                                <Button variant="primary" onClick={() => setEdit(data)}>Edit</Button>
                                <Button variant="danger" onClick={() => setDelete(id)}>Delete</Button>
                            </Fragment>
                        }
                        
                    
                    </div>

                </div>

                <div className={styles.extraDetails}>
                
                    <div className={styles.reviewContainer}>
                        <div className={styles.left}>
                            <p className={styles.rateText}>Max Guests: <strong>{maxGuests}</strong></p>
                            <p className={styles.numReviews}>{_count.bookings} Bookings</p>
                        </div>
                        <div className={styles.right}>
                            <span>{rating}</span>
                        </div>
                    </div>

                    <Button className={`mt-3 ${styles.primary}`}>{price} NOK</Button>
                </div>
            </div>  
            
                
            {   showEditDelete &&
                <div className="venueBookings">
                    <h4 className={styles.white}>Venue Bookings</h4>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Customer Email</th>
                                <th>Date From</th>
                                <th>Date To</th>
                                <th>Guests</th>
                            </tr>
                            </thead>
                            <tbody>

                            {   
                                bookings && bookings.map((el, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{el.customer.name}</td>
                                            <td>{el.customer.email}</td>
                                            <td>{formatDate(el.dateFrom)}</td>
                                            <td>{formatDate(el.dateTo)}</td>
                                            <td>{el.guests}</td>
                                        </tr>
                                    )
                                }) 
                               
                            }
                       
                        </tbody>
                    </Table>
                </div>
            }

            { showCalendar &&
                <div className="calendarContainerCustom">

                    <h3 className='mb-3'>Create Booking</h3>
                    <Calendar 
                        onChange={setCalendarValue} 
                        key={calendarKey}
                        showNeighboringMonth={false}
                        value={value} 
                        minDate={minDate}
                        tileDisabled={tileDisabled}
                        locale="en"
                        allowPartialRange={true}
                        selectRange={isRange}
                        maxDate={maxDate}
                        className="customCalendar"
                    />

                    <div className="availabilityContainer">

                        <Fragment>       
                        <p className='yourBookingSign'>
                            <span></span>
                            Your Booking
                        </p>

                        <p className='availableSign'>
                            <span></span>
                            Available
                        </p>

                        <p className='notAvailableSign'>
                            <span></span>
                            Not available
                        </p>
                        </Fragment>  

                    </div>

                    <Form.Group className="mb-3 mt-5" controlId="numGuests">
                        <Form.Label>Number of Guests</Form.Label>
                        <Form.Control type="number" name="numGuests" value={formData.numGuests} onChange={handleChange} />
                    </Form.Group>

                    <div className='pt-5 d-flex justify-content-end align-items-center'>
                        { value && !Array.isArray(value) &&
                            <p className='mb-0 me-3'>{formatDate(value)} - {formatDate(value)}</p>
                        }

                        { value && Array.isArray(value) &&
                            <p className='mb-0 me-3'>{formatDate(value[0])} - {formatDate(value[1])}</p>
                        }

                        { getUserStorage() &&
                        <Fragment>
                            <Button variant='secondary' className='me-3' onClick={() => clearSelection()}>Clear Selection</Button>
                            <Button variant='warning' onClick={() => doCreateBooking()}>Create Booking</Button>
                        </Fragment>
                        }

                        { !getUserStorage() &&
                            <p className='text-danger'>You can create booking if you are registered and authenticated.</p>
                        }
                    
                    
                    </div>
                    
                    <ToastContainer />

                </div>
            }



        </div>
    )
};

export default VenueComponent;