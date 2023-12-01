import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

const SearchBox = () => {

    const navigate = useNavigate();

    const { keyword: urlkeyword} = useParams()
    const [keyword, setKeyword] = useState( urlkeyword || '')

    const submitHandler = (e) =>{
        e.preventDefault()
        if(keyword.trim()){
            setKeyword('')
            navigate(`/search/${keyword}`)
        } else{
            navigate('/ ')
        }
    }

    return(
        <Form onSubmit = { submitHandler} className='d-flex'>
            <Form.Group controlId='search' className='my-2'>
                <Form.Control type='text' placeholder='Search Products...'
                    name = 'q' value = {keyword} 
                    onChange = {(e) => setKeyword(e.target.value)}
                    className='mr-sm-2 ml-sm-5'
                />
            </Form.Group>
            <Button type='submit' variant='outline-light' className='mx-2'
            style={{ marginTop:"10px", height:'3rem'}}>
                Search</Button>
        </Form>
    )

}

export default SearchBox;