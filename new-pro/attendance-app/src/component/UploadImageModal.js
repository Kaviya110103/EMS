import React, { useState, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import Webcam from "react-webcam";
import '../style/EnterAttendance.css';


const customStyles = {
  content: {
    width: "350px",             // Modal width
    height: "350px",            // Modal height
    margin: "auto",             // Centers the modal horizontally
    borderRadius: "10px",
    padding: "20px",            // Increased padding for better layout
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",  // Centers vertically within the modal
    position: "absolute",      // Absolute positioning to center on the screen
    top: "50%",                 // Positions modal's top edge at the center of the screen
    left: "50%",                // Positions modal's left edge at the center of the screen
    transform: "translate(-50%, -50%)",  // Corrects the offset for perfect centering
  },
};

const UploadImageModal = ({ employeeId, attendanceId, imageId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setImageSrc(null);
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const image = webcamRef.current.getScreenshot();
      setImageSrc(image);
    } else {
      console.error("Webcam reference is not defined.");
    }
  };

  const handleUploadImage = async () => {
    if (!imageSrc) {
      alert("Please capture an image first.");
      return;
    }

    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image1", file);
    formData.append("employeeId", employeeId);
    formData.append("attendanceId", attendanceId);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/images/uploadImage1",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Image uploaded successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={openModal}
        class="button-81" 
      >
        Open Camera
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        {/* <h2 style={{ marginBottom: "10px" }}>Capture Image</h2> */}

        {/* Webcam View */}
        {!imageSrc ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={350}
            height={200}
            style={{ borderRadius: "10px", marginBottom: "10px" }}
            videoConstraints={{
              facingMode: "user", // Ensure using front camera
            }}
          />
        ) : (
          <img
            src={imageSrc}
            alt="Captured"
            style={{ width: "300px", height: "200px", borderRadius: "10px" }}
          />
        )}

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          {!imageSrc ? (
            <button
              onClick={captureImage}
             class="button-28"
            >
              Capture
            </button>
          ) : (
            <button
              onClick={handleUploadImage}
              class="button-28"

            >
              Upload Image
            </button>
          )}

          <button
            onClick={closeModal}
            class="button-28"

          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UploadImageModal;
