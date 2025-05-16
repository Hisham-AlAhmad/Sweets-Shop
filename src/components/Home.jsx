import Hero from "./Hero";
import Team from "./Team";
import About from "./About";
import Services from "./Services";
import { Link } from "react-router-dom";
import Testimonial from "./Testimonial/Testimonial";

const Home = () => {
    return (
        <>
            <Hero />
            <Services />
            <About />
            <Team />
            <Testimonial />
            <div className="home-menu">
                <Link to="/menu" className="btn btn-primary py-3 px-5 animated slideInUp">Go to menu</Link>
            </div>
        </>
    );
}

export default Home;
