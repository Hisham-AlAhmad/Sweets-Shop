import React, { useEffect, useState } from 'react';
import Testimonial from "./Testimonial/Testimonial";

const Contact = () => {
    const [name, setName] = useState(() => {
        return localStorage.getItem("name") ? JSON.parse(localStorage.getItem("name")) : "";
    });

    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (name) { // Ensure we don't save empty values unnecessarily
            localStorage.setItem("name", JSON.stringify(name));
        }
    }, [name]);

    const sendFeedback = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/src/backend/api/feedback.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, comment: comment, approved: 0 }),
        });

        const result = await response.json();

        if (result.error) {
            setMessage(result.error);
        } else {
            setMessage(result.message || "Operation successful, waiting to be reviewed!");
        }

        setComment("");
        const data = await response.json();
        console.log(data);
    };

    return (
        <>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Contact Us</h5>
                        <h1 className="mb-5">Tell us Anything!</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-6 text-center wow fadeIn" data-wow-delay="0.1s">
                            <img
                                src={`http://localhost:8000/public/img/about-4.jpg`}
                                alt="section img"
                                style={{ width: "60%", height: "auto", borderRadius: "10px" }}
                            />
                        </div>
                        <div className="col-lg-6">
                            <div className="wow fadeInUp" data-wow-delay="0.2s">
                                <form className="contact-form" onSubmit={sendFeedback}>
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
                                                <textarea className="form-control" placeholder="Leave a comment here"
                                                    id="comment" style={{ height: "200px" }}
                                                    value={comment} onChange={(e) => setComment(e.target.value)}
                                                ></textarea>
                                                <label htmlFor="comment">Comment</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button className={`btn btn-primary w-100 py-3 ${name && comment ? '' : 'disabled'}`} type="submit">Send Comment</button>
                                        </div>

                                        {message && (
                                            <div
                                                className={`alert mt-4 ${message.includes("Error") || message.includes("error") ? "alert-danger" : "alert-success"}`}
                                                role="alert"
                                            >
                                                <div className="d-flex align-items-center">
                                                    <i className={`bi me-2 ${message.includes("Error") || message.includes("error") ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"}`}></i>
                                                    <div>{message}</div>
                                                </div>
                                            </div>
                                        )}

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