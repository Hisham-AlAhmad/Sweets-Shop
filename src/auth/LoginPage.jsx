import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [key, setKey] = useState('');
    const { login, isAuthenticated } = useAuth();
    const expiresAt = localStorage.getItem('expiresAt');
    const location = useLocation();
    const navigate = useNavigate();

    // Check if we have data from the regiteration state
    useEffect(() => {
        if (location.state) {
            const { isRegistering } = location.state;
            setIsRegistering(isRegistering);
        }
    }, [location]);

    const goToRegister = () => {
        navigate('/login', {
            state: {
                isRegistering: true
            }
        });
    };

    const goToLogin = () => {
        navigate('/login', {
            state: {
                isRegistering: false
            }
        });
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/src/backend/api/admin.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, setup_key: key }),
            });

            const result = await response.json();

            if (result.error) {
                setMessage(result.error);
            }
            else {
                setMessage(result.message);

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('expiresAt:', Date(expiresAt));
        console.log('isAuthenticated:', isAuthenticated);

        try {
            const success = await login(username, password);
            if (success) {
                setMessage('Login successful! Redirecting...');
                navigate('/dashboard');
            } else {
                setMessage('Error: Invalid Username or Password');
            }
        } catch (err) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                                    <h2 className="mt-3 mb-1 fw-bold text-primary">{isRegistering ? 'Create an Account' : 'Welcome Back'}</h2>
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

                                <form onSubmit={isRegistering ? handleRegister : handleSubmit}>
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

                                    {isRegistering && (
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label htmlFor="key" className="form-label text-muted small fw-semibold">SETUP KEY</label>
                                            </div>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <i className="bi bi-key-fill text-muted"></i>
                                                </span>
                                                <input
                                                    type="key"
                                                    className="form-control bg-light border-start-0"
                                                    id="key"
                                                    name="key"
                                                    placeholder="Enter your key"
                                                    onChange={(e) => setKey(e.target.value)}
                                                    value={key}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

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
                                            ) : isRegistering ? "Register" : "Log In"}
                                        </button>
                                    </div>
                                    <div className="text-center mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-link text-decoration-none"
                                            onClick={isRegistering ? goToLogin : goToRegister}
                                        >
                                            {isRegistering ? "Log In" : "Register"}
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