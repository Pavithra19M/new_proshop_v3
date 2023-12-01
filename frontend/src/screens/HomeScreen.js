//import{useState,useEffect} from 'react';
import { Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
//import products from '../products'
import ProductComponent from "../components/ProductComponent";
import Paginate from "../components/Paginate";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCarousel from "../components/ProductCarousel";
import { useGetProductsQuery } from "../slices/productsApiSlice";
//import axios from 'axios';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  //const[products,setProducts] = useState([])

  //using async and await
  // useEffect(()=> {
  //     const fecthProducts = async () => {
  //         const {data} = await axios.get('/api/products')
  //         setProducts(data)
  //     }
  //     fecthProducts()
  // },[])

  //using uesEffect
  // useEffect(() => {
  //     axios.get('/api/products')
  //     .then((response) => {
  //         console.log(response.data)
  //         setProducts(response.data)
  //     })
  //     .catch((err) => {
  //         console.log("err",err)
  //     })
  // },[])

  //using Redux Toolkit
  //while we get pagination from backend, our data is not oly products
  //wch includes page, pageszie
  //const {data: products, isLoading, error} = useGetProductsQuery();
  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((products) => (
              <Col key={products._id} sm={12} md={6} lg={4} xl={3}>
                {/* {products.name} */}
                <ProductComponent products={products} />
              </Col>
            ))}
          </Row>

          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
