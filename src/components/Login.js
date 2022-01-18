import { signInWithGoogle } from "../services/Firebase.js";
import "../App.css";
const Login = ({ user }) => {
  const onSubmit = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="sign-in">
      <button className="btn" onClick={onSubmit}>
        <div class="google-icon-wrapper">
          <img
            className="google-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google logo"
          />
          <p>Sign in with Google</p>
        </div>
      </button>
    </div>
  );
};

export default Login;
