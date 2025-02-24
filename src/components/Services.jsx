const Services = () => {
    return ( 
        <div className="container-xxl py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-3 col-sm-6 mx-auto wow fadeInUp" data-wow-delay="0.1s">
                        <div className="service-item rounded pt-3">
                            <div className="p-4">
                                <i className="fa fa-3x fa-headset text-primary mb-4"></i>
                                <h5>Available Everyday</h5>
                                <p>From 5:00 PM to 11:00 PM</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 mx-auto wow fadeInUp" data-wow-delay="0.3s">
                        <div className="service-item rounded pt-3">
                            <div className="p-4">
                                <i className="fa fa-3x fa-utensils text-primary mb-4"></i>
                                <h5>Quality Food</h5>
                                <p>Try it & you won't regret</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 mx-auto wow fadeInUp" data-wow-delay="0.5s">
                        <div className="service-item rounded pt-3">
                            <div className="p-4">
                                <i className="fa fa-3x fa-cart-plus text-primary mb-4"></i>
                                <h5>Delivery Order</h5>
                                <p>Only for 20,000 L.L</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Services;