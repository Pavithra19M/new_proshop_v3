import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {Form, Button, Row, Col, FormGroup} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from  '../slices/authSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const LoginScreen = () => {
    
    const[email,setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    //destructing login from useLoginMutation
    const [login, { isLoading }] = useLoginMutation();
    console.log("login", login)

  // useSelector allows to access state globally
  // destructing the userInfo state from store.js, we can access any state from authSlice

    const { userInfo } = useSelector((state) => state.auth);
    console.log("userInfo", userInfo)

   //http://localhost:3000/login?redirect=/shipping, we have check wheather any redirection
   //is there or not, if user logged in and redirect is present, then we need to redirect
   // user to shipping page, to do this we use search proptery from useLocation

   // destructing search proptery from useLocation, to check any redirect is present or not
   const { search } = useLocation()

   //sp = searchparams it is a variable, we send search proptery to URLSearchParams constructor
   const sp = new URLSearchParams(search)

   //if redirect present, then redirect or go to index
  const redirect = sp.get('redirect') || '/';
  console.log("redirect", redirect)
  //useEffect used to check user logged in or not, if login redirect to home page or
  //something which is present in redirect

  useEffect(() => {
     // if user logged in then redirect to home page or
    //something which is present in redirect
    if(userInfo) {
        navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        console.log("call")
        e.preventDefault()
        try{
            //login we are getting from useLoginMutation
            // email and password value is coming from form
            //instead of using promise(.then), we are using unwrap(),
            //which receive response from API and stored in response variable
            const response = await login({ email, password}).unwrap();
            console.log("response", response)
            //calling setCredentials action and sending data wch received from 
            //API and this user info is stored in localStoreage
            dispatch(setCredentials( {...response,} ));
            //if success navigate to redirect
            navigate('/')
        } catch(error) {
            toast.error(error?.data?.message || error.error );
        }
    }

    return(
        <FormContainer>
            <h1>Sign In</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup controlId="email" className="my-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' value={email} placeholder="enter email"
                        onChange = {(e) => setEmail(e.target.value)}
                    />
                </FormGroup>

                <FormGroup controlId="password" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' value={password} placeholder="enter password"
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                </FormGroup>

                <Button type='submit' variant='primary' className="mt-2"
                disabled = {isLoading }>Log In</Button>
                 
                 {
                    isLoading && <Loader />
                 }
            </Form>

            <Row>
                <Col>
                    New Customer? {''} <Link to = {`/register?redirect=${redirect} : '/register'`}>Register</Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default LoginScreen;