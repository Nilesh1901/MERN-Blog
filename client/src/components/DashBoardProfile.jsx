import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app, { auth } from "../config/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutSuccess,
} from "../app/user/userSlice";
import { IoWarningOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

function DashBoardProfile() {
  const { currentUser, errorMessage, loading } = useSelector(
    (store) => store.user
  );
  const [fileImage, setFileImage] = useState(null);
  const [fileImageUrl, setFileImageUrl] = useState(null);
  const [uploadfileImageProgress, setUploadfileImageProgress] = useState(null);
  const [fileImageUploadError, setFileImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [fileImageUploading, setFileImageUploading] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleFileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the selected file is an image
      if (!file.type.startsWith("image/")) {
        setFileImageUploadError("Please select an image file."); // Set error message
        return; // Return without further processing
      }
      // If the selected file is an image, proceed with setting state
      setFileImage(file);
      setFileImageUrl(URL.createObjectURL(file));
      setFileImageUploadError(null); // Reset error message
    }
  };

  useEffect(() => {
    if (fileImage) {
      uploadImageFile(); // Only initiate the upload process if fileImage is not null
    }
  }, [fileImage]);

  const uploadImageFile = useCallback(async () => {
    setFileImageUploadError(null);
    setFileImageUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + fileImage.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadfileImageProgress(progress.toFixed(0));
      },
      (error) => {
        setFileImageUploadError(
          "Could not uplad image (File must be less than 2MB)"
        );
        setUploadfileImageProgress(null);
        setFileImage(null);
        setFileImageUrl(null);
        setFileImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileImageUrl(downloadURL);
          setFileImageUploading(false);
          setFormData((prevFormData) => {
            return { ...prevFormData, profilePicture: downloadURL };
          });
        });
      }
    );
  });

  const handleChange = (e) => {
    setFormData((prevFormData) => {
      return { ...prevFormData, [e.target.id]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    setUploadfileImageProgress(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (fileImageUploading) {
      setUpdateUserError("please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        return;
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated Successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleUserDelete = async () => {
    setshowModal(false);
    try {
      dispatch(deleteStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(deleteFailure(data.message));
        return;
      } else {
        dispatch(deleteSuccess());
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };
  const handlesignOut = async () => {
    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className=" max-w-lg mx-auto p-3 w-full">
      <h2 className="font-[Syne] text-center font-semibold text-3xl py-7">
        Profile
      </h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleFileImageChange}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {uploadfileImageProgress && (
            <CircularProgressbar
              value={uploadfileImageProgress || 0}
              text={`${uploadfileImageProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    uploadfileImageProgress / 100
                  })`,
                },
                text: {
                  fontSize: "20px",
                  dominantBaseline: "middle",
                  textAnchor: "middle",
                  fill: "blue",
                },
              }}
            />
          )}
          <img
            src={fileImageUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              uploadfileImageProgress &&
              uploadfileImageProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {fileImageUploadError && (
          <Alert color="failure">{fileImageUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || fileImageUploading}
        >
          {loading || fileImageUploading ? (
            <>
              <Spinner size="sm" className="mr-3" />
              <span>loading...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
        {currentUser.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              className="w-full"
            >
              Create Post
            </Button>
          </Link>
        )}
      </form>
      <div className=" text-red-500 flex justify-between mt-5">
        <span onClick={() => setshowModal(true)} className=" cursor-pointer">
          Delete Account
        </span>
        <span onClick={handlesignOut} className=" cursor-pointer">
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert className="mt-5" color="success">
          {updateUserSuccess}
        </Alert>
      )}
      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
      {updateUserError && (
        <Alert className="mt-5" color="failure">
          {updateUserError}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setshowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div>
            <IoWarningOutline className="h-14 w-14 text-gray-400 mx-auto mb-5 dark:text-gray-200" />
            <h3 className="text-center text-gray-500 dark:text-gray-400 mb-5">
              Are you sure you want to delete your account
            </h3>
            <div className="flex justify-center gap-5">
              <Button color="failure" onClick={handleUserDelete}>
                Yes I'm sure
              </Button>
              <Button color="gray" onClick={() => setshowModal(false)}>
                No cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashBoardProfile;
