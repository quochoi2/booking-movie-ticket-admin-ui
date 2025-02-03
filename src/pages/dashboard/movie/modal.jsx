import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Input,
} from "@mui/material";
import { SelectMonth } from "@/components/selected";

const ModalMovie = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    rating: "",
    language: '',
    age: '',
    releaseDate: "",
    image: null,
    video: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        title: initialData.title || "",
        description: initialData.description || "",
        duration: initialData.duration || "",
        rating: initialData.rating || "",
        language: initialData.language || "",
        age: initialData.age || "",
        releaseDate: initialData.releaseDate ? initialData.releaseDate.split('T')[0] : "",
        image: initialData.image || "",
        video: initialData.video || null,
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: "",
      rating: "",
      language: '',
      age: '',
      releaseDate: "",
      image: null,
      video: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));  
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };
  
  const handleSubmit = () => {
    onSubmit({ ...formData });
    onClose();
    resetForm();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Movie" : "Create Movie"}</DialogTitle>
      <DialogContent>
        <div className="mt-5">
          <TextField
            label="Title"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        {/* Decription */}
        <div className="mt-5">
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        {/* Language */}
        <div className="mt-5">
          <TextField
            label="Language"
            name="language"
            fullWidth
            value={formData.language}
            onChange={handleChange}
            required
          />
        </div>
        {/* Age */}
        <div className="mt-5">
          <TextField
            label="Age"
            name="age"
            fullWidth
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        {/* Rating */}
        <div className="mt-5">
          <TextField
            label="Rating"
            name="rating"
            fullWidth
            value={formData.rating}
            onChange={handleChange}
            required
          />
        </div>
        {/* Duration */}
        <div className="mt-5">
          <SelectMonth
            selected={formData.duration}
            setSelected={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
          />
        </div>
        {/* Release Date */}
        <div className="mt-5">
          <TextField
            label="Release Date"
            name="releaseDate"
            type="date"
            fullWidth
            value={formData.releaseDate}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        {/* Image */}
        <div className="mt-5">
          {formData.image && typeof formData.image === "string" && (
            <img src={formData.image} alt="Preview" className="w-full h-auto rounded-md" />
          )}
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
          />
        </div>
        {/* Video Link */}
        <div className="mt-5">
          <TextField
            label="Video Link"
            name="video"
            fullWidth
            value={formData.video}
            onChange={handleChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
        > 
          {initialData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalMovie;
