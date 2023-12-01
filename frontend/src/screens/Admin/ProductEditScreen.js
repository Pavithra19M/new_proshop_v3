import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer'
import { useUpdateProductMutation, useGetProductDetailsQuery,
useUploadProductImageMutation } from '../../slices/productsApiSlice'

const ProductEditScreen = () => {

    const { id: productId } = useParams()
    console.log("productId", productId)

    const[name, setName] = useState('')
    const[price, setPrice] = useState(0)
    const[brand, setBrand] = useState('')
    const[description, setDescription] = useState('')
    const[countInStock, setCountInStock] = useState(0)
    const[image, setImage] = useState('')
    const[category, setCategory] = useState('')

    const navigate = useNavigate() 

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId)
    console.log("productssss", product)

    const [ updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation()

    const [ uploadProductImage, { isLoading: loadingUpload}] = useUploadProductImageMutation() 

    useEffect(()=>{
        if(product){
            setName(product.name)
            setPrice(product.price)
            setImage(product.image)
            setBrand(product.brand)
            setDescription(product.description)
            setCategory(product.category)
            setCountInStock(product.countInStock)
        }
    }, [product])

    const submitHandler = async (e) => {
        e.preventDefault()
        console.log("call")
        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }
        console.log("updatedProduct", updatedProduct)
        const result = await updateProduct(updatedProduct)
        console.log("result", result)
        if(result.error){
            toast.error(result.error)
        } else{
            toast.success('Product updated')
            navigate('/admin/productlist')
        }
    }

    const uploadFileHandler = async (e) => {
        console.log("image", e.target.files[0])
        const formData = new FormData()
        formData.append('image', e.target.files[0])
       try{
            const response = await uploadProductImage(formData).unwrap()
            console.log("response",response)
            toast.success(response.message)
            setImage(response.image) // updating image state
       }catch(err){
            toast.error(err?.data?.message || err.error)
       }

    }
    return(
        <>
           <Link to='/admin/productlist' className='btn btn-light my-3'>Go Back</Link>
           <FormContainer>
                <h1>Edit Product</h1>
                { loadingUpdate && <Loader /> }

                { isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : ( 
                    <Form onSubmit={submitHandler}> 
                        <Form.Group controlId='name' className='my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text' placeholder='Enter name'
                                value = {name} onChange={(e)=>setName(e.target.value)}   
                            />
                        </Form.Group>

                        <Form.Group controlId='price' className='my-2'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type='number' placeholder='Enter price'
                                value = {price} onChange={(e)=>setPrice(e.target.value)}   
                            />
                        </Form.Group>

                            {/* Image Input Placeholder */}

                        <Form.Group controlId='image' className='my-2'>
                            <Form.Label> Image</Form.Label>
                            <Form.Control type='text' placeholder='Enter image url'
                            value={image} onChange={(e)=>setImage}
                            />

                            <Form.Control type='file' label="choose file" 
                            onChange ={uploadFileHandler}/>

                        </Form.Group>

                         <Form.Group controlId='brand' className='my-2'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type='text' placeholder='Enter Brand'
                                value = {brand} onChange={(e)=>setBrand(e.target.value)}   
                            />
                        </Form.Group>

                        <Form.Group controlId='category' className='my-2'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control type='text' placeholder='Enter category'
                                value = {category} onChange={(e)=>setCategory(e.target.value)}   
                            />
                        </Form.Group>

                        <Form.Group controlId='countInStock' className='my-2'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control type='number' placeholder='Enter countInStock'
                                value = {countInStock} onChange={(e)=>setCountInStock(e.target.value)}   
                            />
                        </Form.Group>

                        <Form.Group controlId='description' className='my-2'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type='text' placeholder='Enter description'
                                value = {description} onChange={(e)=>setDescription(e.target.value)}   
                            />
                        </Form.Group>

                        <Button type='submit' variant='primary' className='my-2' >Update</Button>
                    </Form>
                )}
           </FormContainer>
        </>
    )
}
export default ProductEditScreen