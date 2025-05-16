import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
    function whatsapp() {
        const message = "Hello! I’d like to inquire about your products and place an order. Looking forward to your assistance. – Fresh Time";
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "96176763445";
        const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(waLink, '_blank');
    }
    function instagram() {
        window.open('https://www.instagram.com/freshtime72/', '_blank');
    }

    return (
        <>
            <div className="container-fluid bg-dark text-light footer pt-2 mt-5 wow fadeIn" data-wow-delay="0.1s">
                <div className="container py-4">
                    <div className="row g-5">
                        <div className="col-lg-3 col-md-6 mx-auto">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Opening</h4>
                            <h5 className="text-light fw-normal">Everyday</h5>
                            <p>5:00 PM - 11:00 PM</p>
                            <img className="h-auto w-25 w-lg-50 m-auto" src="/img/freshTime_noBg.png" alt="logo image" />
                        </div>
                        <div className="col-lg-3 col-md-6 mx-auto">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Contact</h4>
                            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Al Rachideia Camp, Fresh Time</p>
                            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+961 76 763 445</p>
                            <div className="d-flex pt-2">
                                <Link className="btn btn-lg btn-primary me-2" onClick={() => whatsapp()}><i className="fab fa-whatsapp"></i></Link>
                                <Link className="btn btn-lg btn-primary me-2" onClick={() => instagram()}><i className="fab fa-instagram"></i></Link>
                                {/* <a className="btn btn-lg btn-primary me-2" href="#"><i className="fab fa-facebook-f"></i></a> */}
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 mx-auto d-none d-md-block">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Quick Links</h4>
                            <Link className="btn btn-link" to="/">Home</Link>
                            <Link className="btn btn-link" to="/menu">Menu</Link>
                            <Link className="btn btn-link" to="/contact">Contact</Link>
                            <Link className="btn btn-link" to="/cart">Cart</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className='lines'>
                <div style={{ height: "2px", backgroundColor: "#b4ff9f", marginBottom: "5px" }}></div>
                <div style={{ height: "3px", backgroundColor: "#8aff50", marginBottom: "5px" }}></div>
                <div style={{ height: "4px", backgroundColor: "#ffff99", marginBottom: "5px" }}></div>
                <div style={{ height: "5px", backgroundColor: "#ffff50", marginBottom: "5px" }}></div>
                <div style={{ height: "6px", backgroundColor: "#ffd966", marginBottom: "5px" }}></div>
                <div style={{ height: "7px", backgroundColor: "#ff9d00", marginBottom: "5px" }}></div>
                <div style={{ height: "8px", backgroundColor: "#ff6b00", marginBottom: "5px" }}></div>
            </div>
        </>
    );
}

export default Footer;