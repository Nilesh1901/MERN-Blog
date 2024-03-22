import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

function DashBoardProfile() {
  const { currentUser } = useSelector((store) => store.user);
  return (
    <div className=" max-w-lg mx-auto p-3 w-full">
      <h2 className=" text-center font-semibold text-3xl py-7">Profile</h2>
      <form className="flex flex-col gap-5">
        <div className="w-36 h-36 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-4 border-[lightgray]"
          />
        </div>
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
