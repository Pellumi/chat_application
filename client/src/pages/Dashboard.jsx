import ChatWindow from "../components/ChatWindow";
import SideNavBar from "../components/SideNavBar";

export const Dashboard = () => {
  return (
    <>
      <div className="w-full flex lg:flex-row flex-col h-full">
        <SideNavBar />
        <ChatWindow />
      </div>
    </>
  );
};
