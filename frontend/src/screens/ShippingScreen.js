import React,{useState} from 'react';
import {Form, FormGroup, Button} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {

    //shippingAdress present in cart state
    const { shippingAddress } = useSelector((state) => state.cart)
    console.log("shippingAddress", shippingAddress)
    //if already address is present in localstorage, then that particular should pop
    //up in input filed else it should be empty
    const[address, setAddress] = useState(shippingAddress?.address || '')
    const[city, setCity] = useState(shippingAddress?.city || '')
    const[postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')
    const[country, setCountry] = useState(shippingAddress?.country || '')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        navigate('/payment')
    }
    return(
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <FormGroup controlId ='address' className='my-2'>
                    <Form.Label>Enter Address</Form.Label>
                    <Form.Control type='text' placeholder = 'enter address'
                        value={address} onChange = {(e) => setAddress(e.target.value)}
                    />
                </FormGroup>

                <FormGroup controlId ='city' className='my-2'>
                    <Form.Label>Enter city</Form.Label>
                    <Form.Control type='text' placeholder = 'enter city'
                        value={city} onChange = {(e) => setCity(e.target.value)}
                    />
                </FormGroup>

                <FormGroup controlId ='postalCode' className='my-2'>
                    <Form.Label>Enter postal code</Form.Label>
                    <Form.Control type='text' placeholder = 'enter postal code'
                        value={postalCode} onChange = {(e) => setPostalCode(e.target.value)}
                    />
                </FormGroup>

                
                <FormGroup controlId ='country' className='my-2'>
                    <Form.Label>Enter country</Form.Label>
                    <Form.Control type='text' placeholder = 'enter country'
                        value={country} onChange = {(e) => setCountry(e.target.value)}
                    />
                </FormGroup>
              
              <Button type='submit' variant='primary' className = 'my-2'>Contiue</Button>

            </Form>
        
        </FormContainer>
    )
}
export default ShippingScreen;
