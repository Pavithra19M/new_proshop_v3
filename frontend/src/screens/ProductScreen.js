import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Button, Card, Image, ListGroup,Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//import products from "../products";
import RatingComponent from "../components/RatingComponent";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import Message from "../components/Message";
import { toast } from 'react-toastify';
import { addToCart } from "../slices/cartSlice";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
//import axios from 'axios';

const ProductScreen = () => {
  //const[product,setProduct] = useState([])

  const[qty,setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  //use to route another component
  const navigate = useNavigate()

  //use to call action from redux
  const dispatch = useDispatch()

  const { id:productId } = useParams();
  // console.log("params id", id);

  //fetching data using useEffect
  // useEffect(() => {
  //     axios.get(`/api/products/${id}`)
  //     .then((response) => {
  //         console.log("res",response.data)
  //         setProduct(response.data)
  //     })
  //     .catch((err) => {
  //         console.log("err",err)
  //     })
  // },[])

  // const product = products.find((p) => p._id == id)
  // console.log("product",product)

  //Fetching Data from Redux Toolkit
  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  console.log("productdsdds", product)

  const[createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation()
  console.log("createReview", createReview)

  const { userInfo } = useSelector((state) => state.auth)
  console.log("userInfo", userInfo)

 const addToCartHandler = () => {
  dispatch(addToCart({...product, qty}))
  navigate('/cart')
 }

 const submitHandler = async (e) => {
  e.preventDefault()
  console.log("call")
  try{
    await createReview({
      productId,
      rating, 
      comment,
    }).unwrap()
    refetch()
    toast.success('Reviews added succesfullly')
    setRating(0)
    setComment('')
    console.log("setcomment",  setComment(''))

  } catch(err){
    setRating(0)
    setComment('')
    toast.error(err?.data?.message || err.error)
  }
 }
       
  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>

      {isLoading ? 
       (<Loader />)
      : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name}/>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>{product.name}</ListGroup.Item>

                <ListGroup.Item>
                  <RatingComponent
                    value={product.rating}
                    text={`${product.numReviews}reviews`}
                  />
                </ListGroup.Item>

                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>

                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out Of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                    {
                        product.countInStock > 0 && 
                        <ListGroup.Item>
                            <Row>
                                <Col>Qty</Col>
                                <Col>
                                    <Form.Control as='select'
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                    >
                                  {[...Array(product.countInStock).keys()].map((x) => (
                                    <option key={x+1} value={x+1}>{x+1}</option>
                                  ) )}
                                  </Form.Control>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    }

                  <ListGroup.Item>
                    <Button
                      type="button"
                      onClick = {addToCartHandler}
                      className="btn-block"
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className = 'review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.review.length === 0 && <Message>No reviews</Message>}

                <ListGroup variant='flush'>
                    { product.review.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <RatingComponent value={review.rating} />
                        <p>{review.createdAt.substring(0,10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}

                    <ListGroup.Item>
                      <h2>Write a Customer Review</h2>
                      { loadingProductReview && <Loader />}

                      { userInfo ? (
                        <Form onSubmit={submitHandler}>
                          <Form.Group controlId='rating' className='my-3'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control as='select' value={rating}
                              onChange= {(e)=>setRating(Number(e.target.value))}
                            >
                            <option value=''>Select...</option>
                            <option value='1'>1 - Poor</option>
                            <option value = '2'> 2- Fair</option>
                            <option value='3'>3 - Good </option>
                            <option value='4'>4 - Very Good </option>
                            <option value='5'>5 - Excellent </option>
                            </Form.Control>
                          </Form.Group>

                          <Form.Group controlId="comment" className='my-3'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control as = 'textarea' row='3' 
                              value={comment} onChange={(e)=>setComment(e.target.value)} />
                          </Form.Group>

                          <Button disabled = {loadingProductReview} 
                          type='submit' variant='primary'>Submit</Button>
                        </Form>
                      ) : (
                        <Message>Please <Link to='/login'>sign In</Link> to write a review</Message>
                      )}
                      </ListGroup.Item>

                </ListGroup>   

            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
