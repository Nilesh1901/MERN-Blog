import React, { useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../config/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an Image");
      return;
    }
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      setIsSubmitting(true);
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          const progress =
            (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(
            "Could not upload image (File must be less than 2MB)"
          );
          setImageUploadProgress(null);
          setIsSubmitting(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setFormData((prevFormData) => {
                return { ...prevFormData, image: downloadURL };
              });
              setImageUploadError(null);
              setImageUploadProgress(null);
              setIsSubmitting(false);
            })
            .catch((error) => {
              setImageUploadError(error);
              setIsSubmitting(false);
            });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the submit button
    try {
      const response = await fetch("/api/post/create", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setPublishError(data.message);
        setIsSubmitting(false); // Enable the submit button
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
      setIsSubmitting(false); // Enable the submit button
    }
  };

  return (
    <div className="  p-3 max-w-5xl min-h-screen mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Form fields */}
        <Button
          type="button"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={imageUploadProgress || isSubmitting} // Disable if image is uploading or form is submitting
          onClick={handleUploadImage}
          size="sm"
        >
          {imageUploadProgress ? (
            <div className="w-16 h-16">
              <CircularProgressbar
                value={imageUploadProgress}
                text={`${imageUploadProgress || 0}%`}
              />
            </div>
          ) : (
            "Upload Image"
          )}
        </Button>
        {/* Other form fields */}
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={imageUploadProgress || isSubmitting} // Disable if image is uploading or form is submitting
        >
          {isSubmitting ? "Submitting..." : "Publish"}
        </Button>
      </form>
      {publishError && (
        <Alert color="failure" className="mt-4">
          {publishError}
        </Alert>
      )}
    </div>
  );
}

export default CreatePost;
