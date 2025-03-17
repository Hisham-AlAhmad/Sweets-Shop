import React, { useEffect, useState } from 'react';
import Testimonial from "./Testimonial/Testimonial";

const Contact = () => {
    const [name, setName] = useState(() => {
        return localStorage.getItem("name") ? JSON.parse(localStorage.getItem("name")) : "";
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        if (name) { // Ensure we don't save empty values unnecessarily
            localStorage.setItem("name", JSON.stringify(name));
        }
    }, [name]);

    return (
        <>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Contact Us</h5>
                        <h1 className="mb-5">Tell us Anything!</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-6 wow fadeIn" data-wow-delay="0.1s">
                                <iframe className="position-relative rounded w-100 h-100"
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3337.0945308160135!2d35.21785578175353!3d33.23782680703575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!5f6.1!5e0!3m2!1sar!2sus!4v1739389997029!5m2!1sen!2sbd"
                                    style={{ border: 0, width: "600", height: "500" }} allowFullScreen="" loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>

                        </div>
                        <div className="col-md-6">
                            <div className="wow fadeInUp" data-wow-delay="0.2s">
                                <form className="contact-form">
                                    <div className="row g-3">
                                        <div className="col-lg-6 col-md-8 ">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" placeholder="Enter your name" id="name"
                                                    value={name} onChange={(e) => setName(e.target.value)}
                                                />
                                                <label htmlFor="name">Name</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <textarea className="form-control" placeholder="Leave a message here"
                                                    id="message" style={{ height: "200px" }}
                                                    value={message} onChange={(e) => setMessage(e.target.value)}
                                                    ></textarea>
                                                <label htmlFor="message">Message</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <Testimonial />
                    </div>
                </div>
            </div >
        </>
    );
}

export default Contact;