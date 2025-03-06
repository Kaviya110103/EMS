import React, { useEffect, useState } from 'react';

const ImageDisplay = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const totalImages = 5; // You can set this dynamically based on your number of images.

  // Generate image URLs dynamically based on ID
  useEffect(() => {
    const urls = [];
    for (let i = 1; i <= totalImages; i++) {
      urls.push(`http://localhost:8080/display/${i}`);
    }
    setImageUrls(urls);
  }, []);
  
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/add">Add Image</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Image Display */}
      <div className="mt-5 text-center">
        <h1>View Images</h1>
        <div className="container">
          <div className="my-3">
            <a href="/add"><button type="button" className="btn btn-primary">Add Image</button></a>
          </div>

          {/* Display Images */}
          <div className="row">
            {imageUrls.length > 0 ? (
              imageUrls.map((url, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <img 
                    src={url} 
                    alt={`Image ${index + 1}`} 
                    style={{ maxHeight: '250px', maxWidth: '100%', objectFit: 'cover' }} 
                  />
                </div>
              ))
            ) : (
              <p>No images to display</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
