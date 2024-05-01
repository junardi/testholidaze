import { Container, Row, Col } from "react-bootstrap";
import styles from './footer.styles.module.scss';

const Footer = () => {
    return (
      <div className={styles.footer}>
        <Container>
          <Row>
            <Col>
              <p>Copyright &copy; All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
};

export default Footer;