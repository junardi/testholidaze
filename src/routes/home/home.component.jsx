import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from './home.styles.module.scss';
import { fetchVenues } from "../../utils/venues/venue.utils";
import PaginationComponent from "../../components/pagination/pagination.component";
import VenueComponent from "../../components/venue/venue.component";


const Home = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(10);

  const [paginationMeta, setPaginationMeta] = useState(null);

  const [listOfVenues, setListOfVenues] = useState([]);


  useEffect(() => {
    const getVenues = async() => {
      const venues = await fetchVenues(currentLimit, currentPage);
      setListOfVenues(venues.data);
      const data = {
        currentPage: venues.meta.currentPage,
        isFirstPage: venues.meta.isFirstPage,
        isLastPage: venues.meta.isLastPage,
        nextPage: venues.meta.nextPage,
        pageCount: venues.meta.pageCount,
        previousPage: venues.meta.previousPage,
        totalCount: venues.meta.totalCount
      };
      setPaginationMeta(data);
    }; 

    getVenues();
  }, [currentPage]); 

  const handlePageChange = (pageNumber) => {
  
    setCurrentPage(pageNumber);
    setPaginationMeta((prevMeta) => ({
      ...prevMeta,
      currentPage: pageNumber,
      isFirstPage: pageNumber === 1,
      isLastPage: pageNumber === prevMeta.pageCount,
      nextPage: pageNumber < prevMeta.pageCount ? pageNumber + 1 : prevMeta.pageCount,
      previousPage: pageNumber > 1 ? pageNumber - 1 : 1,
    }));
  };


  return (
    <div className={`${styles.home} mainPage`}>
      <Container>
        <Row>
          <Col>

            <div className={styles.venueItemsContainer}>
              <h1 className="mb-5">List Of Venues</h1>
              {
                listOfVenues.map((el, index) => {
                  return(
                    <VenueComponent key={index} data={el} showView={true} />
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
              
            </div>

          </Col>
        </Row>
      </Container>
    </div>
  );

};


export default Home;