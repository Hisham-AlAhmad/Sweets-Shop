import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    // State variables for form fields - ensure they always have string/boolean values
    const [openingTime, setOpeningTime] = useState("");
    const [closingTime, setClosingTime] = useState("");
    const [daysOpen, setDaysOpen] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [deliveryCost, setDeliveryCost] = useState("");
    const [storeAddress, setStoreAddress] = useState("");
    const [phoneNum, setPhoneNum] = useState("");

    // UI state
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messageType, setMessageType] = useState(""); // success or error
    const [isLoading, setIsLoading] = useState(true);

    const { logout } = useAuth();
    const navigate = useNavigate();

    // Fetch current settings on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:8000/src/backend/api/settings.php", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.status === 401) {
                    logout();
                    navigate('/login', { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch settings');
                }

                const data = await response.json();
                console.log("Fetched settings:", data);
                // Update state with fetched data
                if (data) {
                    setOpeningTime(data.opening_time || "");
                    setClosingTime(data.closing_time || "");
                    setDaysOpen(data.days_open || "");
                    // Convert numeric database value to boolean
                    setIsOpen(data.is_open == 1);
                    setDeliveryCost(data.delivery_cost?.toString() || "");
                    setStoreAddress(data.store_address || "");
                    setPhoneNum(data.phoneNum || "");
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                setMessage("Failed to load settings. Please try again later.");
                setMessageType("error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            // Format data for API request
            const formData = {
                openingTime,
                closingTime,
                daysOpen,
                isOpen: isOpen === true || isOpen === "true",
                deliveryCost: Number(deliveryCost),
                storeAddress,
                phoneNum
            };

            // Send PUT request to update settings
            const response = await fetch("http://localhost:8000/src/backend/api/settings.php", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 401) {
                logout();
                navigate('/login', { replace: true });
                return;
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Display success message
            setMessage(data.message || "Settings updated successfully");
            setMessageType("success");

            // Add a delay to show success message
            setTimeout(() => {
                // If you want to navigate somewhere after update, do it here
                // navigate('/dashboard');
            }, 2000);
        } catch (error) {
            console.error("Error updating settings:", error);
            setMessage(error.message || "Failed to update settings");
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle isOpen as a select dropdown for better user interface
    const handleIsOpenChange = (e) => {
        setIsOpen(e.target.value === "true");
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading store Settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0">
            <div className="row justify-content-center mx-0">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">
                                <i className="bi bi-gear-fill me-2 text-primary"></i>
                                Store Settings
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Store Details Section */}
                                <div className="card mb-4">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0">
                                            <i className="ti ti-building-store me-2"></i>
                                            Store Details
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        {/* Store Status */}
                                        <h6 className="mb-3">
                                            Store Status:
                                        </h6>
                                        <label className="mb-4 switch">
                                            <input
                                                id="availability"
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={isOpen}
                                                onChange={(e) => setIsOpen(e.target.checked)}
                                            />
                                            <div className="slider"></div>
                                            <div className="slider-card">
                                                <div className="slider-card-face slider-card-front"></div>
                                                <div className="slider-card-face slider-card-back"></div>
                                            </div>
                                        </label>
                                        <label htmlFor="availability" className={`form-label ms-2 fw-bold ${isOpen ? "text-success" : "text-danger"}`}>
                                            {isOpen ? "Opened" : "Closed"}
                                        </label>

                                        {/* Store Address */}
                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id="storeAddress"
                                                    type="text"
                                                    value={storeAddress}
                                                    className="form-control"
                                                    placeholder="Enter store address"
                                                    onChange={(e) => setStoreAddress(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="storeAddress">Store Address</label>
                                            </div>
                                        </div>

                                        {/* Phone Number */}
                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id="phoneNum"
                                                    type="text"
                                                    pattern="[0-9]*"
                                                    value={phoneNum}
                                                    className="form-control"
                                                    placeholder="Enter phone number"
                                                    onChange={(e) => setPhoneNum(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="phoneNum">Phone Number</label>
                                                <small className="text-muted">
                                                    <strong>Format: </strong>961XXXXXXXX
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Business Hours Section */}
                                <div className="card mb-4">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0">
                                            <i className="ti ti-clock-hour-4 me-2"></i>
                                            Business Hours
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        {/* Opening Time */}
                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id="openingTime"
                                                    type="text"
                                                    value={openingTime}
                                                    className="form-control"
                                                    placeholder="Enter opening time"
                                                    onChange={(e) => setOpeningTime(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="openingTime">Opening Time</label>
                                                <small className="text-muted">
                                                    <strong>Format: </strong>00:00 PM/AM
                                                </small>
                                            </div>
                                        </div>

                                        {/* Closing Time */}
                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id="closingTime"
                                                    type="text"
                                                    value={closingTime}
                                                    className="form-control"
                                                    placeholder="Enter closing time"
                                                    onChange={(e) => setClosingTime(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="closingTime">Closing Time</label>
                                                <small className="text-muted">
                                                    <strong>Format: </strong>00:00 PM/AM
                                                </small>
                                            </div>
                                        </div>

                                        {/* Days Open */}
                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id="daysOpen"
                                                    type="text"
                                                    value={daysOpen}
                                                    className="form-control"
                                                    placeholder="Enter days open"
                                                    onChange={(e) => setDaysOpen(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="daysOpen">Days Open</label>
                                                <small className="text-muted">
                                                    <strong>Format: </strong>Monday - Saturday <strong>OR</strong> Everyday
                                                </small>
                                                <br />
                                                <small className="text-muted">
                                                    <strong>Week Days: </strong>Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Section */}
                                <div className="card mb-4">
                                    {/* Delivery Cost */}
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0">
                                            <i className="ti ti-truck me-2"></i>
                                            Delivery Cost
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <div className="form-floating">
                                                <input
                                                    id="deliveryCost"
                                                    type="number"
                                                    value={deliveryCost}
                                                    className="form-control"
                                                    placeholder="Enter delivery cost"
                                                    onChange={(e) => setDeliveryCost(e.target.value)}
                                                    required
                                                />
                                                <label htmlFor="deliveryCost">Delivery Cost</label>
                                                <small className="text-muted">
                                                    <strong>Format: </strong>Enter a number without commas (e.g., 20000)
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-grow-1"
                                        disabled={isSubmitting || openingTime === "" || closingTime === ""}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-save me-2"></i>
                                                Save Settings
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Message Alert */}
                            {message && (
                                <div
                                    className={`alert mt-4 ${messageType === "success" ? "alert-success" : "alert-danger"}`}
                                    role="alert"
                                >
                                    <div className="d-flex align-items-center">
                                        <i className={`bi me-2 ${messageType === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
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

export default Settings;