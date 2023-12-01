import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import RatingComponent from "./RatingComponent";

const ProductComponent = ({products}) => {
    
    return(
        <Card className="my-3 p-3 rounded">
            <Link to = {`/product/${products._id}`}>
                <Card.Img variant="top" src={products.image} />
            </Link>

            <Card.Body>
                <Link to = {`/product/${products._id}`}>
                    <Card.Title as='div' className="product-title">
                       <strong> {products.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as='div'>
                    <RatingComponent value={products.rating} text={`${products.numReview} reviews`} />
                </Card.Text>

                <Card.Text as='h3'>
                ${products.price}
            </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default ProductComponent