import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const expiresAt = localStorage.getItem('expiresAt');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('expiresAt:', Date(expiresAt));
        console.log('isAuthenticated:', isAuthenticated);

        try {
            const success = await login(username, password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Invalid Username or Password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }

        // ********** To add an admin uncomment this **********
        // const response = await fetch('http://localhost:8000/src/backend/api/admin.php?action=register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ username, password, setup_key: 'secure_setup_key' }),
        // });
        // const data = await response.json();
        // console.log(data);
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xxl-4">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <img
                                        src={`http://localhost:8000/public/img/freshTime_noBg.png`}
                                        style={{ maxHeight: "150px" }}
                                        className="img-fluid"
                                        alt="FreshTime Logo"
                                    />
                                    <h2 className="mt-3 mb-1 fw-bold text-primary">Welcome Back</h2>
                                    <p className="text-muted">Login to access your admin dashboard</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error}
                                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
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

                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary py-3 fw-semibold"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Logging in...
                                                </>
                                            ) : "Log In"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;