import { baseURL } from "app/store/apiService";
import axios from "axios";
import GoogleLogin from "react-google-login";
import history from "@history";

const clientId = "420148180512-2dctmfuv3d2r8l108h32h5hvnb2o99b9.apps.googleusercontent.com"

const onSuccess = (response) => {

    axios.post(baseURL + "/users/sign-in", response.profileObj).then(response => {
        if (response.status === 200) {
            localStorage.setItem("USER", JSON.stringify(response.data));
            if (localStorage.getItem("USER") != null) {
                if (JSON.parse(localStorage.getItem("USER")).role === "LEARNER") {
                    window.open("/sign-in", "_self");
                }
                else {
                    history.push("/dashboards/project");
                }
            }
            //handleSignInSuccess(userData, accessToken);
        }
        else {
            //handleSignInFailure(response);
        }
    })
}

const onFailure = (response) => {
    console.log("LOGIN FAILURE")
}

export default function Login() {
    return (
        <div style={{marginTop: '30px'}} id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={false}
            />
        </div>
    )
}
