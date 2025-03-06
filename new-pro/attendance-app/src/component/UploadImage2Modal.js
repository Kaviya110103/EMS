import React, { useState, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import Webcam from "react-webcam";
import '../style/EnterAttendance.css';

const customStyles = {
  content: {
    width: "350px",
    height: "350px",
    margin: "auto",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

const UploadImage2Modal = ({ imageId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal visibility state
  const [imageSrc, setImageSrc] = useState(null); // Captured image source
  const webcamRef = useRef(null); // Webcam reference

  // Open modal
  const openModal = () => setModalIsOpen(true);

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setImageSrc(null);
  };

  // Capture image from webcam
  const captureImage = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  };

  // Post image2 to backend
  const handleUploadImage2 = async () => {
    if (!imageSrc) {
      alert("Please capture an image first.");
      return;
    }

    // Convert base64 image to a file
    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], "captured_image2.jpg", { type: "image/jpeg" });

    // Prepare form data
    const formData = new FormData();
    formData.append("image2", file);

    try {
      // Post the image2 to the backend
      const response = await axios.post(
        `http://localhost:8080/api/images/uploadImage2/${imageId}`, // Endpoint with imageId as a path variable
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Image2 uploaded successfully:", response.data);

      // Close the modal after the image is uploaded
      closeModal();
      
      // Reload the page automatically after successful upload (optional)
      window.location.reload(); // Reload page (optional)
    } catch (error) {
      console.error("Error uploading image2:", error);
      alert("Failed to upload Image2.");
    }
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        {/* Button to open the modal */}
        <button
          className="col-7 text-center button-81"
          onClick={openModal}
        >
          TimeOut Image
        </button>

        {/* Modal with webcam */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          ariaHideApp={false}
        >
          {/* Webcam View */}
          {!imageSrc ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={350}
              height={200}
              style={{ borderRadius: "10px", marginBottom: "20px" }}
            />
          ) : (
            <img
              src={imageSrc}
              alt="Captured"
              style={{ width: "300px", height: "200px", borderRadius: "12px" }}
            />
          )}

          {/* Buttons */}
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            {!imageSrc ? (
              <button onClick={captureImage} className="button-28">
                Capture
              </button>
            ) : (
              <button
                onClick={handleUploadImage2}
                className="button-28"
              >
                Upload Image2
              </button>
            )}

            <button onClick={closeModal} className="button-28">
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default UploadImage2Modal;
