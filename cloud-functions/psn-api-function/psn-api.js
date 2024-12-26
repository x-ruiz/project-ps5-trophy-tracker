// import functions framework
const functions = require("@google-cloud/functions-framework");

const {
  exchangeNpssoForCode,
  exchangeCodeForAccessToken,
  makeUniversalSearch,
  exchangeRefreshTokenForAuthTokens,
  getProfileFromUserName,
} = require("psn-api");

async function getAuthToken(npsso) {
  const accessCode = await exchangeNpssoForCode(npsso);
  var authorization = await exchangeCodeForAccessToken(accessCode);
  return authorization;
}

async function refreshAuthToken(authorization) {
  const updatedAuthorization = await exchangeRefreshTokenForAuthTokens(
    authorization["refreshToken"]
  );
  return updatedAuthorization;
}

async function getUserId(username, npsso) {
  authorization = getAuthToken(npsso);
  const allAccountsSearchResults = await makeUniversalSearch(
    authorization,
    username,
    "SocialAllAccounts"
  );
  return allAccountsSearchResults;
}

// Main Entry Point
functions.http("get", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  // deconstruct query params
  const npsso = req.query.npsso;
  const username = req.query.username;
  const accessToken = req.query.accessToken;
  const path = req.query.path;

  if (path == "getToken") {
    const authToken = await getAuthToken(npsso);
    res.send(authToken);
  } else if (path == "refreshToken") {
    const authToken = await getAuthToken(npsso);
    console.log(`Auth token ${authToken["accessToken"]}`);
    const updatedAuthToken = await refreshAuthToken(authToken);
    console.log(`Updated Auth token ${updatedAuthToken["accessToken"]}`);
    res.send(updatedAuthToken);
  } else if (path == "getUserId") {
    const userId = await getUserId(username, npsso);
    res.send(userId);
  } else {
    res.send({
      error: `No path matched - ${path}`,
    });
  }
});
