import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddSupplier = () => {
    const [supplierName, setSupplierName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [products_supplied, setProducts_supplied] = useState("");
    
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [supplierId, setSupplierId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Check if we have data from the navigation state (edit mode)
    useEffect(() => {
        if (location.state) {
            const { isEditing, supplierId, supplierName, phoneNumber, address, products_supplied } = location.state;

            if (isEditing) {
                setIsEditing(true);
                setSupplierId(supplierId);
                setSupplierName(supplierName);
                setPhoneNumber(phoneNumber);
                setAddress(address);
                setProducts_supplied(products_supplied);
            }
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let url = "http://localhost:8000/src/backend/api/suppliers.php";
            let method = "POST";
            let body = { name: supplierName, phoneNum: phoneNumber, address, products_supplied };

            // If editing, add the ID and use PUT method
            if (isEditing && supplierId) {
                method = "PUT";
                body.id = supplierId;
            }

            const response = await fetch(url, {
                method: method,
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.status === 401) {
                logout(); // Logout if token is expired
                setError('Session expired. Please log in again.');
                navigate('/login', { replace: true });
            }

            const result = await response.json();

            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage(result.message || "Operation successful!");

                // Reset form if it was a new supplier
                if (!isEditing) {
                    setSupplierName("");
                    setPhoneNumber("");
                    setAddress("");
                    setProducts_supplied("");
                }

                // Optionally redirect back to view after success
                setTimeout(() => {
                    navigate('/viewSuppliers');
                }, 2000);
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Navigate back to the Supplier list
        navigate('/viewSuppliers');
    };

    return (
        <div className="container-fluid px-0">
            <div className="row justify-content-center mx-0">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="card-title mb-0 fw-bold">
                                {isEditing ? "Edit Supplier" : "Add Supplier"}
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <div className="form-floating">
                                        <input
                                            id="name"
                                            type="text"
                                            value={supplierName}
                                            className="form-control"
                                            placeholder="Enter supplier name"
                                            onChange={(e) => setSupplierName(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="name">Supplier Name</label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            id="phoneNumber"
                                            value={phoneNumber}
                                            className="form-control"
                                            placeholder="Enter supplier phone number"
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            id="address"
                                            value={address}
                                            className="form-control"
                                            placeholder="Enter supplier address"
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="address">Address</label>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            id="products_supplied"
                                            value={products_supplied}
                                            className="form-control"
                                            placeholder="Enter products supplied"
                                            onChange={(e) => setProducts_supplied(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="products_supplied">Products Supplied</label>
                                    </div>
                                </div>

                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-grow-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {isEditing ? "Updating..." : "Creating..."}
                                            </>
                                        ) : (
                                            <>
                                                <i className={`bi ${isEditing ? 'bi-pencil-fill' : 'bi-plus-circle'} me-2`}></i>
                                                {isEditing ? "Update Supplier" : "Create Supplier"}
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="btn btn-outline-secondary flex-grow-1"
                                    >
                                        <i className="bi bi-x-circle me-2"></i>
                                        Cancel
                                    </button>
                                </div>
                            </form>

                            {message && (
                                <div
                                    className={`alert mt-4 ${message.includes("Error") || message.includes("error") ? "alert-danger" : "alert-success"}`}
                                    role="alert"
                                >
                                    <div className="d-flex align-items-center">
                                        <i className={`bi me-2 ${message.includes("Error") || message.includes("error") ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"}`}></i>
                                        <div>{message}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSupplier;