import {Spinner} from 'react-bootstrap';

const Loader = () => {

    return(
        <>
            <Spinner animation='border' role = 'status'
                style={{margin:'auto', height:'100px', width: '100px',
                display:'block'}}
            >
            </Spinner>
        </>
    )
}

export default Loader;