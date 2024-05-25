import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import VenueComponent from "../../components/venue/venue.component";
import { getVenueById } from "../../utils/venues/venue.utils";
import { useParams } from "react-router-dom";

const SingleVenue = () => {

    const [show] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const { id } = useParams();
    const [currentVenue, setCurrentVenue] = useState(null);
    const [noVenue, setNoVenue] = useState(false);

    useEffect(() => {
        const getVenue = async() => {
            const venue = await getVenueById(id);
            
            if(venue.errors) {
                setNoVenue(true);
                return
            }
          
         
            setCurrentVenue(venue.data);
           
        };

        getVenue();

    },[trigger, id]);


    return(
        <div className="mainPage">
            <Container>
                <Row>
                    <Col>   
                        {
                            currentVenue && 
                            <VenueComponent data={currentVenue} showEditDelete={show} showCalendar={true} setTrigger={setTrigger} trigger={trigger}/>
                        }

                        {
                            noVenue &&
                            <h6>Venue not found.</h6>
                        }
                    </Col>  
                </Row>
            </Container>
        </div>
    )

};


export default SingleVenue;