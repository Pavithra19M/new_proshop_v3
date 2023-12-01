import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Card,
  ListGroup,
  Button,
  Form,
} from "react-bootstrap";
import Message from "../components/Message";
import { FaTrash } from "react-icons/fa";
//calling addToCart action to add item in state,
//calling removeFromCart action to remove item from state
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //accessing state 'cart' from store(redux) and destructing cartItems state
  const { cartItems } = useSelector((state) => state.cart);
  console.log("cartItems1", cartItems);

  //addToCartHandler(): used to in CartScreen, when user clicks to select number of quantity, 
  //state get updated globally i.e in store
  const addToCartHandler = async (product,qty) => {
    dispatch(addToCart({...product, qty}))
  }

  //removeFromCartHandler(): used to in CartScreen, when user clicks on delete button, item is 
  //deleted and state get updated globally i.e in store
  const removeFromCartHanlder = (id) => {
    console.log("remove",id)
    dispatch(removeFromCart(id))
  }

  //checkoutHandler(): used to in CartScreen, when user clicks on proceed to checkout button
  //if user is registered user, then it navigates to shipping page else it navigates to login 
  //page
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <h2 style={{ marginBottom: "20px" }}>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <Message>
            {" "}
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => {
                        addToCartHandler(item, Number(e.target.value));
                      }}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1}>{x + 1}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button type="button" variant='light'
                    onClick={() => removeFromCartHanlder(item._id)}>
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                )items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>

            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick = {checkoutHandler}
              >
                Proceed to CheckOut
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
