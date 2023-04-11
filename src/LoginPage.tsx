import {useEffect} from 'react';


const AUTHORIZE = "https://accounts.spotify.com/authorize"

function requestAuthorization(){
  let client_id = process.env.REACT_APP_SPOTIFY_API_ID;
  let client_secret = process.env.REACT_APP_SPOTIFY_API_SECRET;
  const redirectUri = process.env.REACT_APP_REDIRECT_URI ?? "";


  let url = AUTHORIZE;
  url += "?client_id=" + client_id;
  url += "&response_type=code";
  url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  url += "&show_dialog=true";
  url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  window.location.href = url; // Show Spotify's authorization screen


}


const LoginPage = () => {
  return (
    <div>
      <h1>Login Page</h1>
     <button onClick={requestAuthorization}>Login</button>
    </div>
  );
};

export default LoginPage;
