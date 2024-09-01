import React, { useState } from "react";
import PropTypes from "prop-types";

const ContactBar = ({ contacts = [], onSelectContact }) => {
  const [contact, setContact] = useState([]);
  const getFirstLetter = (word) => word?.charAt(0).toUpperCase() || "";

  React.useEffect(() => {
    if (!contacts) return;
    const fetchContact = async () => {
      try {
        setContact(contacts);
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };

    fetchContact();
  }, [contacts]);

  return (
    <>
      <div className="h-full w-full flex lg:flex-col overflow-scroll lg:overflow-auto items-center justify-start py-2 px-[7px]">
        {contact.length === 0 ? (
          <p className="text-center my-auto text-[12px] text-label">
            You have no contact
          </p>
        ) : (
          contact.map((contact) => (
            <div
              className="lg:w-full w-max rounded-xl lg:p-[9px] lg:px-[9px] p-2.5 px-3 hover:bg-seeThrough cursor-pointer"
              onClick={() => onSelectContact(contact)}
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
            </div>
          ))
        )}
      </div>
    </>
  );
};

ContactBar.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.any).isRequired,
  onSelectContact: PropTypes.func.isRequired,
};

export default ContactBar;
