import React, { useEffect } from "react";
import { AddFriendsTab, FriendRequestTab, SmallInput } from "./SmallComponent";
import axios from "axios";
import { io } from "socket.io-client";
import { IoPersonAddSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hide } from "../features/reducers/displayReducer";

const socket = io(`https://chat-app-server-irq0.onrender.com`);

const RequestBar = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [friendRequests, setFriendRequests] = React.useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  // useEffect to fetch all the friend requests sent to the user
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`/api/users/friend-requests/${userId}`);
        setFriendRequests(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching friend requests: ", error);
      }
    };

    fetchFriendRequests();
  }, [userId]);

  // useEffect to update the friend requests using websockets anytime a friend-request is sent
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`/api/users/friend-requests/${userId}`);
        setFriendRequests(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching friend requests: ", error);
      }
    };

    const handleReceiveRequest = (request) => {
      if (request.receiver_id === userId) {
        // setFriendRequests((prevRequests) => [...prevRequests, request]);
        fetchFriendRequests();
      }
    };

    socket.on("receive-request", handleReceiveRequest);

    return () => {
      socket.off("receive-request", handleReceiveRequest);
    };
  });

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;
        const response = await axios.get("/api/users/search", {
          params: { q: value, userId },
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log(response.data);
        setResults(response.data);
      } catch (err) {
        console.log("Error searching for users:", err);
      }
    } else {
      setResults([]);
    }
  };

  const handleSendRequest = async (receiverId) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const senderId = user.id;

    try {
      const response = await axios.post("/api/users/friend-request/send", {
        sender_id: senderId,
        receiver_id: receiverId,
      });

      if (response.status === 201) {
        toast.success("Request Sent", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });

        socket.emit("send-request", {
          sender_id: senderId,
          receiver_id: receiverId,
        });

        setResults((prevResults) =>
          prevResults.map((user) =>
            user.id === receiverId ? { ...user, requestType: "sent" } : user
          )
        );
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request. Please try again.", {
        duration: 6000,
        icon: "🚨",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId, id) => {
    try {
      const response = await axios.post("/api/users/friend-request/accept", {
        requestId,
      });
      if (response.status === 200) {
        await axios.post("/api/conversations/create", {
          user1_id: userId,
          user2_id: id,
        });

        socket.emit("send-convo", {
          user1_id: userId,
          user2_id: id,
        });

        toast.success("Friend request accepted!");
        setFriendRequests(
          friendRequests.filter((request) => request.request_id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await axios.post("/api/users/friend-request/reject", {
        requestId,
      });
      if (response.status === 200) {
        toast.success("Friend request rejected.");
        setFriendRequests(
          friendRequests.filter((request) => request.request_id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("Failed to reject friend request.");
    }
  };

  return (
    <>
      <div className="absolute z-[50] w-[340px] min-h-[340px] bg-bg_color border border-acc_color rounded-xl right-3 top-[calc(8px+100%)] lg:top-3 lg:left-[calc(8px+100%)] p-3">
        <h1 className="text-base text-lightLabel font-semibold text-center">
          Add Friends
        </h1>
        <SmallInput
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
        />
        <div className="max-h-[480px] overflow-y-scroll hide-scrollbar">
          <div className="flex flex-col gap-2 mb-3">
            <h1 className="text-base text-lightLabel font-semibold">
              Added Me
            </h1>
            {friendRequests.length === 0 ? (
              <div className="h-[200px] bg-secondary rounded-lg flex items-center justify-center">
                <p className="text-center my-auto text-[12px] text-label">
                  You have no pending requests
                </p>
              </div>
            ) : (
              friendRequests.map((request) => (
                <FriendRequestTab
                  key={request.request_id}
                  firstName={request.first_name}
                  lastName={request.last_name}
                  username={request.username}
                  acceptOnClick={() =>
                    handleAccept(request.request_id, request.id)
                  }
                  rejectOnClick={() => handleReject(request.request_id)}
                />
              ))
            )}
          </div>
          {results.length > 0 && (
            <div className="flex flex-col gap-2">
              <h1 className="text-base text-lightLabel font-semibold">
                New Friends
              </h1>
              <div className="">
                {results.map((user) => (
                  <AddFriendsTab
                    key={user.id}
                    userId={user.id}
                    firstName={user.first_name}
                    lastName={user.last_name}
                    username={user.username}
                    disabled={user.requestType === "sent" || loading}
                    onClick={() => handleSendRequest(user.id)}
                    icon={user.requestType === "sent" ? "" : <IoPersonAddSharp size={15} />}
                    child={user.requestType === "sent" ? "Pending" : "Add"}
                    status={user.requestStatus}
                    chat="Chat"
                    chatClick={() => dispatch(hide())}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RequestBar;
