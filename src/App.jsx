import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './static/css/style.css'
import './static/css/bootstrap.min.css'
import './static/js/main.js'
import Spinner from './components/Spinner'
import Navbar from './components/Navbar'
import Home from './components/Home.jsx'
import Footer from './components/Footer.jsx'
import About from './components/About.jsx'
import NotFound from './components/NotFound.jsx'

function App() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <>
            <div className="app-container">
                {loading && <Spinner />}
                <Navbar />

                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                
                <Footer />
                <a href="#" className="btn btn-lg btn-primary back-to-top"><i className="bi bi-arrow-up"></i></a>
            </div>
        </>
    )
}

export default App;
