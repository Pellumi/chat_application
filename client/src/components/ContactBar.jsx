import React from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../features/reducers/contactSlice";
import { Link } from "react-router-dom";
import { setActiveTab } from "../features/reducers/activeTabSlice";

const socket = io(`http://${window.location.hostname}:3003`);

const ContactBar = ({ contacts, status, error }) => {
  const dispatch = useDispatch();

  const activeTab = useSelector((state) => state.activeTab.isActive);

  const getFirstLetter = (word) => word?.charAt(0).toUpperCase() || "";

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user?.id;

  React.useEffect(() => {
    const handleUpdateContact = (convo) => {
      console.log(convo);
      if (
        currentUserId === convo.user1_id ||
        currentUserId === convo.user2_id
      ) {
        dispatch(fetchContacts(currentUserId));
      }
    };

    socket.on("receive-convo", handleUpdateContact);

    return () => {
      socket.off("receive-convo", handleUpdateContact);
    };
  });

  React.useEffect(() => {
    const handleUpdateContact = () => {
      dispatch(fetchContacts(currentUserId));
    };

    socket.on("receive-message", handleUpdateContact);

    return () => {
      socket.off("receive-message", handleUpdateContact);
    };
  });

  const formatDate = (date) => {
    const messageDate = new Date(date).getDate();
    const currentDate = new Date().getDate();

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    if (currentDate === messageDate) {
      return new Date(date).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (currentDate === messageDate + 1) {
      return "Yesterday";
    } else {
      return new Date(date).toLocaleDateString(undefined, options);
    }
  };

  if (status === "loading") {
    return (
      <div className="h-full w-full flex lg:flex-col overflow-scroll lg:overflow-auto items-center justify-start py-2 px-[7px]">
        <p className="text-center my-auto text-[12px] text-label">
          Loading contacts...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    console.error(error);

    return (
      <div className="h-full w-full flex lg:flex-col overflow-scroll lg:overflow-auto items-center justify-start py-2 px-[7px]">
        <p className="text-center my-auto text-[12px] text-label">
          We could not retrieve your contacts
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full flex lg:flex-col overflow-scroll lg:overflow-auto items-center justify-start py-2 px-[7px]">
        {contacts.length === 0 ? (
          <p className="text-center my-auto text-[12px] text-label">
            You have no contact here
          </p>
        ) : (
          contacts.map((contact) => (
            <Link
              to={`/${contact.user_id}`}
              className={`lg:w-full w-max rounded-xl lg:p-[9px] lg:px-[9px] p-2.5 px-3 hover:bg-seeThrough cursor-pointer ${
                activeTab === contact.user_id
                  ? `bg-seeThrough`
                  : `bg-transparent`
              }`}
              key={contact.user_id}
              onClick={() => dispatch(setActiveTab(contact.user_id))}
            >
              <div className="flex flex-col items-center lg:justify-start justify-center lg:flex-row gap-3">
                <div className="w-14 h-14 rounded-full cursor-pointer flex items-center justify-center bg-neutral">
                  <p className="text-[28px] font-bold">
                    {getFirstLetter(contact.first_name)}
                  </p>
                  <p className="text-[28px] font-bold">
                    {getFirstLetter(contact.last_name)}
                  </p>
                </div>
                <div className="flex flex-grow flex-col lg:items-start items-center justify-center gap-1">
                  <div className="flex w-full items-center justify-center lg:justify-between">
                    <h2 className="text-base text-lightLabel whitespace-nowrap overflow-hidden overflow-ellipsis font-medium">
                      {contact.username}
                    </h2>
                    <p className="hidden lg:block text-[12px] font-medium text-lightLabel">
                      {formatDate(contact.timestamp)}
                    </p>
                  </div>
                  <div className="hidden w-full lg:flex items-center justify-start gap-1">
                    <p className="text-xs font-medium text-primary">
                      {contact.sender_id === currentUserId ? "You:" : "Them:"}
                    </p>
                    <h2 className="text-[14px] text-left max-w-[200px] text-lightLabel pr-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {contact.message_text}
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default ContactBar;
