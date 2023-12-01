import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import {useNavigate} from 'react-router-dom';
import logo from "../assets/styles/logo.png";
import SearchBox from "./SearchBox";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import {logout} from '../slices/authSlice';

const Header = () => {
  // useSelector allows to access state globally
  // destructing the cart state from store.js, we can access any state from cartSlice
  const { cartItems } = useSelector((state) => state.cart);
  console.log("cart", cartItems);

  // destructing the userInfo state from store.js, we can access any state from userInfo
  const {userInfo} = useSelector((state) => state.auth)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  //logoutApiCall, we can assign any name, logoutApiCall is destructed from useLogoutMutation
  const [logoutApiCall] = useLogoutMutation()
 
  const logoutHandler = async () => {
    try{
        // unwrap, works like promise(then), response received from API is stored in unwrap()
        await logoutApiCall().unwrap()
        //dispatching the logout action
        dispatch(logout())
        //if response is success, then navigate to login page
        navigate('/login')
    } catch(error){
      // if error occurs,
      console.log(error)

    }
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="Proshop" />
              Proshop
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="ms-auto">
              <SearchBox />
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart />
                  Cart
            {/*below code to calculate number of items present in cartItems
             state and display total item count in UI  */}
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                      {cartItems.reduce(
                        (acc, currentItem) => acc + currentItem.qty,
                        0
                      )}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {
                userInfo ? (
                  <NavDropdown title={userInfo.name} id='username' >
                    <LinkContainer to='/profile'>
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                        <Nav.Link>
                          <FaUser />
                          Sign In
                        </Nav.Link>
                  </LinkContainer>
                )
              }

              {
                userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="adminmenu">

                     <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item >Products</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/admin/userlist'>
                      <NavDropdown.Item >Users</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/admin/orderlist'>
                      <NavDropdown.Item >Orders</NavDropdown.Item>
                    </LinkContainer>

                  </NavDropdown>
                )
              }
                
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
