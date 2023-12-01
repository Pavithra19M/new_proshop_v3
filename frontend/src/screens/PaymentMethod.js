import React,{useState, useEffect} from "react";
import { Form, Button, Col} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from "../slices/cartSlice";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const PaymentMethod = () => {
    const[paymentMethod, setPaymentMethod] = useState('payPal')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { shippingAddress} = useSelector((state) => state.cart)

    useEffect(() => {
        if(!shippingAddress){
            navigate('/shipping')
        }
    }, [navigate, shippingAddress])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return(
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <h1>Payment Method</h1> 
            <Form onSubmit = {submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check type = 'radio'
                            className='my-2'
                            name='paymentMethod'
                            label = 'PayPal or credit Card'
                            value='paymentMethod'
                            id = 'paypal'
                            checked
                            onChange={(e)=>setPaymentMethod(e.target.value)}
                        >
                        </Form.Check>
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary'>Continue</Button>
            </Form>



        </FormContainer>
    )
}
export default PaymentMethod