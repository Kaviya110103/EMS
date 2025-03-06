import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageGallery = ({ employeeId }) => {
  const [imageList, setImageList] = useState([]);
  const [filteredImages, setFilteredImages] = useState({});

  // Fetch images from the API and group them by action
  useEffect(() => {
    fetch('http://localhost:8080/images') // Ensure this endpoint returns the action field
      .then(response => response.json())
      .then(data => {
        const groupedImages = data.reduce((acc, item) => {
          const action = item.action || 'Unknown';
          if (!acc[action]) {
            acc[action] = [];
          }
          acc[action].push({
            id: item.id,
            imageUrl: item.imageUrl,
            image2Url: item.image2Url,
            createdAt: new Date(item.createdAt).toLocaleString(),
          });
          return acc;
        }, {});
        setImageList(groupedImages);

        // Automatically filter images based on employeeId
        if (employeeId) {
          const filtered = Object.entries(groupedImages).filter(
            ([action]) => action.toLowerCase() === employeeId.toString().toLowerCase()
          );
          setFilteredImages(Object.fromEntries(filtered));
        } else {
          setFilteredImages(groupedImages); // Show all images if employeeId is not defined
        }
      })
      .catch(error => console.error('Error fetching images:', error));
  }, [employeeId]);

  return (
    <div>
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

      {/* View Images */}
      <div className="mt-5">
        <h1 className="text-center">View Images</h1>
        <div className="container">
          {/* Add Image Button */}
          <div className="my-3">
            <a href="/add"><button type="button" className="btn btn-primary">Add Image</button></a>
          </div>

          {/* Display filtered images by employee ID */}
          {Object.entries(filteredImages).map(([action, images]) => (
            <div key={action}>
              <h2 className="text-center">{action}</h2>
              <table className="table border">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Image 1</th>
                    <th scope="col">Image 2</th>
                    <th scope="col">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {images.length > 0 ? (
                    images.map(image => (
                      <tr key={image.id}>
                        <td>{image.id}</td>
                        <td>
                          <img height="250px" src={image.imageUrl} alt={`Image ${image.id}`} />
                        </td>
                        <td>
                          <img height="250px" src={image.image2Url} alt={`Image2 ${image.id}`} />
                        </td>
                        <td>{image.createdAt}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No images found for this employee ID.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
