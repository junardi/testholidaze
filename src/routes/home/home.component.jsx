import { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import styles from './home.styles.module.scss';
import { fetchVenues, searchVenues } from "../../utils/venues/venue.utils";
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
  }, [currentPage, currentLimit]); 

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

  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 2000);

    return () => {
        clearTimeout(handler);
    };
  }, [inputValue]); 

  useEffect(() => {

    const callSearch = async() => {
      if (debouncedValue) {
        console.log('User stopped typing. Debounced value:', debouncedValue);
       
        if(!typed) {
          setTyped(true);
        }

        const venues = await searchVenues(currentLimit, currentPage, debouncedValue);

        console.log('searched is ', venues);
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
        // Place your function or API call here
      } else {
        if(typed) {
          console.log('Empty ', debouncedValue);
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
        }
      
      }
    };

    callSearch();
   
  }, [debouncedValue, currentLimit, currentPage, typed]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };


  return (
    <div className={`${styles.home} mainPage`}>
      <Container>
        <Row>
          <Col>

            <div className={styles.venueItemsContainer}>
              <h1 className="mb-5">List Of Venues</h1>

              <Form.Group className="mb-3 mt-5" controlId="numGuests">
                <Form.Label>Search Venues</Form.Label>
                <Form.Control type="text" name="numGuests" onChange={handleChange} />
              </Form.Group>
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