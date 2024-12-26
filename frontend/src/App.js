import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState({});
  const [accountId, setAccountId] = useState("");

  // Retrieve npsso for psn authentication
  const npsso = process.env.REACT_APP_NPSSO;

  // get Access token on load
  // TODO: Change this to user input npsso token event
  useEffect(() => {
    async function getToken() {
      // Exchange npsso for access code and access code for access token
      fetch(
        `https://us-central1-ps5-trophy-tracker.cloudfunctions.net/psn-api-function/?path=getToken&npsso=${npsso}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Process the data
          setToken(data);
          console.log(
            `[INFO] Successfully Retrieved PSN access token ${data["accessToken"]}`
          );
        })
        .catch((error) => {
          console.log(`[ERROR] Error retrieving PSN access token ${error}`);
        });
    }

    // call getToken on page load and if token is == string
    if (token["accessToken"] == null) {
      getToken();
    }
  }, []);

  // Get user id
  function getUserId(user) {
    fetch(
      `https://us-central1-ps5-trophy-tracker.cloudfunctions.net/psn-api-function/?path=getUserId&username=${user}&npsso=${npsso}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Process the data
        setAccountId(data);
        console.log(
          `[INFO] Successfully retrieved psn account id for user ${user}`
        );
      })
      .catch((error) => {
        console.log(
          `[ERROR] Error retrieving psn account id for user ${user} - ${error}`
        );
      });
  }

  // Get user id
  function refreshAuthToken() {
    fetch(
      `https://us-central1-ps5-trophy-tracker.cloudfunctions.net/psn-api-function/?path=refreshToken&npsso=${npsso}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Process the data
        console.log(data);
        setToken(data);
        console.log(
          `[INFO] Successfully Refreshed PSN access token ${data["error"]}`
        );
      })
      .catch((error) => {
        console.log(`[ERROR] Error refreshing psn PSN access token ${error}`);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          {token["accessToken"] != null ? (
            <p>Token Retrieved</p>
          ) : (
            <p>Empty Token</p>
          )}
        </div>
        <button onClick={() => refreshAuthToken()}>Refresh Auth Token</button>
        <button onClick={() => getUserId("Kodiris")}>
          Click me! {accountId}
        </button>
      </header>
    </div>
  );
}

export default App;
