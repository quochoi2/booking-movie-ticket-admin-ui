import React from "react";
import { Button } from "@mui/material";

const UploadImage = ({ onChange, imagePreview }) => {
  return (
    <>
      <label htmlFor="upload-image-button">
        <input
          accept="image/*"
          id="upload-image-button"
          type="file"
          style={{ display: "none" }}
          onChange={onChange}
        />
        <Button
          variant="contained"
          component="span"
          color="primary"
          startIcon={<i className="fas fa-upload"></i>} // Sử dụng Material-UI Icons nếu muốn
        >
          Upload Image
        </Button>
      </label>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="mt-4 w-full h-32 object-cover rounded-md shadow-md"
        />
      )}
    </>
  );
};

export default UploadImage;
