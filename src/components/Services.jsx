const Services = () => {
    return ( 
        <div className="container-xxl py-3">
            <div className="container">
                <div className="row g-4 justify-content-center">
                    {/* First Service */}
                    <div className="col-lg-3 col-sm-4 mx-auto wow fadeInUp" data-wow-delay="0.1s">
                        <ServiceItem icon="fa-headset" title="Available Everyday" text="From 5:00 PM to 11:00 PM" />
                    </div>

                    {/* Middle Service (Hidden on Phones) */}
                    <div className="col-lg-3 col-sm-4 mx-auto d-none d-sm-block wow fadeInUp" data-wow-delay="0.3s">
                        <ServiceItem icon="fa-utensils" title="Quality Food" text="Try it & you won't regret" />
                    </div>

                    {/* Third Service */}
                    <div className="col-lg-3 col-sm-4 mx-auto wow fadeInUp" data-wow-delay="0.5s">
                        <ServiceItem icon="fa-cart-plus" title="Delivery Order" text="Only for 20,000 L.L" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Reusable Service Item Component */
const ServiceItem = ({ icon, title, text }) => (
    <div className="service-item rounded pt-2">
        <div className="p-3 text-center">
            <i className={`fa fa-2x ${icon} text-primary mb-3`}></i>
            <h6>{title}</h6>
            <p>{text}</p>
        </div>
    </div>
);

export default Services;