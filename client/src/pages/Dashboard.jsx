import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ChatWindow from "../components/ChatWindow";
import SideNavBar from "../components/SideNavBar";
import { useNavigate, useParams } from "react-router-dom";

const socket = io(`http://${window.location.hostname}:3003`);

export const Dashboard = () => {
  const [contacts, setContacts] = React.useState([]);
  const [selectedContact, setSelectedContact] = React.useState(null);

  const { userId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user?.id;

  React.useEffect(() => {
    const handleConvo = (convo) => {
      // console.log(convo)
      if (userId === convo.user1_id || userId === convo.user2_id) {
        setContacts((prevContacts) => [...prevContacts, contacts]);
      }
    };

    socket.on("receive-convo", handleConvo);

    return () => {
      socket.off("receive-convo", handleConvo);
    };
  });

  React.useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `api/conversations/contact/${currentUserId}`
        );

        setContacts(response.data);

        if (userId) {
          const contact = response.data.find(
            (c) => c.user_id === parseInt(userId, 10)
          );
          setSelectedContact(contact || null);
        }
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      }
    };

    fetchContacts();
  }, [currentUserId, userId]);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    navigate(`/${contact.user_id}`);
  };

  const handleClearContact = () => {
    setSelectedContact(null);
    navigate("/");
  };

  return (
    <>
      <div className="w-full flex lg:flex-row flex-col h-full">
        <SideNavBar contacts={contacts} onSelectContact={handleSelectContact} />
        <ChatWindow
          contact={selectedContact}
          onClearContact={handleClearContact}
        />
      </div>
    </>
  );
};
