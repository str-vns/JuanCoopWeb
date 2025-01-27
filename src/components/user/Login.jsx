import { useState, useEffect } from "react";
import loginImage from "../../assets/img/shop.png";
import googleLogo from "../../assets/img/google.png";
import "../../assets/css/login.css";
import { login } from "@redux/actions/authActions";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@utils/helpers";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin1 } from "@redux/Actions/userActions";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const currentUser =  getCurrentUser();
  const [showPassword, setShowPassword] = useState(false);
  const { userLoading, userError, userSuccess } = useSelector((state) => state.authInfo);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginStatus, setLoginStatus] = useState(null); 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {

      if (userError) {
        setErrorMessage("Invalid email or password. Please try again.");
        toast.error("Invalid email or password. Please try again.", {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: "error",
          closeButton: false,
        });
      }
  }, []);

  const loginHandler = (e) => {
    const user = { 
      email: email,
      password: password   
    }
    e.preventDefault();
    dispatch(login(user));
 
  };

  useEffect(() => {
    if (currentUser && currentUser.roles) {
      const roles = currentUser.roles;
      if (roles.includes("Customer") && roles.includes("Member")) {
        navigate('/');
      } else if (roles.includes("Admin")) {
        navigate('/dashboard');
      } else if (roles.includes("Cooperative") && roles.includes("Customer")) {
        navigate('/coopdashboard');
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  const handleGoogleLogin = (response) => {
    dispatch(googleLogin1(response));
    navigate('/');
  }
  return (
    <div className="login-container">
      <div className="login-form">
        <p className="login-title">Sign in</p>
        <p className="login-subtitle">Login to access your account</p>
        <form className="login-form-container" onSubmit={loginHandler}>

          <div className="form-group">
            <label className="form-label">Enter your Email</label>
            <input
              type="email"
              id="email"
              placeholder="juandelacruz@gmail.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group-password">
            <label htmlFor="password" className="form-label">Enter your Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="*******"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
                role="button"
                tabIndex={0}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <a href="/forgotpassword" className="forgot-password-link">Forgot Password?</a>
          </div>

          <button type="submit" className="submit-button" disabled={userLoading}>
            {userLoading === true ? (
              <div className="spinner"></div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Error Message */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="or-divider">
            <span>OR</span>
          </div>


            <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log('Login google failed')}
            cookiePolicy={"single_host_origin"}
            render = {(renderProps) => (
              <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
               type="button" className="google-button">
              <img src={googleLogo} alt="Google logo" className="google-logo" />
              </button>
            )}
            />
           

          <p className="signup-link">
            No account?{" "}
            <a href="/Register" className="signup-link-anchor">
              Sign up
            </a>
          </p>
        </form>
      </div>

      <div className="login-image-section">
        <img src={loginImage} alt="Login" />
      </div>
    </div>
  );
};

export default Login;
