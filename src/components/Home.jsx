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
        </>
    );
}

export default Home;