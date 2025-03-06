import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import './testimonial.css';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonial = () => {
    const testimonials = [
        {
            id: 1,
            text: "10/10 crepe, 10/10 juice, 10/10 everything!!",
            name: "Hisham Al Ahmad",
        },
        {
            id: 2,
            text: "Amazing service and delicious food!",
            name: "Mohamad Mousa",
        },
        {
            id: 3,
            text: "The best experience ever! Highly recommended.",
            name: "Othman Zamzam",
        },
        {
            id: 4,
            text: "Fantastic atmosphere and great taste!",
            name: "Ahmad Al Sayed",
        },
    ];

    return (
        <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="container">
                <div className="text-center">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Testimonial</h5>
                    <h1 className="mb-4">Our Clients Say!!!</h1>
                </div>
                <div className="carousel-container">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                            },
                            992: {
                                slidesPerView: 3,
                            },
                        }}
                    >
                        {testimonials.map((testimonial) => (
                            <SwiperSlide key={testimonial.id}>
                                <div className="testimonial-item bg-transparent border rounded p-4">
                                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                                    <p>{testimonial.text}</p>
                                    <div className="d-flex align-items-center">
                                        <div className="ps-3">
                                            <h5 className="mb-1">{testimonial.name}</h5>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default Testimonial;