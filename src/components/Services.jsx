import { useSettings } from "../admin/Settings/SettingsProvider";
import DayFomatter from "../admin/Hooks/DayFomatter";

const Services = () => {
    const { settings, isLoading } = useSettings();
    const { opening_time, closing_time, days_open, delivery_cost } = settings || {};

    // Function to format price with commas 1000000 => 100,000
    const commaInPrice = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' L.L';
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-xxl py-3">
            <div className="container">
                <div className="row g-4 justify-content-center">
                    {/* First Service */}
                    <div className="col-lg-3 col-sm-4 mx-auto wow fadeInUp" data-wow-delay="0.1s">
                        <div className="service-item rounded pt-2">
                            <div className="p-3 text-center">
                                <i className={`fa fa-2x fa-headset text-primary mb-3`}></i>
                                <h6>Available {DayFomatter(days_open.slice(0, -1))}</h6>
                                <p>From {opening_time} to {closing_time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Service (Hidden on Phones) */}
                    <div className="col-lg-3 col-sm-4 mx-auto d-none d-sm-block wow fadeInUp" data-wow-delay="0.3s">
                        <div className="service-item rounded pt-2">
                            <div className="p-3 text-center">
                                <i className={`fa fa-2x fa-utensils text-primary mb-3`}></i>
                                <h6>Quality Food</h6>
                                <p>Try it & you won't regret</p>
                            </div>
                        </div>
                    </div>

                    {/* Third Service */}
                    <div className="col-lg-3 col-sm-4 mx-auto wow fadeInUp" data-wow-delay="0.5s">
                        <div className="service-item rounded pt-2">
                            <div className="p-3 text-center">
                                <i className={`fa fa-2x fa-cart-plus text-primary mb-3`}></i>
                                <h6>Delivery Order</h6>
                                <p>Only for {commaInPrice(delivery_cost)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Services;