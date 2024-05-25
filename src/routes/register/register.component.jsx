import { useState, useEffect } from "react";

import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import styles from './register.styles.module.scss';
import { Link } from "react-router-dom";
import { isValidEmail, isValidUrl, combineErrors } from "../../lib/helpers";
import { registerUser } from "../../utils/auth/auth.utils";

const defaultFormFields = {
    name: '', 
    email: '', 
    bio: '', 
    avatar: '', 
    banner: '',
    venueManager: false, 
    password: ''
};

const Register = () => {

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { name, email, bio, avatar, banner, venueManager, password } = formFields;

    const handleChange = (evt) => {
        const { name, value} = evt.target;
        if(name === 'venueManager') {
            setFormFields({...formFields, [name]: !venueManager});
        } else {
            setFormFields({...formFields, [name]: value});
        }
    };  

    const [errorMessage, setErrorMessage] = useState(false);
    const [successRegister, setSuccessRegister] = useState(false);

    const onSubmit = async(evt) => {
        evt.preventDefault();

        if(name === '' || email === '' || bio === '' || avatar === '' || banner === '' || password === '') {
            setErrorMessage('Name, Email, Bio, Avatar Banner, and Password are required.');
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMessage('Email is Invalid');
            return;
        }

        if(!isValidUrl(avatar)) {
            setErrorMessage('Avatar is not a valid url');
            return;
        }

        if(!isValidUrl(banner)) {
            setErrorMessage('Banner is not a valid url');
            return;
        }

        const data = {
            "name": name,
            "email": email,
            "bio":  bio,
            "avatar": {
                "url": avatar,
                "alt": "avatar"
            },
            "banner": {
                "url": banner,
                "alt": "Banner"
            },
            "venueManager": venueManager,
            "password": password
        };

     
        const result = await registerUser(data);

        if(result.errors) {
            setErrorMessage(combineErrors(result.errors));
        } else {
            setSuccessRegister(true);
        }
    };

    return (
        <div className="mainPage">
            <Container>
            <Row>
                <Col>

                    { !successRegister &&
                        <form onSubmit={onSubmit} className={`${styles.register}`}>
                            <div className="row">
                                <h2>Register</h2>
                                <div className="col-md-12">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className="form-control" id="name" name="name" onChange={handleChange} placeholder="Sample Name" />                        
                                    <br />

                                    <label htmlFor="email">Email</label>
                                    <input type="text" className="form-control" id="email" name="email" onChange={handleChange} placeholder="Ex. youremail@mail.com" />
                                    <br />

                                    <label htmlFor="bio">Bio</label>
                                    <input type="text" className="form-control" id="bio" name="bio" onChange={handleChange} placeholder="Sample Bio" />
                                    <br />

                                    <label htmlFor="avatar">Avatar URL</label>
                                    <input type="text" className="form-control" id="avatar" name="avatar" onChange={handleChange} placeholder="http://localhost" />
                                    <br />

                                    <label htmlFor="banner">Banner</label>
                                    <input type="text" className="form-control" id="banner" name="banner" onChange={handleChange} placeholder="http://localhost" />
                                    <br />
                                    
                                
                                    <div className={styles.checkboxContainer}>
                                        <label htmlFor="venueManager">Venue Manager?</label>
                                        <input type="checkbox" id="venueManager" name="venueManager" onChange={handleChange} checked={venueManager} />       
                                    </div>

                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" id="password" name="password" onChange={handleChange} placeholder="Ex. A123@paswod" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <input type="submit" id="register" value="Register" className={`btn btn-outline-success ${styles.btnForm}`} />                       
                                </div>
                            </div>
                        </form>
                    }

                    { successRegister &&
                        <Alert variant="success mt-5">
                            <Alert.Heading>Success|</Alert.Heading>
                            <p>You are successfully regietrered. Click <Link to={`/login`}>here</Link> to login</p>
                        </Alert>
                    }

                    { errorMessage && !successRegister &&
                        <Alert variant="danger">
                            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                            <p>{errorMessage}</p>
                        </Alert>
                    }
                    

                </Col>
            </Row>
            </Container>
        </div>
    )
};

export default Register;