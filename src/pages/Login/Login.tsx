import axios from "axios";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/utils/Loading";
import { ActionTypes } from "../../consts";
import { useAppContext } from "../../hooks";
import "./login.css";

function Login() {
  const [loading, setLoading] = useState(true);
  const [clientId] = useState(import.meta.env.VITE_CLIENT_ID);
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
  const [scope] = useState(import.meta.env.VITE_SCOPE);
  const [state] = useState(nanoid());
  const [disableLogin, setDisableLogin] = useState(false);
  const navigate = useNavigate();
  const locationRef = useLocation();
  const { dispatchHandler } = useAppContext();

  useEffect(() => {
    // get the url params
    const urlParams = new URLSearchParams(locationRef.search);
    const codeParam = urlParams.get("code");
    const stateParam = urlParams.get("state");

    // set the path name to session storage
    const pathName = (locationRef?.state as any)?.from.pathname;
    if (pathName) {
      sessionStorage.setItem("fromPath", pathName);
    }

    // if no query params, try to authenticate
    if (!codeParam || !stateParam) {
      routeToAuthPage();
      return;
    }

    // validate the auth state against the session storage item
    // if not same then enable login
    if (stateParam !== sessionStorage.getItem("authState")) {
      setLoading(false);
      return;
    }

    fetchToken(codeParam);
  }, []);

  async function fetchToken(code: string) {
    const { data } = await axios.post(
      "https://todoist.com/oauth/access_token",
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const { error, access_token } = data;

    // check for error
    if (error) {
      // if the error is 'invalid_grant' try to authenticate again
      if (error === "invalid_grant") {
        routeToAuthPage();
        return;
      }

      // show login
      setLoading(false);
      return;
    }

    // set the token to global state
    dispatchHandler(ActionTypes.TOKEN, access_token);

    // route to home page
    routeToPath();
  }

  function routeToAuthPage() {
    // to validate the state after authentication, store the state in session storage
    sessionStorage.setItem("authState", state);
    const url = `https://todoist.com/oauth/authorize?client_id=${clientId}&scope=${scope}&state=${state}`;
    location.href = url;
    setDisableLogin(true);
  }

  function routeToPath() {
    // check the session storage for path
    const pathName = sessionStorage.getItem("fromPath");
    // if path name found then route to that path or default home
    const origin = pathName || "/app";
    // clear the path name from session storage if any
    sessionStorage.removeItem("fromPath");
    // nagivate to the origin
    navigate(origin);
  }

  return (
    <>
      <div className=" login flex h-full w-full items-center justify-center bg-primary-200">
        <div className="background">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="z-10 flex h-full w-full flex-col items-center bg-primary-300 shadow-lg sm:h-[95%] sm:max-w-lg sm:rounded-[40px]">
          <h3 className="px-16 py-12 text-center text-3xl font-bold text-white xl:text-4xl">
            Daily with <img src="assets/images/todoist_standard_white.svg" />
          </h3>

          {!loading ? (
            <div className="flex h-full w-full flex-col items-center">
              <div className="logo bg-primary m-4 max-h-[50%] w-[95%] rounded-[30px] p-8">
                <img
                  src="assets/images/tasks.svg"
                  alt="logo"
                  className="box-shadow-3d h-full w-full"
                />
              </div>
              <div className="flex w-full justify-center gap-2 pt-20">
                <button
                  className="flex w-[90%] items-center justify-center rounded-xl border border-transparent bg-primary-800 px-8 py-3 text-base font-medium text-white shadow hover:bg-primary-900 hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-400 disabled:shadow-none"
                  onClick={routeToAuthPage}
                  disabled={disableLogin}
                >
                  Login / Sign Up
                </button>
              </div>
            </div>
          ) : (
            <div className="grid h-full w-full place-content-center">
              <Loading color="white" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
