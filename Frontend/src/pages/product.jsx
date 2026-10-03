import React from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Product() {
const [product, setProduct] = React.useState(null);
const {id}=useParams()
const FetchProduct = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        const data = await response.data;
        setProduct(data.product);
    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

React.useEffect(() => {
    FetchProduct();
}, []);
return (
    <div className='bg-pink-200 border border-green-300 rounded-lg shadow-md p-3' >
        {product ? (
            <>
                <img src={product.productImage} alt={product.name} className='w-full h-48 object-cover rounded-md' />        
                <h3 className='text-lg font-bold mt-2'>{product.name}</h3>
                <p className='text-gray-600 mt-1'>{product.description}</p>
            </>
        ) : (
            <p className='text-center'>Loading product...</p>
        )}
    </div>

)
}

export default Product