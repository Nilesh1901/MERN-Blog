import { useSelector } from "react-redux";
import { Alert, Button, TextInput } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app, { auth } from "../config/firebase";
import { CircularProgressbar } from "react-circular-progressbar";

function DashBoardProfile() {
  const { currentUser } = useSelector((store) => store.user);
  const [fileImage, setFileImage] = useState(null);
  const [fileImageUrl, setFileImageUrl] = useState(null);
  const [uploadfileImageProgress, setUploadfileImageProgress] = useState(null);
  const [fileImageUploadError, setFileImageUploadError] = useState(null);
  const filePickerRef = useRef();

  const handelFileImageChange = (e) => {
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileImageUrl(downloadURL);
        });
      }
    );
  });

  return (
    <div className=" max-w-lg mx-auto p-3 w-full">
      <h2 className=" text-center font-semibold text-3xl py-7">Profile</h2>
      <form className="flex flex-col gap-5">
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handelFileImageChange}
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
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="Password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className=" text-red-500 flex justify-between mt-5">
        <span className=" cursor-pointer">Delete Account</span>
        <span className=" cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

export default DashBoardProfile;
