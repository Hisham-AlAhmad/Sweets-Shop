import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddProduct = () => {
    // Basic product info
    const [productName, setProductName] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [description, setDescription] = useState("");
    const [availability, setAvailability] = useState(true);

    // Pricing method
    const [pricingMethod, setPricingMethod] = useState("weight"); // "weight" or "sizes"
    const [weightPrice, setWeightPrice] = useState("");

    // Categories handling
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    // Sizes handling
    const [sizes, setSizes] = useState([]);
    const [productSizes, setProductSizes] = useState([]);
    const [selectedSizeId, setSelectedSizeId] = useState("");
    const [sizePrice, setSizePrice] = useState("");

    // Form states
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [productId, setProductId] = useState(null);
    const [createdDate, setCreatedDate] = useState(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Load categories and sizes on mount
    useEffect(() => {
        fetchCategories();
        fetchSizes();
    }, []);

    // Check if we have data from the navigation state (Edit mode)
    useEffect(() => {
        if (location.state) {
            const { isEditing, productId, productName, image, description,
                weightPrice, availability, createdAt,
                productCategories, productSizes } = location.state;

            if (isEditing) {
                setIsEditing(true);
                setProductId(productId);
                setProductName(productName);
                setProductImage(image);
                setDescription(description || "");
                setAvailability(availability === 1);
                setCreatedDate(new Date(createdAt));

                // Set image preview if there's an existing image
                if (image) {
                    setImagePreview(`http://localhost:8000/public/img/products/${image}`);
                }

                // Set selected categories if any
                if (productCategories && productCategories.length > 0) {
                    setSelectedCategories(productCategories);
                }

                // Determine pricing method based on data
                if (productSizes && productSizes.length > 0) {
                    setPricingMethod("sizes");
                    setProductSizes(productSizes);
                } else {
                    setPricingMethod("weight");
                    setWeightPrice(weightPrice || "");
                }
            }
        }
    }, [location]);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8000/src/backend/api/category.php");

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSizes = async () => {
        try {
            const response = await fetch("http://localhost:8000/src/backend/api/sizes.php");

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setSizes(data);
        } catch (error) {
            console.error("Error fetching sizes:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePricingMethodChange = (method) => {
        setPricingMethod(method);
        // Reset the other pricing method's data
        if (method === "weight") {
            setProductSizes([]);
        } else {
            setWeightPrice("");
        }
    };

    const handleAddCategory = () => {
        if (!selectedCategoryId) return;

        // Find the selected category from our categories list
        const categoryToAdd = categories.find(cat => cat.id === selectedCategoryId);

        // Check if already selected
        if (!selectedCategories.some(cat => cat.id === selectedCategoryId)) {
            setSelectedCategories([...selectedCategories, categoryToAdd]);
            setSelectedCategoryId(""); // Reset selection
        }
    };

    const handleRemoveCategory = (categoryId) => {
        setSelectedCategories(selectedCategories.filter(cat => cat.id !== categoryId));
    };

    const handleAddSize = () => {
        if (!selectedSizeId || !sizePrice || isNaN(sizePrice)) return;

        // Find the selected size from our sizes list
        const sizeToAdd = sizes.find(size => size.id === selectedSizeId);

        // Check if already selected
        if (!productSizes.some(item => item.size_id === selectedSizeId)) {
            setProductSizes([
                ...productSizes,
                {
                    size_id: selectedSizeId,
                    size_name: sizeToAdd.name,
                    price: sizePrice
                }
            ]);

            // Reset inputs
            setSelectedSizeId("");
            setSizePrice("");
        }
    };

    const handleRemoveSize = (sizeId) => {
        setProductSizes(productSizes.filter(item => item.size_id !== sizeId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create form data for multipart submission (for the image)
            const formData = new FormData();
            formData.append("name", productName);
            formData.append("description", description);
            formData.append("availability", availability ? 1 : 0);
            formData.append("pricing_method", pricingMethod);

            // Add the appropriate pricing data based on the selected method
            if (pricingMethod === "weight") {
                formData.append("weight_price", weightPrice);
            } else {
                formData.append("weight_price", 0); // Set to 0 or null for size-based pricing
                formData.append("product_sizes", JSON.stringify(productSizes));
            }

            // Append categories as JSON string
            formData.append("categories", JSON.stringify(selectedCategories.map(cat => cat.id)));

            // Only append image if it's set or changed
            if (productImage) {
                formData.append("image", productImage);
            }

            let url = "http://localhost:8000/src/backend/api/products.php";
            let method = "POST";

            // If editing, add the ID and use PUT method
            if (isEditing) {
                formData.append("id", productId);
                formData.append("_method", "PUT");
            }

            const response = await fetch(url, {
                method: method,
                body: formData,
            });

            const result = await response.json();

            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage(result.message || "Operation successful!");

                // Reset form if it was a new product
                if (!isEditing) {
                    resetForm();
                }

                // Redirect back to view after success
                setTimeout(() => {
                    navigate('/viewProducts');
                }, 2000);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setProductName("");
        setProductImage(null);
        setImagePreview("");
        setDescription("");
        setPricingMethod("weight");
        setWeightPrice("");
        setAvailability(true);
        setSelectedCategories([]);
        setProductSizes([]);
    };

    const handleCancel = () => {
        // Navigate back to the product list
        navigate('/viewProducts');
    };

    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    return (
        <div className="container-fluid px-0">
            <div className="row justify-content-center mx-0">
                <div className="col-12 col-lg-8">
                    <div className="card shadow mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="card-title mb-0 fw-bold">
                                {isEditing ? "Edit Product" : "Add Product"}
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                { productId && <div className="mb-2">ID: {productId}</div>}
                                {/* Product Name */}
                                <div className="mb-3">
                                    <div className="form-floating">
                                        <input
                                            id="name"
                                            type="text"
                                            value={productName}
                                            className="form-control"
                                            placeholder="Enter Product Name"
                                            onChange={(e) => setProductName(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="name">Product Name</label>
                                    </div>
                                </div>

                                {/* Product Image */}
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">Product Image</label>
                                    <input
                                        id="image"
                                        type="file"
                                        className="form-control"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        required={!isEditing}
                                    />

                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview}
                                                alt="Product Preview"
                                                className="img-thumbnail"
                                                style={{ maxHeight: "200px" }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <div className="form-floating">
                                        <textarea
                                            id="description"
                                            className="form-control"
                                            value={description}
                                            placeholder="Enter Description"
                                            onChange={(e) => setDescription(e.target.value)}
                                            style={{ height: "100px" }}
                                        ></textarea>
                                        <label htmlFor="description">Description</label>
                                    </div>
                                </div>

                                {/* Pricing Method Selection */}
                                <div className="card mb-4">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0">Pricing Method</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex mb-3">
                                            <div className="form-check me-4">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="pricingMethod"
                                                    id="pricingMethodWeight"
                                                    value="weight"
                                                    checked={pricingMethod === "weight"}
                                                    onChange={() => handlePricingMethodChange("weight")}
                                                />
                                                <label className="form-check-label" htmlFor="pricingMethodWeight">
                                                    Price by Weight
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="pricingMethod"
                                                    id="pricingMethodSizes"
                                                    value="sizes"
                                                    checked={pricingMethod === "sizes"}
                                                    onChange={() => handlePricingMethodChange("sizes")}
                                                />
                                                <label className="form-check-label" htmlFor="pricingMethodSizes">
                                                    Price by Sizes
                                                </label>
                                            </div>
                                        </div>

                                        {/* Weight Price Input (shown only when weight pricing is selected) */}
                                        {pricingMethod === "weight" && (
                                            <div className="mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        id="weight_price"
                                                        type="number"
                                                        className="form-control"
                                                        value={weightPrice}
                                                        placeholder="Enter Weight Price"
                                                        onChange={(e) => setWeightPrice(e.target.value)}
                                                        min="0"
                                                        step="0.01"
                                                        required={pricingMethod === "weight"}
                                                    />
                                                    <label htmlFor="weight_price">Price per Unit Weight (Kg)</label>
                                                </div>
                                            </div>
                                        )}

                                        {/* Sizes and Prices (shown only when size pricing is selected) */}
                                        {pricingMethod === "sizes" && (
                                            <div>
                                                <div className="row g-2 mb-3">
                                                    <div className="col">
                                                        <select
                                                            className="form-select"
                                                            value={selectedSizeId}
                                                            onChange={(e) => setSelectedSizeId(e.target.value)}
                                                        >
                                                            <option value="">Select Size</option>
                                                            {sizes.map(size => (
                                                                <option key={size.id} value={size.id}>
                                                                    {size.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col">
                                                        <div className="input-group">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Price (L.L)"
                                                                value={sizePrice}
                                                                onChange={(e) => setSizePrice(e.target.value)}
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-auto">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary"
                                                            onClick={handleAddSize}
                                                        >
                                                            <i className="bi bi-plus-circle me-1"></i>
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Display Added Sizes with Prices */}
                                                {productSizes.length > 0 ? (
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered table-sm">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>Size</th>
                                                                    <th>Price</th>
                                                                    <th width="80">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {productSizes.map(item => (
                                                                    <tr key={item.size_id}>
                                                                        <td>{item.size_name}</td>
                                                                        <td>{item.price}</td>
                                                                        <td>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-outline-danger"
                                                                                onClick={() => handleRemoveSize(item.size_id)}
                                                                            >
                                                                                <i className="bi bi-trash"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="alert alert-info">
                                                        <i className="bi bi-info-circle me-2"></i>
                                                        Add at least one size with its price
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Categories Selection */}
                                <div className="card mb-4">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0">Product Categories</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-2 mb-3">
                                            <div className="col">
                                                <select
                                                    className="form-select"
                                                    value={selectedCategoryId}
                                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-auto">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    onClick={handleAddCategory}
                                                >
                                                    <i className="bi bi-plus-circle me-1"></i>
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Selected Categories Display */}
                                        {selectedCategories.length > 0 ? (
                                            <div className="selected-categories">
                                                <div className="d-flex flex-wrap gap-2">
                                                    {selectedCategories.map(category => (
                                                        <span
                                                            key={category.id}
                                                            className="badge bg-secondary d-flex align-items-center"
                                                        >
                                                            {category.name}
                                                            <button
                                                                type="button"
                                                                className="btn-close btn-close-white ms-2"
                                                                aria-label="Remove"
                                                                onClick={() => handleRemoveCategory(category.id)}
                                                                style={{ fontSize: '0.65rem' }}
                                                            ></button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="alert alert-info">
                                                <i className="bi bi-info-circle me-2"></i>
                                                Add at least one category
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Availability Toggle */}
                                <div className="mb-4 form-check form-switch">
                                    <input
                                        id="availability"
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={availability}
                                        onChange={(e) => setAvailability(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="availability">
                                        Product Available
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <p className="mb-1 text-muted">
                                        <i className="bi bi-calendar3 me-2"></i>
                                        <span>{isEditing ? "Created on: " : "Will be created on: "}</span>
                                        <span className="fw-medium">{formatDate(createdDate)}</span>
                                    </p>
                                </div>

                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-grow-1"
                                        disabled={isSubmitting || (pricingMethod === "sizes" && productSizes.length === 0)
                                            || selectedCategories.length === 0 || !productName || !productImage }
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {isEditing ? "Updating..." : "Creating..."}
                                            </>
                                        ) : (
                                            <>
                                                <i className={`bi ${isEditing ? 'bi-pencil-fill' : 'bi-plus-circle'} me-2`}></i>
                                                {isEditing ? "Update Product" : "Create Product"}
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

export default AddProduct;