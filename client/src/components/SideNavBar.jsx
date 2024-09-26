import React from "react";
import { SmallInput, SmallProfile } from "./SmallComponent";
import { Link, useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import RequestBar from "./RequestBar";
import viteLogo from '/vite.svg'
import ContactBar from "./ContactBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../features/reducers/contactSlice";
import { toggleDisplay } from "../features/reducers/displayReducer";
import { removeActive } from "../features/reducers/activeTabSlice";

const SideNavBar = () => {
  const dispatch = useDispatch();
  const isRequestVisible = useSelector(
    (state) => state.displayReducer.isVisible
  );
  const contacts = useSelector((state) => state.contacts.contacts);
  const status = useSelector((state) => state.contacts.status);
  const error = useSelector((state) => state.contacts.error);

  const [showProfile, setShowProfile] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?.id;

  const getFirstLetter = (word) => word?.charAt(0).toUpperCase() || "";

  React.useEffect(() => {
    if (currentUserId) {
      dispatch(fetchContacts(currentUserId));
    }
  }, [currentUserId, dispatch]);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <div className="">No User data available</div>;
  }

  return (
    <>
      <nav className="lg:w-[340px] w-full lg:h-full h-max bg-transparent border-r border-acc_color">
        <div className="w-full h-full flex flex-col justify-start items-center">
          <div className="w-full h-[60px] border-b border-acc_color flex items-center justify-between p-3 relative">
            <div
              className="w-9 h-9 rounded-full cursor-pointer flex items-center justify-center bg-neutral"
              onClick={() => toggleProfile()}
            >
              <p className="text-[18px] font-bold">
                {getFirstLetter(user.firstname)}
              </p>
              <p className="text-[18px] font-bold">
                {getFirstLetter(user.lastname)}
              </p>
            </div>
            {showProfile && (
              <SmallProfile
                username={user.username}
                firstname={user.firstname}
                lastname={user.lastname}
                email={user.email}
                child="Log Out"
                onClick={handleLogOut}
              />
            )}
            <div className="w-max h-max">
              <Link to="/" onClick={() => dispatch(removeActive())}>
                <img src={viteLogo} alt="logo" className="h-[5em] p-[1.5em]" />
              </Link>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center bg-transparent justify-center cursor-pointer"
              onClick={() => dispatch(toggleDisplay())}
            >
              {isRequestVisible ? (
                <MdCancel size={38} />
              ) : (
                <IoPersonAddSharp size={24} className="red" />
              )}
            </div>
            {isRequestVisible && <RequestBar />}
          </div>
          <div className="w-full flex flex-col px-4 py-1 border-b border-acc_color">
            <SmallInput
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
            />
          </div>
          <ContactBar
            contacts={filteredContacts}
            status={status}
            error={error}
          />
        </div>
      </nav>
    </>
  );
};

export default SideNavBar;
