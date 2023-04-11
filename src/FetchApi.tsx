import { useState, useEffect, } from "react";
import { useParams } from 'react-router-dom';

interface State {
  authCode : string;
  searchInput: string;
  accessToken: string;
  albumData: any[];
  renderedAlbumNames: string[];
  trackData: any[];
  selectedAlbum: string;
  curAudio: any;
}


function FetchApi() {
  let code1 :string = ""
  const { code } = useParams<{ code: string }>();
  const [state, setState] = useState<State>({
    authCode :"",
    searchInput: "",
    accessToken: "",
    albumData: [],
    renderedAlbumNames: [],
    trackData: [],
    selectedAlbum: "",
    curAudio: null
  });

  useEffect(() => {
    let authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=authorization_code&code=${code1}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_REDIRECT_URI || '')}&client_id=${process.env.REACT_APP_SPOTIFY_API_ID || ''}&client_secret=${process.env.REACT_APP_SPOTIFY_API_SECRET || ''}`
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setState((prevState) => ({
          ...prevState,
          accessToken: data.access_token
        }))
  });
  }, []);




  async function search() {
    let searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.accessToken}`
      }
    };

    let artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${state.searchInput}&type=artist`,
      searchParams
    )
      .then((res) => res.json())
      .then((data) => data.artists.items[0].id);

    let albums = await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=20`,
      searchParams
    )
      .then((res) => res.json())
      .then((data) => data.items);

    let renderedAlbumNames = [...state.renderedAlbumNames];
    let albumData = [...state.albumData];

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

    let cur_playing = await fetch("https://api.spotify.com/v1/me",searchParams)
    .then(res => res.json())
    .then(data => console.log(data))


    

  }


  async function selectAlbum(albumId: string) {
    let searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.accessToken}`
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

     
      if (state.curAudio && !state.curAudio.paused) {
        state.curAudio.pause();
      }
    
      const curAudio = new Audio(audioUrl);
      setState(prevState => ({ ...prevState, curAudio }));
      curAudio.play();
  };
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
    <p key={track.id} onClick={()=> playAudio(track.preview_url)}>{track.name}</p>
  ))}
</div>
</div>
    </>
  );
}

export default FetchApi;
