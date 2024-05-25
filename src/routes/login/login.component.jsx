import { useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import styles from './login.styles.module.scss';
import { loginUser } from "../../utils/auth/auth.utils";
import { combineErrors } from "../../lib/helpers";
import { isValidEmail } from "../../lib/helpers";
import { useNavigate } from "react-router-dom";
import { createAPiKey } from "../../utils/auth/auth.utils";

const defaultFormFields = {
    email: '', 
    password: ''
};

const Login = () => {

    const navigate = useNavigate();

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    const handleChange = (evt) => {
        const { name, value} = evt.target;
        setFormFields({...formFields, [name]: value});
    };  

    const [errorMessage, setErrorMessage] = useState(false);
   
    const doSubmit = async(evt) => {
        evt.preventDefault();
        console.log('formfields is ', formFields);

        if(email === '' || password === '') {
            setErrorMessage('Invalid email or password.');
            return;
        };

        if(!isValidEmail(email)) {
            setErrorMessage('Invalid email.');
            return;
        }

        const login = await loginUser(formFields);

        if(login.errors) {
            setErrorMessage(combineErrors(login.errors));
        } else {
            const apiKey = await createAPiKey(login.data.accessToken);
            login.apiKey = apiKey.data.key;
            localStorage.setItem('user', JSON.stringify(login));
            // navigate(`/profiles/${login.data.name}`);

            navigate(`/profile`);
        }
        
    };


    return (
      <div className="mainPage">
        <Container>
          <Row>
            <Col>
            
                <form  onSubmit={doSubmit} className={`${styles.login}`}>
                    <div className="row">
                        <h2>Login</h2>
                        <div className="col-md-12">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control" id="email" name="email" value={email} onChange={handleChange} placeholder="Ex. youremail@mail.com" />
                            <br />
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" name="password" value={password} onChange={handleChange} placeholder="Ex. A123@paswod" />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <input type="submit" id="register" value="Login" className={`btn btn-outline-success ${styles.btnForm}`} />                       
                        </div>
                    </div>
                </form>


                { errorMessage &&
                <Alert variant="danger">
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>{errorMessage}</p>
                </Alert>
                }




            </Col>
          </Row>
        </Container>
      </div>
    );
};


export default Login;