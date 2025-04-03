import { useState } from "react";

const AddSupplier = () => {
    const [supplierName, setSupplierName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [products_supplied, setProducts_supplied] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/src/backend/api/suppliers.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: supplierName, phoneNum: phoneNumber }),
        });

        const result = await response.json();
        setMessage(result.message || result.error);
    };

    return (
        <div className="registration-form">
            <div>
                {/* <h2>Add Category</h2> */}
                <form onSubmit={handleSubmit}>
                    <h4>Add Supplier's details</h4>
                    <br />
                    <div className="form-floating">
                        <input type="text" className="form-control" placeholder="Enter supplier name" id="name"
                            value={supplierName} onChange={(e) => setSupplierName(e.target.value)}
                        />
                        <label htmlFor="name">Name</label>
                    </div>
                    <br />

                    <div className="form-floating">
                        <input type="number" className="form-control" placeholder="Enter supplier phone number" id="phoneNumber"
                            value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <label htmlFor="phoneNumber">Phone Number</label>
                    </div>
                    <br />

                    <div className="form-floating">
                        <input type="text" className="form-control" placeholder="Enter supplier address" id="address"
                            value={address} onChange={(e) => setAddress(e.target.value)}
                        />
                        <label htmlFor="address">Address</label>
                    </div>
                    <br />

                    <div className="form-floating">
                        <input type="text" className="form-control" placeholder="Enter supplier address" id="products_supplied"
                            value={products_supplied} onChange={(e) => setProducts_supplied(e.target.value)}
                        />
                        <label htmlFor="products_supplied">Products Supplied</label>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Add Supplier" className="btn btn-block create-btn" />
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default AddSupplier;

