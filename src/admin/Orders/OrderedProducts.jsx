import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OrderedProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const { products } = location.state;
            setProducts(products);
        }
    }, [location]);
    console.log("products: ", products);

    const commaInPrice = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' L.L';
    };

    const renderMobileCard = (product) => (
        <div className="card mb-3" key={product.id}>
            <div className="card-body p-3">
                <div className="d-flex mb-3">
                    {product.image && (
                        <div className="me-3">
                            <img
                                src={`http://localhost:8000/public/img/products/${product.image}`}
                                alt={product.name}
                                className="rounded"
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <div>
                        <h6 className="card-title mb-1">{product.name}</h6>
                    </div>
                </div>

                <div className="mb-2">
                    <div><strong>Price:</strong> {commaInPrice(product.price)}</div>
                    <div><strong>Cost:</strong> {commaInPrice(product.cost)}</div>
                    <div><strong>Quantity:</strong> {product.quantity}</div>
                </div>
                <div>
                    <div><strong>Subtotal: </strong>{commaInPrice(product.price * product.quantity)}</div>
                </div>
                <hr />
            </div>
        </div>
    );

    return (
        <div className='card shadow'>
            <div className='card-header bg-white  d-flex justify-content-between align-items-center flex-wrap gap-2'>
                <h5 className='card-title mb-0'>Ordered Products</h5>
                {/* Go back btn */}
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Go Back
                    </button>
                </div>
            </div>

            <div className='card-body p-0'>
                <>
                    <div className="d-none d-md-block table-responsive">
                        <table className="table table-hover table-striped mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className='text-center'>Image</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Cost</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        {product.image && (
                                            <td className='text-center'>
                                                <img
                                                    src={`http://localhost:8000/public/img/products/${product.image}`}
                                                    alt={product.name}
                                                    className='rounded'
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                />
                                            </td>
                                        )}
                                        <td>{product.name}</td>
                                        <td>{commaInPrice(product.price)}</td>
                                        <td>{commaInPrice(product.cost)}</td>
                                        <td>{product.quantity}</td>
                                        <td>{commaInPrice(product.price * product.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile card view - visible only on small screens */}
                    <div className="d-md-none p-2">
                        {products.map(renderMobileCard)}
                    </div>

                </>
            </div>
        </div>
    );
}

export default OrderedProducts;