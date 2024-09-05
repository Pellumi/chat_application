import React, { forwardRef } from "react";
import { CiChat1 } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const SmallInput = ({ type, value, onChange, placeholder }) => {
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        className="border-none my-2 mx-0 py-[10px] px-[15px] text-sm rounded-lg w-full outline-none bg-gray-700 text-white"
        placeholder={placeholder}
      />
    </>
  );
};

SmallInput.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export const SmallPrimaryButton = ({ child, type, disabled }) => {
  return (
    <>
      <button
        type={type}
        disabled={disabled}
        className="bg-primary text-white text-xs py-2.5 px-11 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-transparent hover:border-white"
      >
        {child}
      </button>
    </>
  );
};

SmallPrimaryButton.propTypes = {
  child: PropTypes.any,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export const SmallTransparentButton = ({ id, onClick, child, disabled }) => {
  return (
    <>
      <button
        onClick={onClick}
        id={id}
        disabled={disabled}
        className="bg-transparent text-white text-xs py-2.5 px-11 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-white hover:text-primary border-white"
      >
        {child}
      </button>
    </>
  );
};

SmallTransparentButton.propTypes = {
  id: PropTypes.string,
  onClick: PropTypes.func,
  child: PropTypes.string,
  disabled: PropTypes.bool,
};

export const SmallProfile = ({
  username,
  firstname,
  lastname,
  email,
  onClick,
  disabled,
  child,
}) => {
  return (
    <>
      <div className="absolute z-[50] w-[200px] bg-bg_color border border-acc_color rounded-xl left-2 top-[calc(8px+100%)] p-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-normal">{username}</h3>
          <div className="flex gap-2">
            <h3 className="text-xs font-normal">{firstname}</h3>
            <h3 className="text-xs font-normal">{lastname}</h3>
          </div>
          <h3 className="text-[14px] font-normal">{email}</h3>
          <button
            onClick={onClick}
            disabled={disabled}
            className="bg-transparent text-danger text-xs py-2.5 px-11 border border-acc_color rounded-lg font-bold tracking-wider uppercase mt-2.5 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-danger hover:text-white "
          >
            {child}
          </button>
        </div>
      </div>
    </>
  );
};

SmallProfile.propTypes = {
  username: PropTypes.string,
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  email: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.func,
  child: PropTypes.string,
};

const getFirstLetter = (word) => {
  const wordString = JSON.stringify(word);
  const firstLetterOfWord = wordString.charAt(1).toUpperCase();
  return firstLetterOfWord;
};

export const AddFriendsTab = ({
  userId,
  firstName,
  lastName,
  username,
  disabled,
  onClick,
  status,
  chat,
  icon,
  chatClick,
  child,
}) => {
  return (
    <>
      <div className="flex justify-between items-center bg-secondary mb-2 p-2 gap-4 rounded-lg">
        <div className="flex justify-start items-center gap-4">
          <div className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center bg-neutral">
            <p className="text-[16px] font-bold">{getFirstLetter(firstName)}</p>
            <p className="text-[16px] font-bold">{getFirstLetter(lastName)}</p>
          </div>
          <div className="flex flex-col items-start justify-center">
            <div className="flex gap-1">
              <h2 className="text-sm text-lightLabel font-medium">
                {firstName}
              </h2>
              <h2 className="text-sm text-lightLabel font-medium">
                {lastName}
              </h2>
            </div>
            <h2 className="text-xs text-lightLabel font-medium">{username}</h2>
          </div>
        </div>
        <div className="">
          {status === "accepted" ? (
            <Link
              to={`/${userId}`}
              id="sendRequest"
              onClick={chatClick}
              className="bg-gray-700 flex items-center justify-center py-1 px-2 rounded-md gap-1"
            >
              <CiChat1 size={20} />{" "}
              <p className="font-medium text-sm">{chat}</p>
            </Link>
          ) : (
            <button
              id="sendRequest"
              disabled={disabled}
              onClick={onClick}
              className="bg-gray-700 py-1 px-2 flex items-center justify-center rounded-md gap-2"
            >
              {icon} <p className="font-medium text-sm">{child}</p>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export const FriendRequestTab = ({
  firstName,
  lastName,
  username,
  acceptOnClick,
  rejectOnClick,
}) => {
  return (
    <>
      <div className="flex justify-between items-center bg-secondary mb-2 p-2 gap-4 rounded-lg">
        <div className="flex justify-start items-center gap-4">
          <div className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center bg-neutral"></div>
          <div className="flex flex-col items-start justify-center">
            <div className="flex gap-1">
              <h2 className="text-sm text-lightLabel font-medium">
                {firstName}
              </h2>
              <h2 className="text-sm text-lightLabel font-medium">
                {lastName}
              </h2>
            </div>
            <h2 className="text-xs text-lightLabel font-medium">{username}</h2>
          </div>
        </div>
        <div className="flex items-center">
          <button id="sendRequest" className="mr-2" onClick={acceptOnClick}>
            Accept
          </button>
          <button id="sendRequest" className="" onClick={rejectOnClick}>
            <MdCancel size={15} />
          </button>
        </div>
      </div>
    </>
  );
};

export const SmallChatInput = forwardRef(
  ({ type, value, onChange, placeholder, classname }, ref) => (
    <>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        className={classname}
        placeholder={placeholder}
      />
    </>
  )
);

SmallChatInput.displayName = "SmallChatInput";
