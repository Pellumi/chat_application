import React from "react";
import { SmallInput, SmallProfile } from "./SmallComponent";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import PropTypes from 'prop-types';
import RequestBar from "./RequestBar";
import ContactBar from "./ContactBar";


const SideNavBar = ({contacts, onSelectContact}) => {
  const [showProfile, setShowProfile] = React.useState(false);
  const [showRequests, setShowRequests] = React.useState(false);
  
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const getFirstLetter = (word) => word?.charAt(0).toUpperCase() || '';

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleShowRequests = () => {
    setShowRequests(!showRequests);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");

    navigate("/login");
  };

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
            <div className="w-9 h-9 rounded-full bg-white"></div>
            <div
              className="w-9 h-9 rounded-full flex items-center bg-transparent justify-center cursor-pointer"
              onClick={handleShowRequests}
            >
              {showRequests ? (
                <MdCancel size={38} />
              ) : (
                <IoPersonAddSharp size={24} className="red" />
              )}
            </div>
            {showRequests && <RequestBar />}
          </div>
          <div className="w-full flex flex-col px-4 py-1 border-b border-acc_color">
            <SmallInput type="search" placeholder="Search" />
          </div>
          <ContactBar contacts={contacts} onSelectContact={onSelectContact}/>
        </div>
      </nav>
    </>
  );
};

SideNavBar.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.any).isRequired,
  onSelectContact: PropTypes.func.isRequired,
};

export default SideNavBar;
