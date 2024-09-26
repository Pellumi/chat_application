import React, { useEffect } from "react";
import axios from "axios";
import { SmallChatInput } from "./SmallComponent";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { IoMdSend } from "react-icons/io";
import { FaChevronLeft } from "react-icons/fa";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import { removeActive } from "../features/reducers/activeTabSlice";

const socket = io(`https://${window.location.hostname}:3003`);

const ChatWindow = () => {
  const dispatch = useDispatch();
  const [contact, setContact] = React.useState([]);
  const { userId } = useParams();

  const inputRef = React.useRef(null);
  const messagesEndRef = React.useRef(null);

  const [text, setText] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user.id;

  // useEffect to fetch the receivers contact
  React.useEffect(() => {
    if (!currentUserId) return;
    if (currentUserId == null) return;

    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `api/conversations/contact/${currentUserId}`
        );

        // setContact(response.data);

        if (userId) {
          const contacts = response.data.find(
            (c) => c.user_id === parseInt(userId, 10)
          );
          setContact(contacts || null);
        }
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      }
    };

    fetchContacts();
  }, [currentUserId, userId]);

  // useEffect to focus on the input bar of the page on component render
  useEffect(() => {
    if (!contact) return;
    if (contact.length == 0) return;

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [contact]);

  // useEffect to scroll to the bottom of the page to display the messages at the bottom
  useEffect(() => {
    if (!contact) return;
    if (contact.length == 0) return;

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [contact, messages]); // i dont like the scroll effect, ill see how i can make it start at the bottom at once instead of scrolling there

  // useEffect to fetch all the messages in the convo on component render
  useEffect(() => {
    if (!contact) return;
    if (contact.length == 0) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `api/messages/get-message/${contact.conversation_id}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [contact]);

  // useEffect to update the messages using websockets anytime a message is sent or received
  useEffect(() => {
    if (!contact) return;
    if (contact.length == 0) return;

    const handleReceiveMessage = (message) => {
      if (message.conversation_id === contact.conversation_id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [contact]); // this client-side filtering of the messages is only good for a small amount of users, for a large amunt of users, server-side filtering is preferrable

  const getFirstLetter = (word) => word?.charAt(0).toUpperCase() || "";

  const clearContact = () => {
    setContact([]);
    dispatch(removeActive());
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (contact.length == 0 || !text.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post("api/messages/send-message", {
        conversation_id: contact.conversation_id,
        sender_id: currentUserId,
        receiver_id: contact.user_id,
        message_text: text,
      });

      if (response.status === 201) {
        socket.emit("send-message", {
          conversation_id: contact.conversation_id,
          sender_id: currentUserId,
          receiver_id: contact.user_id,
          message_text: text,
          timestamp: new Date().toISOString(),
        });
        setText("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred! Please try again.",
        {
          duration: 6000,
          icon: "🚨",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatTimeWithLowercase = (date) => {
    const timeString = new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    const [time, period] = timeString.split(" ");
    return `${time} ${period?.toLowerCase()}`;
  };

  if (!userId) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <>
      <div className="pl-[10px] pb-[10px] flex-grow">
        <div className="pr-[10px] flex flex-col h-full">
          <div className="py-3 w-full">
            <div className="flex">
              <Link
                onClick={clearContact}
                to="/"
                className="w-9 h-9 rounded-full cursor-pointer flex items-center justify-center bg-gray-700 mr-3"
              >
                <span className="w-full h-full flex items-center justify-center">
                  <FaChevronLeft />
                </span>
              </Link>
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-full cursor-pointer flex items-center justify-center bg-neutral">
                  <p className="text-[18px] font-bold">
                    {getFirstLetter(contact.first_name)}
                  </p>
                  <p className="text-[18px] font-bold">
                    {getFirstLetter(contact.last_name)}
                  </p>
                </div>
                <h3 className="text-base text-lightLabel whitespace-nowrap font-medium">
                  {contact.username}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-[url('/pexels-steve-1292241.jpg')] relative overflow-hidden bg-cover bg-no-repeat bg-center flex-grow flex flex-col w-full rounded-xl">
            <div className="absolute inset-0 z-[0] bg-black opacity-70"></div>
            <div
              ref={messagesEndRef}
              className="flex-grow relative z-0 overflow-y-scroll hide-scrollbar p-4 lg:mx-10"
            >
              {messages.map((message, index) => {
                const currentMessageDate = new Date(
                  message.timestamp
                ).toDateString();
                const previousMessageDate =
                  index > 0
                    ? new Date(messages[index - 1].timestamp).toDateString()
                    : null;

                return (
                  <div key={message.id} className="w-full">
                    {currentMessageDate !== previousMessageDate && (
                      <div className="flex items-center my-4">
                        {/* <div className="flex-grow border-t border-gray-500"></div> */}
                        <span className="mx-auto bg-bg_color py-2 px-4 font-medium rounded-lg uppercase text-xs text-gray-400">
                          {new Date(message.timestamp).getDate() ===
                          new Date().getDate()
                            ? "Today"
                            : formatDate(message.timestamp)}
                        </span>
                        {/* <div className="flex-grow border-t border-gray-500"></div> */}
                      </div>
                    )}
                    <div className="w-full flex items-start">
                      {message.sender_id === currentUserId ? (
                        <div className="ml-auto flex bg-primary px-3 py-1 mb-1 w-max shadow-md rounded-lg rounded-tr-none break-words whitespace-normal">
                          <p className="lg:max-w-[450px] max-w-[150px] text-sm my-1 mr-2 break-words whitespace-normal">
                            {message.message_text}
                          </p>
                          <span className=" text-[10px] flex items-end text-gray-400 text-right">
                            {formatTimeWithLowercase(message.timestamp)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex bg-gray-950 px-3 py-1 mb-1 w-max shadow-md rounded-lg rounded-tl-none break-words whitespace-normal">
                          <p className="lg:max-w-[450px] max-w-[150px] text-sm my-1 mr-2 break-words whitespace-normal">
                            {message.message_text}
                          </p>
                          <span className=" text-[10px] flex items-end text-gray-400 text-right">
                            {formatTimeWithLowercase(message.timestamp)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-full relative z-0 pt-2 pb-5 pl-2.5 pr-2 flex items-center justify-center">
              <form
                action=""
                onSubmit={handleSendMessage}
                className="w-full h-full gap-2 flex items-center justify-center"
              >
                <SmallChatInput
                  ref={inputRef}
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  classname="w-[582px] h-14 rounded-xl rounded-t-none text-white bg-seeThrough px-4"
                  placeholder="Send a chat"
                />
                <button
                  disabled={loading}
                  className="w-14 hidden h-14 rounded-xl rounded-tl-none cursor-pointer items-center justify-center bg-black"
                >
                  <IoMdSend size={28} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ChatWindow.propTypes = {
//   contact: PropTypes.any,
//   onClearContact: PropTypes.func.isRequired,
// };

export default ChatWindow;
