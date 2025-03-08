const About = () => {
    return (
        <>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
                            <div className="row g-3">
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded w-100 wow zoomIn x" data-wow-delay="0.1s" src="img/about-1.jpg"
                                        style={{aspectRatio: "1/1", objectFit: "cover"}}
                                    />
                                </div>
                                <div className="col-6 text-start">
                                    <img className="img-fluid rounded wow zoomIn" data-wow-delay="0.25s" src="img/about-2.jpg" style={{marginTop: "36%", width: "85%"}} />
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded wow zoomIn" data-wow-delay="0.4s" src="img/crepe1.png" style={{width: "85%"}}/>
                                </div>
                                <div className="col-6 text-end">
                                    <img className="img-fluid rounded w-100 wow zoomIn" data-wow-delay="0.6s" src="img/about-4.jpg"/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
                            <h1 className="mb-4"><i>Welcome to Fresh Time</i></h1>
                            <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos erat ipsum et lorem et sit, sed stet lorem sit.</p>
                            <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet</p>
                            <a className="btn btn-primary py-3 px-5 mt-2" href="#">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;