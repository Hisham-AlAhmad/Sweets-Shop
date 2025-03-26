import { useState } from "react";
import './addCategory.css';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/src/backend/api/Category.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: categoryName }),
        });

        const result = await response.json();
        setMessage(result.message || result.error);
    };

    return (
        <div className="registration-form">
            <div>
                {/* <h2>Add Category</h2> */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text" className="form-control item"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Category Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <p><b>Created in:  </b>
                            {new Date().toLocaleDateString()}
                        </p>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Category" className="btn btn-block create-category" />
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default AddCategory;

