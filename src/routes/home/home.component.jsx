import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from './home.styles.module.scss';
import { fetchVenues } from "../../utils/venues/venue.utils";
import mapPin from '../../assets/images/map-pin.svg';

const Home = () => {

    useEffect(() => {
        const getVenues = async() => {
            const venues = await fetchVenues();
            console.log(venues);
        }; 

        getVenues();
    }, []); 



    return (
      <div className={styles.home}>
        <Container>
          <Row>
            <Col>
              <div className={styles.venueItemsContainer}>
                <div className={styles.venueItem}>
                  <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Venue Image"
                  />

                  <div className={styles.details}>
                    <h6>The Picollo Hotel</h6>
                    <p className={styles.location}>
                      <img src={mapPin} alt="Location pin" /> Sample location
                    </p>
                    <p className={styles.description}>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Laborum, error? Deleniti fugit, atque consequatur ab
                      consequuntur non sapiente sit nostrum eaque placeat fugiat
                      repellat vero, sequi pariatur libero laudantium! Id.
                    </p>
                  </div>

                  <div className={styles.extraDetails}>
                    <div className={styles.reviewContainer}>
                      <div className={styles.left}>
                        <p className={styles.rateText}>Very Good</p>
                        <p className={styles.numReviews}>2,156 Reviews</p>
                      </div>
                      <div className={styles.right}>
                        <span>8.0</span>
                      </div>
                    </div>

                    <div className={styles.pricingReviewContainer}>
                      <p className={styles.label}>Price from</p>
                      <p className={styles.price}>NOK 520.75</p>
                      <p className={styles.label}>per night</p>
                    </div>

                    
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
};


export default Home;