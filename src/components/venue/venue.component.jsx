import { Fragment, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import mapPin from '../../assets/images/map-pin.svg';
import styles from './venue.styles.module.scss';
import { FaCoffee, FaParking, FaDog, FaWifi  } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';

const VenueComponent = ({data, showEditDelete, showView, setEdit, setDelete}) => {

    const navigate = useNavigate();
    
    const { media, location, name, price, rating, description, maxGuests, meta, id } = data;
   
    const doView = (id) => {
        navigate(`/venue/${id}`);
    };


    return (
        <div className={styles.venueItem}>
                      
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
                        <p className={styles.numReviews}>{rating} Rating</p>
                    </div>
                    <div className={styles.right}>
                        <span>8.0</span>
                    </div>
                </div>

                <Button className={`mt-3 ${styles.primary}`}>{price} NOK</Button>
            </div>
        </div>
    )
};

export default VenueComponent;