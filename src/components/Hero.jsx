import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="container-xxl py-5 bg-dark hero-header mb-5">
            <div className="container mb-5 py-5">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6 text-center text-lg-start">
                        <h1 className="display-3 text-white animated slideInLeft">Enjoy Our<br />Delicious Sweets</h1>
                        <Link to="/menu" className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft">Go to menu</Link>
                    </div>
                    <div className="col-lg-5 text-center text-lg-end overflow-hidden">
                        <img className="img-fluid hero-image" src="/img/crepe.png" alt="Weeeee" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;