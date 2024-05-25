import { useState, useEffect, Fragment} from "react";
import { Container, Row, Col, Button, Modal, Form, Table } from "react-bootstrap";
import styles from './user-profile.styles.module.scss';
import { getUserStorage } from "../../lib/auth";
import { getProfileByName, getProfileVenues, getProfileBookings, updateProfile } from "../../utils/profile/profile.utils";
import { createVenue, updateVenue, deleteVenue } from "../../utils/venues/venue.utils";
import PaginationComponent from "../../components/pagination/pagination.component";
import VenueComponent from "../../components/venue/venue.component";
import { formatDate, isDateGreaterOrEqual } from "../../lib/helpers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt} from "react-icons/fa";

const UserProfile = () => {

    const [trigger, setTrigger] = useState(false);
    const [userData, setUserData] = useState(null);
    
    // below for venues 
    // const [currentPage, setCurrentPage] = useState(1);
    // const [currentLimit] = useState(10);


    const [paginationMeta, setPaginationMeta] = useState(null);
    const [listOfVenues, setListOfVenues] = useState([]);
    const [upcomingBookings, setUpcomingBookings] = useState([]);


    // below for profile data to update 

    const [profileData, setProfileData] = useState({
        avatarUrl: '',
        avatarAlt: '',
        bannerUrl: '', 
        bannerAlt: '',
        venueManager: false,
        bio: ''
    });

    const handleChangeProfileData = (e) => {
        const { name, value, type } = e.target;
        if(type === 'checkbox') {
            setProfileData({ ...profileData, [name]: !profileData.venueManager });
        } else {
            setProfileData({ ...profileData, [name]: value });
        }
    };

    const [isShowProfileEdit, setIsShowProfileEdit] = useState(false);
    const handleCloseProfile = () => {
        setIsShowProfileEdit(false);
    }
    const handleShowProfile = () => setIsShowProfileEdit(true);


    useEffect(() => {
        const user = getUserStorage();
        const getUserProfileAndVenuesAndBookings = async() => {
            
            const userProfile = await getProfileByName(user);
            setUserData(userProfile.data);

            //console.log('user profile data ', userProfile.data);

            const profileDataObj = {
                avatarUrl: userProfile.data.avatar.url,
                avatarAlt: userProfile.data.avatar.alt,
                bannerUrl: userProfile.data.banner.url, 
                bannerAlt: userProfile.data.banner.alt,
                venueManager: userProfile.data.venueManager,
                bio: userProfile.data.bio
            };

            setProfileData(profileDataObj);
           

            const userVenues = await getProfileVenues(user);
            setListOfVenues(userVenues.data);
            
            const data = {
                currentPage: userVenues.meta.currentPage,
                isFirstPage: userVenues.meta.isFirstPage,
                isLastPage: userVenues.meta.isLastPage,
                nextPage: userVenues.meta.nextPage,
                pageCount: userVenues.meta.pageCount,
                previousPage: userVenues.meta.previousPage,
                totalCount: userVenues.meta.totalCount
            };
            setPaginationMeta(data);

            const userBookings = await getProfileBookings(user);
            const userBookingsData = userBookings.data;
            // eslint-disable-next-line
            const filtered = userBookingsData.filter((el, index) => {
                if(isDateGreaterOrEqual(el.dateFrom)) {
                    return el;
                }   
            });

           
            setUpcomingBookings(filtered);
        };

        getUserProfileAndVenuesAndBookings();

    }, [trigger]);

    const handlePageChange = (pageNumber) => {
  
        //setCurrentPage(pageNumber);
        setPaginationMeta((prevMeta) => ({
            ...prevMeta,
            currentPage: pageNumber,
            isFirstPage: pageNumber === 1,
            isLastPage: pageNumber === prevMeta.pageCount,
            nextPage: pageNumber < prevMeta.pageCount ? pageNumber + 1 : prevMeta.pageCount,
            previousPage: pageNumber > 1 ? pageNumber - 1 : 1,
        }));
    };



    const [isShow, setIsShow] = useState(false);

    const handleClose = () => {
        setIsShow(false);
        setIdToEdit(null);
    }
    const handleShow = () => setIsShow(true);


    const [formData, setFormData] = useState({
        name: '',
        description: '',
        media: [{ url: '', alt: '' }],
        price: 10000,
        maxGuests: 100,
        rating: 5,
        meta: {
            wifi: true,
            parking: true,
            breakfast: true,
            pets: true,
        },
        location: {
            address: '',
            city: '',
            zip: '',
            country: '',
            continent: '',
            lat: 90,
            lng: 180,
        },
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        const user = getUserStorage();
        //console.log(formData);

        const dataToPass = {
            "name": formData.name,
            "description": formData.description,
            "media": formData.media,
            "price": parseInt(formData.price),
            "maxGuests": parseInt(formData.maxGuests),
            "rating": parseInt(formData.rating),
            "meta": formData.meta,
            "location": formData.location
        };

        if(idToEdit) {
            await updateVenue(user, dataToPass, idToEdit);
            toast('Updated');
        } else {
            await createVenue(user, dataToPass);
            toast('Created');
        }

        setTrigger(!trigger);
        handleClose();
    };


    const [idToEdit, setIdToEdit] = useState(null);
    const setEdit = (data) => {
        const { id, created, updated, _count, ...dataNoId } = data;

        console.log(dataNoId);
        setIdToEdit(id);
        setFormData(data);
        setIsShow(true);
    };
    

    const setDelete = async(id) => {

        console.log('llets set delete ', id);

        const user = getUserStorage();

        console.log('user is ', user);
        try {
            await deleteVenue(user, id);
            setTrigger(!trigger);
            toast('Deleted');
        } catch(error) {
            console.log('there is error');
        }
      
    };


    //console.log('profile data is ', profileData);

    const handleUpdate = async(evt) => {
        evt.preventDefault();
        const user = getUserStorage();
        const data = {
            "avatar": {
              "url": profileData.avatarUrl,
              "alt": profileData.avatarAlt
            },
            "banner": {
              "url": profileData.bannerUrl,
              "alt": profileData.bannerAlt
            },
            "venueManager": profileData.venueManager,
            "bio": profileData.bio
        };

        await updateProfile(user, data);
        setTrigger(!trigger);
        toast('Updated Profile');
        handleCloseProfile();
    };  

    return (
        <Fragment>
            <div className="mainPageNew"> 
                { userData &&
                    <div className="mainPage" style={{backgroundImage: `url(${userData.banner.url})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh'}}>
                                        
                        <div className="container mt-5">
                            
                            <div className="row">
                                <div className="col-md-6 mx-auto">
                                    <div className="text-center">
                                        <img src={userData.avatar.url} alt={userData.avatar.banner} className={styles.avatar} />
                                        <p className={styles.whiteEdit} onClick={() => handleShowProfile()}><FaPencilAlt></FaPencilAlt> Edit</p>
                                        <h2 className={styles.white}>Name: {userData.name}</h2>
                                        <p className={`${styles.white} mb-1`}>Email: {userData.email}</p>
                                        <p className={styles.white}>Bio: {userData.bio}</p>

                                        <h3 className={styles.white}>Bookings: {userData._count.bookings}</h3>
                                        <h3 className={styles.whiteEdit}>Venues: {userData._count.venues}</h3>

                                        { userData.venueManager &&
                                            <Button className="mt-3" variant="primary" onClick={handleShow}>Add Venue</Button>
                                        }

                                    </div>
                                </div>
                            </div>


                        </div>


                        <Container>
                            <Row>
                                <Col>
                                    <h2 className={`${styles.white} mt-3 mb-3`}>Upcoming Bookings</h2>
                                    <Table responsive>
                                        <thead>
                                        <tr>
                                           
                                            <th>Date From</th>
                                            <th>Date To</th>
                                            <th>Venue</th>
                                            <th>Guests</th>
                                            <th>Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                       
                                        { 
                                            upcomingBookings && upcomingBookings.map((el, index) => {
                                                return (
                                                    <tr key={index}>
                                                        
                                                        <td>{formatDate(el.dateFrom)}</td>
                                                        <td>{formatDate(el.dateTo)}</td>
                                                        <td>{el.venue.name}</td>
                                                        <td>{el.guests}</td>
                                                        <td>{el.venue.price} NOK</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    
                                    
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Container>

                        { listOfVenues.length &&
                            <Container>
                                <Row>
                                    <Col>
                                        <h2 className={`${styles.white} mt-3 mb-3`}>My Venues</h2>
                                        
                                        {
                                            listOfVenues.map((el, index) => {
                                            return(
                                                <VenueComponent key={index} data={el} showView={true} showEditDelete={true} setEdit={setEdit} setDelete={setDelete}/>
                                            )
                                            })
                                        }

                                        { paginationMeta && 
                                            <PaginationComponent
                                                currentPage={paginationMeta.currentPage}
                                                isFirstPage={paginationMeta.isFirstPage}
                                                isLastPage={paginationMeta.isLastPage}
                                                nextPage={paginationMeta.nextPage}
                                                pageCount={paginationMeta.pageCount}
                                                previousPage={paginationMeta.previousPage}
                                                onPageChange={handlePageChange}
                                            />
                                        }
            
                                    </Col>
                                </Row>
                            </Container>
                        }
                        
                    </div>



                }
            </div>   
            
            <Modal show={isShow} onHide={handleClose} size="lg">
                <form onSubmit={handleSubmit}>
                    <Modal.Header>
                        <Modal.Title>{idToEdit ? 'Update Venue' : 'Add Venue'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* below is for the form */}
                    

                            {/* name and description */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter name"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter description"
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            {/* media url */}
                            <Form.Group className="mb-3" controlId="formMediaUrl">
                                <Form.Label>Media URL</Form.Label>
                                <Form.Control
                                type="text"
                                    name="media[0].url"
                                    value={formData.media[0].url}
                                    onChange={(e) => {
                                        const media = [...formData.media];
                                        media[0].url = e.target.value;
                                        setFormData({ ...formData, media });
                                    }}
                                    placeholder="Enter media URL"
                                    required
                                />
                            </Form.Group>
                            
                            {/* media alt */}
                            <Form.Group className="mb-3" controlId="formMediaAlt">
                                <Form.Label>Media Alt Text</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="media[0].alt"
                                    value={formData.media[0].alt}
                                    onChange={(e) => {
                                        const media = [...formData.media];
                                        media[0].alt = e.target.value;
                                        setFormData({ ...formData, media });
                                    }}
                                    placeholder="Enter media alt text"
                                    required
                                />
                            </Form.Group>

                            {/* price, max guests, rating */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formPrice">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter price"
                                        required
                                    />
                                    
                                </Form.Group>
                                <Form.Group as={Col} controlId="formMaxGuests">
                                    <Form.Label>Max Guests</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="maxGuests"
                                        value={formData.maxGuests}
                                        onChange={handleChange}
                                        placeholder="Enter max guests"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formRating">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        placeholder="Enter rating"
                                        required
                                    />
                                </Form.Group>
                            </Row>
                            
                            {/* meta */}
                            <Form.Group className="mb-3" controlId="formMeta">
                                <Form.Label>Meta</Form.Label>
                                {Object.keys(formData.meta).map((key) => (
                                    <Form.Check
                                        key={key}
                                        type="checkbox"
                                        name={key}
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                        checked={formData.meta[key]}
                                        onChange={(e) => {
                                        const meta = { ...formData.meta, [key]: e.target.checked };
                                        setFormData({ ...formData, meta });
                                        }}
                                    />
                                ))}
                            </Form.Group>
                            
                            {/* address */}
                            <Form.Group className="mb-3" controlId="formLocationAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="location.address"
                                    value={formData.location.address}
                                    onChange={(e) => {
                                        const location = { ...formData.location, address: e.target.value };
                                        setFormData({ ...formData, location });
                                    }}
                                    placeholder="Enter address"
                                    required
                                />
                            </Form.Group>
                            
                            {/* city, zip */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formLocationCity">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location.city"
                                        value={formData.location.city}
                                        onChange={(e) => {
                                        const location = { ...formData.location, city: e.target.value };
                                        setFormData({ ...formData, location });
                                        }}
                                        placeholder="Enter city"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formLocationZip">
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location.zip"
                                        value={formData.location.zip}
                                        onChange={(e) => {
                                        const location = { ...formData.location, zip: e.target.value };
                                            setFormData({ ...formData, location });
                                        }}
                                        placeholder="Enter zip"
                                    />
                                </Form.Group>
                            </Row>

                            {/* country, continent */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formLocationCountry">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location.country"
                                        value={formData.location.country}
                                        onChange={(e) => {
                                        const location = { ...formData.location, country: e.target.value };
                                        setFormData({ ...formData, location });
                                        }}
                                        placeholder="Enter country"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formLocationContinent">
                                    <Form.Label>Continent</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location.continent"
                                        value={formData.location.continent}
                                        onChange={(e) => {
                                            const location = { ...formData.location, continent: e.target.value };
                                            setFormData({ ...formData, location });
                                        }}
                                        placeholder="Enter continent"
                                    />
                                </Form.Group>
                            </Row>
                        
                            {/* latitude, longitude */}
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formLocationLat">
                                    <Form.Label>Latitude</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="location.lat"
                                        value={formData.location.lat}
                                        onChange={(e) => {
                                        const location = { ...formData.location, lat: e.target.value };
                                            setFormData({ ...formData, location });
                                        }}
                                        placeholder="Enter latitude"
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formLocationLng">
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="location.lng"
                                        value={formData.location.lng}
                                        onChange={(e) => {
                                            const location = { ...formData.location, lng: e.target.value };
                                            setFormData({ ...formData, location });
                                        }}
                                        placeholder="Enter longitude"
                                    />
                                </Form.Group>
                            </Row>

    
                        {/* below is end the form */}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    </Modal.Footer>

                </form>
            </Modal>

            <Modal show={isShowProfileEdit} onHide={handleCloseProfile} size="lg">
                <form onSubmit={handleUpdate}>
                    <Modal.Header>
                        <Modal.Title>Update Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* below is for the form */}
                    
                        <Form.Group as={Col} controlId="avatarUrl">
                            <Form.Label>Avatary Url</Form.Label>
                            <Form.Control
                                type="text"
                                name="avatarUrl"
                                value={profileData.avatarUrl}
                                onChange={handleChangeProfileData}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="avatarAlt">
                            <Form.Label>Avatar Alt</Form.Label>
                            <Form.Control
                                type="text"
                                name="avatarAlt"
                                value={profileData.avatarAlt}
                                onChange={handleChangeProfileData}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="bannerUrl">
                            <Form.Label>Banner Url</Form.Label>
                            <Form.Control
                                type="text"
                                name="bannerUrl"
                                value={profileData.bannerUrl}
                                onChange={handleChangeProfileData}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="bannerAlt">
                            <Form.Label>Banner Alt</Form.Label>
                            <Form.Control
                                type="text"
                                name="bannerAlt"
                                value={profileData.bannerAlt}
                                onChange={handleChangeProfileData}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="bannerAlt">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                type="text"
                                name="bio"
                                value={profileData.bio}
                                onChange={handleChangeProfileData}
                                required
                            />
                        </Form.Group>

                        <Form.Check
                            checked={profileData.venueManager}
                            type="checkbox"
                            name="venueManager"
                            id="venueManager"
                            onChange={handleChangeProfileData}
                        />

                        {/* below is end the form */}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseProfile}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    </Modal.Footer>

                </form>
            </Modal>
                            
            <ToastContainer />

        </Fragment>
    )
};

export default UserProfile;