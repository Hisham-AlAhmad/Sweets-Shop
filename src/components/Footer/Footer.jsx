import './footer.css';

const Footer = () => {
    return (
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
                            <a className="btn btn-lg btn-primary me-2" href="#"><i className="fab fa-whatsapp"></i></a>
                            <a className="btn btn-lg btn-primary me-2" href="#"><i className="fab fa-instagram"></i></a>
                            <a className="btn btn-lg btn-primary me-2" href="#"><i className="fab fa-facebook-f"></i></a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mx-auto">
                        <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Quick Links</h4>
                        <a className="btn btn-link" href="/">Home</a>
                        <a className="btn btn-link" href="/menu">Menu</a>
                        <a className="btn btn-link" href="/contact">Contact</a>
                        <a className="btn btn-link" href="/cart">Cart</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;