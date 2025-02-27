const Team = () => {
    return (
        <>
            <div className="container-xxl pt-5 pb-3">
                <div className="container">
                    <div className="text-center wow fadeInUp" >
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Team Members</h5>
                        <h1 className="mb-5">Our Master Chef</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6 col-sm-9 mx-auto wow fadeInUp" data-wow-delay="0.1s">
                            <div className="team-item text-center rounded overflow-hidden">
                                <div className="rounded-circle overflow-hidden m-4">
                                    <img className="img-fluid" src="img/alhaj1.png" alt="master Chef" />
                                </div>
                                <h5 className="mb-0">Mohamad Alhaj Mousa</h5>
                                <p>Chef, Teacher</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Team;