import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const EditProfile = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const getUsername = () => {
        const username = localStorage.getItem('username');
        setUsername(username);
    }

    const getImage = () => {
        const image = localStorage.getItem('image');
        if (image) {
            setImagePreview(`http://localhost:8000/public/img/user/${image}`);
        } else {
            setImagePreview(null);
        }
    }

    useEffect(() => {
        getUsername();
        getImage();
    }, []);

    const handleSubmit = async (e) => {
        // Prevent default form submission
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You will update your profile!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
        });

        if (result.isConfirmed) {
            try {
                setIsLoading(true);

                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);
                if (image instanceof File) {
                    formData.append('image', image);
                }
                formData.append("_method", "PUT");

                const response = await fetch(`http://localhost:8000/src/backend/api/admin.php?action=update`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.status === 401) {
                    logout();
                    setMessage('Session expired. Please log in again.');
                    navigate('/login', { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setMessage(result.message);

                    Swal.fire('Updated!', 'Your profile has been updated.', 'success');

                    setTimeout(() => {
                        setMessage('Logging out...');
                        logout();
                        navigate('/login', { replace: true });
                    }, 3000);
                } else {
                    setMessage(result.error || 'Failed to update profile');
                    Swal.fire('Error!', result.error || 'Failed to update profile', 'error');
                }
            } catch (err) {
                console.error('Error updating profile:', err);
                setMessage('An error occurred while updating your profile');
                Swal.fire('Error!', 'Something went wrong while updating.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 col-xxl-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="mt-3 mb-1 fw-bold text-primary">Edit Profile</h2>
                            </div>

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

                            <form onSubmit={handleSubmit}>
                                {/* Username */}
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label text-muted small fw-semibold">USERNAME</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="bi bi-person-fill text-muted"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-start-0"
                                            id="username"
                                            name="username"
                                            placeholder="Enter your username"
                                            onChange={(e) => setUsername(e.target.value)}
                                            value={username}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label htmlFor="password" className="form-label text-muted small fw-semibold">PASSWORD</label>
                                    </div>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="bi bi-lock-fill text-muted"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control bg-light border-start-0"
                                            id="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <label htmlFor="image" className="form-label text-muted small fw-semibold">IMAGE</label>
                                    </div>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="bi bi-image text-muted"></i>
                                        </span>
                                        <input
                                            type="file"
                                            className="form-control bg-light border-start-0"
                                            id="image"
                                            name="image"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setImage(e.target.files[0]);
                                                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                                                }
                                            }}
                                        />
                                    </div>
                                    {/* Note */}
                                    <small className="text-muted mt-2">
                                        <strong>Note: </strong>The image needs to be square
                                    </small>
                                    {imagePreview && (
                                        <div className="mt-3 text-center">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '250px',
                                                    maxHeight: '250px',
                                                    objectFit: 'cover',
                                                    borderRadius: '5px'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary py-3 fw-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating...
                                            </>
                                        ) : "Confirm"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;