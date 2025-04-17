import { useState, useCallback, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  SignupInput,
  SigninInput,
  signupSchema,
  signinSchema,
} from "@mrityunjay__jha117/reload_common";
import { useDropzone } from "react-dropzone";
export default function Credentials() {
  const navigate = useNavigate();
  // Toggle between login and sign up views.
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  // Message state for error or success feedback.
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // State for signup form using the imported SignupInput type.
  const [signupData, setSignupData] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
    image: "",
    about: "",
  });

  // State for login form using the imported SigninInput type.
  const [loginData, setLoginData] = useState<SigninInput>({
    email: "",
    password: "",
  });

  // Handle changes for signup form fields.
  const handleSignupChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle changes for login form fields.
  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Upload image using your API to post on Cloudinary.
  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.append("file", file);

    const res = await fetch(
      "https://my-app.mrityunjay-jha2005.workers.dev/api/v1/image/upload",
      {
        method: "POST",
        body,
      }
    );
    const data = await res.json();
    if (res.ok && data.url) {
      return data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };

  // Dropzone callback for profile image upload.
  const onDropImage = useCallback(async (acceptedFiles: File[]) => {
    try {
      const url = await uploadImage(acceptedFiles[0]);
      setSignupData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      alert("Image upload failed");
    }
  }, []);

  // Set up the dropzone for the profile image.
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropImage,
    maxFiles: 1,
  });

  // Validate and submit the signup form.
  const handleSignupSubmit = async () => {
    const validation = signupSchema.safeParse(signupData);
    if (!validation.success) {
      setMessage(
        "Signup validation error: " + JSON.stringify(validation.error.errors)
      );
      return;
    }
    setIsSubmitting(true);
    try {
      // setIsSubmitting=true
      const res = await fetch(
        "https://my-app.mrityunjay-jha2005.workers.dev/api/v1/user/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.data),
        }
      );
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("jwt", data.jwt);
        setMessage("Signup successful!");
        navigate("/window");
      } else {
        setMessage("Signup error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Error during signup, please try again.");
    }
  };

  // Validate and submit the login form.
  const handleLoginSubmit = async () => {
    const validation = signinSchema.safeParse(loginData);
    if (!validation.success) {
      setMessage(
        "Signin validation error: " + JSON.stringify(validation.error.errors)
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(
        "https://my-app.mrityunjay-jha2005.workers.dev/api/v1/user/signin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.data),
        }
      );
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("jwt", data.jwt);
        setMessage("Login successful!");
        navigate("/window");
      } else {
        setMessage("Login error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Signin error:", error);
      setMessage("Error during login, please try again.");
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md"
        style={{ backgroundImage: "url('./../images/carousel_images/9.jpg')" }}
      ></div>
      {/* Dark overlay to soften the background */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Main Content Container */}
      <div className="relative flex h-screen w-full items-center justify-center">
        {/* Desktop Layout */}
        <div className="hidden md:flex relative flex-row lg:h-2/3 w-5/6 rounded-xl overflow-hidden shadow-lg bg-white bg-opacity-90">
          {/* LOGIN Section */}
          <div className="w-1/2 flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl lg:text-7xl mb-7 tracking-wide">LOGIN</h2>
            <hr className="border-red-600 border-2 mt-3 mb-10 w-2/3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-64 lg:w-80 h-12 p-3 mb-6 bg-gray-200 rounded-lg tracking-wide"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-64 lg:w-80 h-12 p-3 mb-6 bg-gray-200 rounded-lg tracking-wide"
            />
            {/* LOGIN Button */}
            <button
              onClick={handleLoginSubmit}
              type="submit"
              className="cursor-pointer relative overflow-hidden w-40 lg:w-55 text-xl lg:text-2xl p-2 border-4 border-red-500 rounded-full bg-red-500 text-white tracking-wide group transition-all duration-500 hover:border-red-500"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                </span>
              ) : (
                <>
                  <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative group-hover:text-red-500 transition-colors duration-500">
                    LOGIN
                  </span>
                </>
              )}
            </button>
            <p className="text-lg lg:text-xl mt-3 tracking-wide">
              Don't have an account?{" "}
              <span
                className="hover:text-blue-500 cursor-pointer"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </span>
            </p>
          </div>

          {/* SIGN UP Section */}
          <div className="w-1/2 h-full flex flex-col items-center justify-center p-2">
            <h2 className="text-4xl lg:text-7xl mb-7 tracking-wide">SIGN UP</h2>
            <hr className="border-red-600 border-2 mb-10 w-2/3" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={signupData.name}
              onChange={handleSignupChange}
              className="w-64 lg:w-80 h-12 p-3 mb-6 bg-gray-200 rounded-lg tracking-wide"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              className="w-64 lg:w-80 h-12 p-3 mb-6 bg-gray-200 rounded-lg tracking-wide"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              className="w-64 lg:w-80 h-12 p-3 mb-6 bg-gray-200 rounded-lg tracking-wide"
            />

            {/* Profile Image Dropzone with fixed height */}
            <div
              className="border-2 border-dashed border-gray-400 p-4 rounded-xl text-center mb-6 w-64 lg:w-80 h-10 flex items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {signupData.image ? (
                <p className="text-sm font-medium text-gray-400">Done</p>
              ) : (
                <p className="text-sm">
                  Drag &amp; drop profile image here or click to select
                </p>
              )}
            </div>

            <textarea
              name="about"
              placeholder="About you"
              value={signupData.about}
              onChange={handleSignupChange}
              className="w-64 lg:w-80 h-20 p-3 mb-6 bg-gray-200 rounded-lg tracking-wide resize-none"
            ></textarea>

            {/* SIGN UP Button */}
            <button
              onClick={handleSignupSubmit}
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer relative overflow-hidden w-40 lg:w-55 text-xl lg:text-2xl p-2 border-4 border-red-500 rounded-full bg-red-500 text-white tracking-wide group transition-all duration-500 hover:border-red-500"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                </span>
              ) : (
                <>
                  <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative group-hover:text-red-500 transition-colors duration-500">
                    SIGN UP
                  </span>
                </>
              )}
            </button>
            <p className="text-lg lg:text-xl mt-3 tracking-wide">
              Already have an account?{" "}
              <span
                className="cursor-pointer hover:text-blue-500"
                onClick={() => setIsSignUp(false)}
              >
                LOGIN
              </span>
            </p>
          </div>

          {/* Overlay Section */}
          <div
            className="absolute z-10 bottom-0 top-0 w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white p-8 transition-all duration-500 tracking-wide"
            style={{ left: isSignUp ? "0" : "50%" }}
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-8">
              {isSignUp ? "Hello, Friend!" : "Welcome Back!"}
            </h2>

            <p className="mb-8 text-center text-xl lg:text-2xl leading-relaxed">
              {isSignUp ? (
                <>
                  Enter your personal details and start your journey with us.
                  <br />
                  <span className="tracking-wide text-white text-lg lg:text-xl font-medium">
                    Already have an account!
                  </span>
                </>
              ) : (
                <>
                  <span className="text-3xl lg:text-4xl max-w-md text-center text-white font-semibold">
                    To stay connected with us <br /> please login with your
                    personal info.
                  </span>
                  <br />
                  <span className="tracking-wide text-white text-lg lg:text-xl font-medium">
                    Not connected yet!
                  </span>
                </>
              )}
            </p>

            {/* Toggle Button on the Overlay */}
            <button
              className="cursor-pointer relative overflow-hidden w-48 lg:w-60 text-lg lg:text-xl p-3 rounded-full tracking-wide bg-white text-red-500 border-4 border-white group transition-all duration-500"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              <span className="absolute inset-0 bg-red-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="relative group-hover:text-white transition-colors duration-500">
                {isSignUp ? "LOGIN" : "SIGN UP"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-full max-w-md p-4">
          {isSignUp ? (
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-lg bg-opacity-90 tracking-wide">
              <h2 className="text-6xl mb-7 tracking-wide">SIGN UP</h2>
              <hr className="border-red-600 border-2 mb-15 w-2/3" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={signupData.name}
                onChange={handleSignupChange}
                className="w-full h-12 p-3 mb-4 bg-gray-200 rounded-lg tracking-wide"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handleSignupChange}
                className="w-full h-12 p-3 mb-4 bg-gray-200 rounded-lg tracking-wide"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
                className="w-full h-12 p-3 mb-4 bg-gray-200 rounded-lg tracking-wide"
              />
              {/* Profile Image Dropzone for Mobile */}
              <div
                className="border-2 border-dashed border-green-400 p-4 rounded-xl text-center mb-4"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {signupData.image ? (
                  <img
                    src={signupData.image}
                    alt="Profile"
                    className="mt-2 w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                ) : (
                  <p>Drag & drop profile image here or click to select</p>
                )}
              </div>
              <textarea
                name="about"
                placeholder="About you"
                value={signupData.about}
                onChange={handleSignupChange}
                className="w-full h-12 p-3 mb-4 bg-gray-200 rounded-lg tracking-wide"
              ></textarea>
              {/* Mobile SIGN UP Button */}

              <button
                onClick={handleSignupSubmit}
                type="submit"
                disabled={isSubmitting}
                className="relative mx-auto w-[300px] lg:w-[400px] lg:h-[60px] h-[60px] text-xl lg:text-3xl border-6 border-red-500 rounded-full overflow-hidden bg-red-500 text-white tracking-wide group transition-all duration-500 mb-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                  </span>
                ) : (
                  <>
                    <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                    <span className="relative group-hover:text-red-500 transition-colors duration-500">
                      SIGN UP
                    </span>
                  </>
                )}
              </button>

              <p className="text-lg mt-3 tracking-wide">
                Already have an account?{" "}
                <span
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => setIsSignUp(false)}
                >
                  LOGIN
                </span>
              </p>
            </div>
          ) : (
            <div className="w-5/6 h-full mx-auto flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-xl bg-opacity-90 tracking-wide">
              <h2 className="text-3xl tracking-widest ">LOGIN</h2>
              <hr className="border-red-600 border-2 mt-2 mb-7 w-5/6" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-11/12 h-10 p-2 mb-3 text-xs bg-gray-200 rounded-sm "
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-11/12 h-10 p-2 mb-3 text-xs bg-gray-200 rounded-sm "
              />
              {/* Mobile LOGIN Button */}

              <button
                onClick={handleLoginSubmit}
                type="submit"
                disabled={isSubmitting}
                className="w-3/4 flex justify-center group items-center text-md p-2 rounded-full bg-red-500 text-white h-8  transition-all duration-500"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                  </span>
                ) : (
                  <>
                    <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                    <span className="relative group-hover:text-red-500 transition-colors duration-500">
                      LOGIN
                    </span>
                  </>
                )}
              </button>

              <p className="text-lg mt-3 tracking-wide">
                Don't have an account?{" "}
                <span
                  className="hover:text-blue-500 cursor-pointer"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Notification message */}
      {message && (
        <div className="absolute bottom-30 sm:bottom-10 sm:bottom-10 left-1/2 text-sm sm:text-xl md:text-2xl transform -translate-x-1/2 bg-red-100 text-black text-center py-3 sm:py-4 px-6 sm:px-20 rounded-full">
          Wrong inputs entered
        </div>
      )}
    </div>
  );
}
