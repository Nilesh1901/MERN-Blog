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

      uploadTask.on(
        "state_changed",
        (snapShot) => {
          const progress =
            (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(
            "Could not uplad image (File must be less than 2MB)"
          );
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setFormData((prevFormData) => {
                return { ...prevFormData, image: downloadURL };
              });
              setImageUploadError(null);
              setImageUploadProgress(null);
            })
            .catch((error) => setImageUploadError(error));
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/post/create", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <div className="  p-3 max-w-5xl min-h-screen mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData((prevFormData) => {
                return { ...prevFormData, title: e.target.value };
              })
            }
          />
          <Select
            onChange={(e) =>
              setFormData((prevFormData) => {
                return { ...prevFormData, category: e.target.value };
              })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="horror">Horror</option>
            <option value="technology">Technology</option>
            <option value="music">Music</option>
            <option value="fashion">Fashion</option>
            <option value="movie">Movie</option>
            <option value="health">Health</option>
          </Select>
        </div>
        <div className="flex gap-4 justify-between border-dotted border-teal-500 border-4 p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            disabled={imageUploadProgress}
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
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          onChange={(value) =>
            setFormData((prevFormData) => {
              return { ...prevFormData, content: value };
            })
          }
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image", "video"],
              ["clean"],
              ["code-block"], // Include the code-block option in the toolbar
            ],
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
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
