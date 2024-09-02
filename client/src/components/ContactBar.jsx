import React from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../features/reducers/contactSlice";
import { Link } from "react-router-dom";

const socket = io(`http://${window.location.hostname}:3003`);

const ContactBar = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.contacts);
  const status = useSelector((state) => state.contacts.status);
  const error = useSelector((state) => state.contacts.error);

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
    if (currentUserId) {
      dispatch(fetchContacts(currentUserId));
    }
  }, [currentUserId, dispatch]);

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
            You have no contact
          </p>
        ) : (
          contacts.map((contact) => (
            <Link
              to={`/${contact.user_id}`}
              className="lg:w-full w-max rounded-xl lg:p-[9px] lg:px-[9px] p-2.5 px-3 hover:bg-seeThrough cursor-pointer"
              key={contact.user_id}
            >
              <div className="flex flex-col items-center lg:justify-start justify-center lg:flex-row gap-2">
                <div className="w-14 h-14 rounded-full cursor-pointer flex items-center justify-center bg-neutral">
                  <p className="text-[28px] font-bold">
                    {getFirstLetter(contact.first_name)}
                  </p>
                  <p className="text-[28px] font-bold">
                    {getFirstLetter(contact.last_name)}
                  </p>
                </div>
                <div className="flex flex-col lg:items-start items-center justify-center gap-1">
                  <div className="flex items-center justify-center lg:block">
                    <h2 className="text-base text-lightLabel whitespace-nowrap overflow-hidden overflow-ellipsis font-medium">
                      {contact.username}
                    </h2>
                  </div>
                  <div className="hidden lg:block">
                    <h2 className="text-[14px] text-left text-lightLabel pr-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
                      Click here to start a conversation
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
