import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <Link
            to="#"
            className={`btn btn-lg btn-primary back-to-top ${isVisible ? 'show' : ''}`}
            onClick={scrollToTop}
        >
            <i className="bi bi-arrow-up"></i>
        </Link>
    );
};

export default BackToTop;