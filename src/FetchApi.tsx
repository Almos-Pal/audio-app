import { useState, useEffect, } from "react";
import { useParams } from 'react-router-dom';




interface State {
  authCode : string;
  searchInput: string;
  refreshToken: string | null;
  albumData: any[];
  renderedAlbumNames: string[];
  trackData: any[];
  selectedAlbum: string;
  curAudio: any;
}
interface Props{
  accessToken: string | null;
  SetcurSong: (curSong: any) => void;
}


function FetchApi(props: Props) {
    const {accessToken,SetcurSong} = props
    const [state, setState] = useState<State>({
    authCode :"",
    searchInput: "",
    refreshToken: localStorage.getItem("refresh_token"),
    albumData: [],
    renderedAlbumNames: [],
    trackData: [],
    selectedAlbum: "",
    curAudio: null
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code")
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_REDIRECT_URI || '')}&client_id=${process.env.REACT_APP_SPOTIFY_API_ID || ''}&client_secret=${process.env.REACT_APP_SPOTIFY_API_SECRET || ''}`
    };

    



    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((res) => res.json())
      .then((data) => {
        if(data.access_token){
        localStorage.setItem("access_token",data.access_token)
        localStorage.setItem("refresh_token",data.refresh_token)

        }
        console.log(data)
       
  });
  }, []);




  async function search() {
    let searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    };

    let artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${state.searchInput}&type=artist`,
      searchParams
    )
      .then((res) => res.json())
      .then((data) => data.artists.items[0].id);
    


      let albumData :string[]= []; // Set albumData to an empty array
      let renderedAlbumNames :string[] = [];
      
      let albums = await fetch(
        `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=20`,
        searchParams
      )
        .then((res) => res.json())
        .then((data) => data.items);
      
      albums.forEach((album: any) => {
        if (!renderedAlbumNames.includes(album.name)) {
          albumData.push(album);
          renderedAlbumNames.push(album.name);
        }
      });
      
      setState((prevState) => ({
        ...prevState,
        albumData,
        renderedAlbumNames
      }));
      

   

    

  }


  async function selectAlbum(albumId: string) {
    let searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    };
    




    let tracks = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}/tracks?include_groups=track&market=US&limit=20`,
      searchParams
    )
      .then((res) => res.json())
      .then((data) => data.items);

    setState((prevState) => ({
      ...prevState,
      trackData: tracks,
      selectedAlbum: albumId
    }));
    console.log(tracks)
  }

  const playAudio = async (audioUrl: string) => {
    let searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken}`
      }
    }
    let PutParams = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${
          accessToken}`,
      },
      body: JSON.stringify({"uris": [audioUrl]})
    }


    
    let playSong = await fetch(`https://api.spotify.com/v1/me/player/play/`,PutParams);
    console.log(playSong)
    
    
      if (state.curAudio && !state.curAudio.paused) {
        state.curAudio.pause();
      }
    
      const curAudio = new Audio(audioUrl);
      setState(prevState => ({ ...prevState, curAudio }));
      curAudio.play();
  };

  const PlaySong = async (track: any) => {
    SetcurSong(track)
    console.log(track)
    await playAudio(track.uri)
  }

  return (
    <>
      <input
        type="text"
        value={state.searchInput}
        onChange={(e) =>
          setState((prevState) => ({
            ...prevState,
            searchInput: e.target.value
          }))
        }
      />
      <button onClick={search}>Search</button>
      <div>
  {state.albumData.map((album) => (
    <div key={album.id} onClick={() =>  selectAlbum(album.id)}>
      <p>{album.name}</p>
      <img src={album.images[0].url} alt={album.name} />
    </div>
    
  ))}
  <div>
  {state.trackData.map((track) => (
    <p key={track.id} onClick={()=> PlaySong(track)}>{track.name}</p>
  ))}
</div>
</div>
    </>
  );
}

export default FetchApi;