import { React, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function ProductsComponenet() {
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/products/all`);
            const data = response.data;
            if (data.success === true) {
                const fetchedProducts = data.products;
                console.log('Fetched products:', fetchedProducts);
                setProducts(fetchedProducts);
            } else {
                console.error('Failed to fetch products:', data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);
   
    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-10 px-25 py-10'>
                {
                    products ? products.map((product, key) =>
                        <Link to={`/product/${product._id}`}>
                            <div key={key} className='w-80 bg-pink-200 border border-green-300 rounded-lg shadow-md p-3' >
                                <img src={product.productImage} alt={product.name} className='w-full h-full object-cover rounded-md' />
                                <h3 className='text-lg font-bold mt-2'>{product.name}</h3>
                                <p className='text-gray-600 mt-1'>{product.description}</p>
                                <span className='text-sm text-gray-500 mt-1'>Stock: {product.stock > 0 ? <span className='p-1 w-10 border rounded-xl border-green-300 bg-green-100 text-green-500'>Available</span> : <span className='p-1 bg-red-100 border rounded-xl border-red-300 text-red-500'>Out of Stock</span>}</span>
                                <div className='flex items-center justify-between mt-2'>
                                    <span className='text-xl font-bold text-green-500'>${product.discountPrice}</span>
                                    <span className='text-lg text-gray-500 line-through'>${product.price}</span>
                                </div>
                                <button className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mt-2'>
                                    Add to Cart
                                </button>
                            </div>
                        </Link>
                    )
                        :
                        <p>Loading products...</p>
                }

            </div>

        </>
    )
}

export default ProductsComponenet