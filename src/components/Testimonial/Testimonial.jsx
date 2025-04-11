import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import './testimonial.css';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonial = () => {
    const [feedbacks, setFeedbacks] = React.useState([]);   

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch('http://localhost:8000/src/backend/api/feedback.php');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setFeedbacks(data);
            } catch (err) {
                console.error('Error fetching feedback:', err);
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
                    {feedbacks.length > 0 ? (
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
                                feedback.approved == 1 && (
                                <SwiperSlide key={feedback.id}>
                                    <div className="testimonial-item bg-transparent border rounded p-4">
                                        <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                        <p>{feedback.comment}</p>
                                        <div className="d-flex align-items-center">
                                            <div className="ps-3">
                                                <h5 className="mb-1">{feedback.name}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )))}
                        </Swiper>
                    ) : (
                        <p>Loading testimonials...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Testimonial;