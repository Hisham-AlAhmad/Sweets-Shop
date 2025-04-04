import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [createdDate, setCreatedDate] = useState(new Date());

    const location = useLocation();
    const navigate = useNavigate();

    // Check if we have data from the navigation state (edit mode)
    useEffect(() => {
        if (location.state) {
            const { isEditing, categoryId, categoryName, createdAt } = location.state;

            if (isEditing) {
                setIsEditing(true);
                setCategoryId(categoryId);
                setCategoryName(categoryName);
                setCreatedDate(new Date(createdAt));
            }
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let url = "http://localhost:8000/src/backend/api/category.php";
            let method = "POST";
            let body = { name: categoryName };

            // If editing, add the ID and use PUT method
            if (isEditing && categoryId) {
                method = "PUT";
                body.id = categoryId;
            }

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage(result.message || "Operation successful!");

                // Reset form if it was a new category
                if (!isEditing) {
                    setCategoryName("");
                }

                // Optionally redirect back to view after success
                setTimeout(() => {
                    navigate('/viewCategory');
                }, 1500);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleCancel = () => {
        // Navigate back to the category list
        navigate('/viewCategory');
    };

    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    return (
        <div className="registration-form">
            <div>
                <form onSubmit={handleSubmit} className="shadow">
                    <h3>{isEditing ? "Edit Category" : "Add Category"}</h3>
                    <br />
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Category"
                            id="name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                        <label htmlFor="name">Category Name</label>
                    </div>
                    <br />

                    <div className="form-group">
                        <p><b>{isEditing ? "Created on: " : "Created in: "}</b>
                            {formatDate(createdDate)}
                        </p>
                    </div>

                    <div className="form-group d-flex gap-2">
                        <input
                            type="submit"
                            value={isEditing ? "Update Category" : "Create Category"}
                            className="btn btn-block create-btn"
                        />

                        {isEditing && 
                        <input
                            type="submit"
                            value="Cancel"
                            onClick={handleCancel}
                            className="btn btn-block create-btn-outline"
                        />
                        }
                    </div>
                </form>

                {message && (
                    <div
                        className={`alert mt-3 text-center ${message.includes("error") ? "alert-danger" : "alert-success"}`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddCategory;