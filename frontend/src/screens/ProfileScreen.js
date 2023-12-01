import React, {useState, useEffect} from 'react';
import {Row, Col, Form, Button, Table, FormGroup} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';

const ProfileScreen = () =>{
    const[name, setName] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()

    const { userInfo} = useSelector((state) => state.auth)

    const [ updateProfile, {isLoading: loadingUpdateProfile} ] = useProfileMutation()

    const {data: orders, isLoading, error } = useGetMyOrdersQuery()

    useEffect(()=>{
        if(userInfo) {
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    }, [userInfo, userInfo.name, userInfo.email])

    const submitHanlder = async (e) => {
        e.preventDefault()
       if( password !== confirmPassword){
        toast.error("Password do not match")
       }else{
            try{
                const response = await updateProfile({_id:userInfo._id, name, email,
                password}).unwrap()
                dispatch(setCredentials(response))
                toast.success("Profile updated successfully")
            }catch(err){
                toast.error(err?.data?.message || err.error)
            }
       }
    }

    return(
       <Row>
        <Col md={3}>
            <h2>User Profile</h2>
            <Form onSubmit = {submitHanlder}> 
                <FormGroup controlId='name' className='my-2'>
                    <Form.Label>Enter Name</Form.Label>
                    <Form.Control type='name' placeholder='Enter name'
                    value={name} onChange={(e) => setName(e.target.value)}/>
                </FormGroup>

                <FormGroup controlId='email' className='my-2'>
                    <Form.Label>Enter email</Form.Label>
                    <Form.Control type='email' placeholder='Enter email'
                    value={email} onChange={(e) => setEmail(e.target.value)}/>
                </FormGroup>

                <FormGroup controlId='password' className='my-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter password'
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                </FormGroup>

                <FormGroup controlId='confirmPassword' className='my-2'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter confirmPassword'
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </FormGroup>

                <Button type='submit' className='primary'>Update</Button>

                { loadingUpdateProfile && <Loader />}
            </Form>
        </Col>

        <Col md={9}>
            <h2>My Orders</h2>
            {isLoading ? <Loader /> : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>
                                        { order.isPaid ? (
                                            order.paidAt.substring(0,10)
                                        ) : (< FaTimes style={{color:'red'}} />)}
                                    </td>
                                    <td>
                                        {
                                            order.isDelivered ? (
                                                order.deliveredAt.substring(0,10)
                                            ) : < FaTimes style={{color:'red'}} />
                                        }
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className='btn-sm' variant='light'>
                                                Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            )}
        </Col>
       </Row>
    )
}
export default ProfileScreen