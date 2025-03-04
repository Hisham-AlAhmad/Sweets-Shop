import About from "./About";
import Hero from "./Hero";
import Services from "./Services";
import Team from "./Team";
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
                <a href="/menu" className="btn btn-primary py-3 px-5 me-3 animated slideInUp">Go to menu</a>
            </div>
        </>
    );
}

export default Home;
