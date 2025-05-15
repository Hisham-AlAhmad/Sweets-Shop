import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import './testimonial.css';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonial = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    function getRandomFeedbacks(feedbacks, count = 4) {
        const shuffled = [...feedbacks];

        // Fisher-Yates shuffle (modern version)
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
        }

        // Return first 'count' feedbacks
        return shuffled.slice(0, count);
    }

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch('http://localhost:8000/src/backend/api/feedback.php');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setFeedbacks(getRandomFeedbacks(data, 4)); // Get 4 random feedbacks 
                setLoading(false);
            } catch (err) {
                console.error('Error fetching feedback:', err);
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="container">
                <div className="text-center">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Testimonial</h5>
                    <h1 className="mb-4">Our Clients Say!!</h1>
                </div>
                <div className="carousel-container">
                    {!loading ? (
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            loop={true}
                            speed={800}
                            breakpoints={{
                                768: {
                                    slidesPerView: 2,
                                },
                                992: {
                                    slidesPerView: 3,
                                },
                            }}
                        >
                            {feedbacks.map((feedback) => (
                                <SwiperSlide key={feedback.id}>
                                    <div className="testimonial-item border shadow ">
                                        <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                        <p>{feedback.comment}</p>
                                        <div className="d-flex align-items-center">
                                            <div className="ps-3">
                                                <h5 className="mb-1">{feedback.name}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        // loading skeleton
                        <div className="testimonial-loading">
                            <div className="testimonial-skeleton-container">
                                <div className="testimonial-item testimonial-skeleton d-none d-lg-block">
                                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="d-flex align-items-center mt-3">
                                        <div className="ps-3">
                                            <div className="skeleton-name"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="testimonial-item testimonial-skeleton d-none d-sm-block">
                                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="d-flex align-items-center mt-3">
                                        <div className="ps-3">
                                            <div className="skeleton-name"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="testimonial-item testimonial-skeleton">
                                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="d-flex align-items-center mt-3">
                                        <div className="ps-3">
                                            <div className="skeleton-name"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Testimonial;