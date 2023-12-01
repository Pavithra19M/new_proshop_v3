import React,{useEffect, useState} from "react";
import {useNavigate, Link, useLocation} from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import {Row, Col, Button, Form, FormGroup} from 'react-bootstrap';
import Loader from '../components/Loader';
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";   
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';

const RegisterScreen = () => {

    const[name, setName] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //destructing register mutation from usersApiSlice
    const[register, {isLoading}] = useRegisterMutation();

    //destructing userInfo from store.js(auth reducer)
    const { userInfo } = useSelector((state) => state.auth)

    const { search } = useLocation();

    const sp = new URLSearchParams(search)

    const redirect = sp.get('redirect') || '/'

    useEffect(()=>{
        if(userInfo){
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])

    const submitHanlder = async (e) => {
       e.preventDefault()
       if(password !== confirmPassword){
        toast.error('Password does not match');
        return
       } else{
            try{
                const response = await register({name, email, password}). unwrap();
                dispatch(setCredentials({...response}));
                navigate(redirect)
            } catch(error){
                toast.error(error?.data?.message || error.error)
            }
       }    
    }

    return(
        <FormContainer>
            <h1>Sing Up</h1>
            <Form onSubmit = {submitHanlder}>
                <FormGroup controlId="name" className="my-3">
                    <Form.Label>Enter Name</Form.Label>
                    <Form.Control type = 'text' placeholder ='enter name' value={name}
                    onChange={(e) => setName(e.target.value)} 
                    />   
                </FormGroup>

                <FormGroup controlId="email" className="my-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type = 'email' placeholder ='enter email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    />   
                </FormGroup>

                <FormGroup controlId="password" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type = 'password' placeholder ='enter password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    />   
                </FormGroup>

                <FormGroup controlId="confirmPassword" className="my-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type = 'password' placeholder ='enter confirm password' 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    />   
                </FormGroup>

                <Button type='submit' variant='primary' className='mt-2' 
                    disabled = {isLoading}>
                    Register
                </Button>
            </Form>
                {
                    isLoading && <Loader />
                }
            <Row>
                <Col>
                    Already have an account ? {''}
                    <Link to = {redirect ? `/login?redirect=${redirect}` : '/login'}>
                        Login
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}
export default RegisterScreen;
