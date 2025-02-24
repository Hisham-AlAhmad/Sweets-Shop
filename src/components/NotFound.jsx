const NotFound = () => {
    return ( 
        <div className="container text-center" >
            <img src="/img/404.gif" alt="404 Error" className="img-fluid mb-4" style={{maxWidth: "350px"}} />
            {/* <h1 className="display-1">404</h1> */}
            <h2 className="display-4">Page Not Found</h2>
            <p className="lead">We are sorry, but the page you requested was not found</p>
            <a href="/" className="btn btn-primary py-sm-3 px-sm-5 me-3">Go to Home</a>
        </div>
     );
}

 
export default NotFound;