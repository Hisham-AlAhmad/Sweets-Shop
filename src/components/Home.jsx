import About from "./About";
import Hero from "./hero";
import Services from "./Services";
import Team from "./Team";
import Testimonial from "./Testimonial";

const Home = () => {
    return (
        <>
            <Hero />
            <Services />
            <About />
            <Team />
            <Testimonial />
            <div className="home-menu">
            <a href="/menu" className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInDown">Go to menu</a>
            </div>
        </>
    );
}

export default Home;