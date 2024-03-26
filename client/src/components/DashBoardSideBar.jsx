import { Sidebar } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { signOutSuccess } from "../app/user/userSlice";

function DashBoardSideBar() {
  const [tab, setTab] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(
    useCallback(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get("tab");
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }),
    [location.search]
  );
  const handelsignOut = async () => {
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"user"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            onClick={handelsignOut}
            icon={HiArrowSmRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashBoardSideBar;
