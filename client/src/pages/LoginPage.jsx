import React from "react";
import axios from "axios";
import {
  SmallInput,
  SmallPrimaryButton,
  SmallTransparentButton,
} from "../components/SmallComponent";
import { ImSpinner8 } from "react-icons/im";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  // const [message, setMessage] = React.useState("");

  const [lEmail, setLEmail] = React.useState("");
  const [lPassword, setLPassword] = React.useState("");
  const navigate = useNavigate();

  const toggleForm = () => setIsActive(!isActive);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userDetails = {
      first_name: firstName,
      last_name: lastName,
      username: userName,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("api/users/signup", userDetails);

      if (response.status === 201) {
        toast.success("User created successfully. Proceed to login", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });

        setFirstName("");
        setLastName("");
        setUserName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred! Please try again.", {
        duration: 6000,
        icon: "🚨",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("api/users/login", {
        email: lEmail,
        password: lPassword,
      });

      const { token, user } = response.data;
      const tokenExpiry = Date.now() + 60 * 60 * 1000;

      if (response.status === 200) {
        toast.success("Login Successful!", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);

        setLEmail("");
        setLPassword("");

        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiry", tokenExpiry);
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred! Please try again.", {
        duration: 6000,
        icon: "🚨",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container min-h-screen flex items-center lg:justify-center justify-start flex-col h-full w-full px-4 lg:px-0">
        <nav className="h-max w-full"></nav>
        <div
          className="relative lg:block flex flex-col-reverse overflow-hidden bg-seeThrough rounded-3xl shadow-custom-shadow w-full max-w-[768px] min-h-[480px] h-max mt-8 lg:mt-0 lg:p-10"
          id="container"
        >
          <div
            className={`lg:absolute top-0 lg:h-full left-0 transition-all duration-600 ease-in-out w-full lg:w-1/2 ${
              isActive
                ? `lg:translate-x-[100%] lg:opacity-1 lg:animate-move z-[5]`
                : `w-1/2 opacity-0 lg:block hidden z-[1]`
            }`}
          >
            <form
              action=""
              onSubmit={handleCreateUser}
              className="flex items-center justify-center flex-col lg:py-0 py-10 px-10 h-full"
            >
              <h1 className="mb-5 text-white text-3xl font-bold">
                Create Account
              </h1>
              <SmallInput
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your firstname here"
              />
              <SmallInput
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your lastname here"
              />
              <SmallInput
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username here"
              />
              <SmallInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address here"
              />
              <SmallInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password here"
              />
              <SmallPrimaryButton
                type="submit"
                disabled={loading}
                child={loading ? <ImSpinner8 size={18} className="animate-spin"/> : "Sign Up"}
              />
            </form>
          </div>

          <div
            className={`lg:absolute top-0 lg:h-full transition-all duration-600 ease-in-out w-full lg:w-1/2 ${
              isActive
                ? `translate-x-[100%] items-center justify-center flex-col py-0 lg:px-10 h-full hidden`
                : `left-0 z-[2]`
            }`}
          >
            <form
              action=""
              onSubmit={handleLogin}
              className="flex items-center justify-center flex-col lg:py-0 py-10 px-10 h-full"
            >
              <h1 className="mb-5 text-white text-3xl font-bold">Sign In</h1>
              <SmallInput
                type="email"
                value={lEmail}
                onChange={(e) => setLEmail(e.target.value)}
                placeholder="Enter your email address here"
              />
              <SmallInput
                type="password"
                value={lPassword}
                onChange={(e) => setLPassword(e.target.value)}
                placeholder="Enter your password here"
              />
              <a
                className="text-white text-sm mt-[15px] mb-[10px] mx-0"
                href="##"
              >
                Forgot your password?
              </a>
              <SmallPrimaryButton
                type="submit"
                disabled={loading}
                child={loading ? <ImSpinner8 size={18} className="animate-spin"/> : "Sign In"}
              />
            </form>
          </div>
          <div
            className={`lg:absolute top-0 lg:left-1/2 left-0 w-full lg:w-1/2 lg:h-full h-[240px] overflow-hidden transition-all duration-600 ease-in-out z-[1000] ${
              isActive
                ? `lg:translate-x-[-100%] lg:rounded-bl-[0] lg:rounded-tr-[150px] rounded-bl-[100px] rounded-br-[100px]`
                : `lg:rounded-tl-[150px] lg:rounded-br-[0] rounded-bl-[100px] rounded-br-[100px] `
            }`}
          >
            <div
              className={`bg-primary h-full w-[200%] text-white relative left-[-100%] transition-all duration-600 ease-in-out ${
                isActive ? `translate-x-1/2` : `translate-x-0`
              }`}
            >
              <div
                className={`absolute w-1/2 h-full flex items-center justify-center flex-col py-0 px-[30px] text-center top-0 translate-x-0 transition-all duration-600 ease-in-out ${
                  isActive
                    ? `translate-x-[0]`
                    : `lg:translate-x-[-200%] translate-x-0`
                }`}
              >
                <h1 className="text-white text-3xl font-bold ">Welcome Back</h1>
                <p className="text-sm tracking-[0.3px] my-5 mx-0">
                  Enter your personal details to log in and connect with your
                  friends
                </p>
                <SmallTransparentButton
                  onClick={toggleForm}
                  id="login"
                  child="Sign In"
                />
              </div>
              <div
                className={`absolute w-1/2 h-full flex items-center justify-center flex-col py-0 px-[30px] text-center top-0 translate-x-0 transition-all duration-600 ease-in-out ${
                  isActive
                    ? `lg:translate-x-[200%] right-[-100%] lg:right-0`
                    : `right-0 translate-x-[0]`
                }`}
              >
                <h1 className="text-white text-3xl font-bold">Hello Friend</h1>
                <p className="text-sm tracking-[0.3px] my-5 mx-0">
                  Register with your personal details to connect with your
                  friends
                </p>
                <SmallTransparentButton
                  onClick={toggleForm}
                  id="login"
                  child="Sign Up"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
