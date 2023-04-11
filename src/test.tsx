import { useState, useEffect } from "react";

interface State {
  searchInput: string;
  userToken: string;
  albumData: any[];
  renderedAlbumNames: string[];
  trackData: any[];
  selectedAlbum: string;
  hasToken: boolean;
}

function FetchApi() {
  const [state, setState] = useState<State>({
    searchInput: "",
    userToken: "",
    albumData: [],
    renderedAlbumNames: [],
    trackData: [],
    selectedAlbum: "",
    hasToken: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (token) {
      setState((prevState) => ({ ...prevState, userToken: token, hasToken: true }));
    } else if (!state.userToken) {
      // redirect to login page if user does not have access token
      window.location.href = "/login";
    }
  }, [state.hasToken, state.userToken]);

  let searchParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.userToken}`,
    },
  };

  async function search() {
    let artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${state.searchInput}&type=artist`,
      searchParams
    )
      .then((res) => res.json())
      .then((data) => console.log(data));

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
      renderedAlbumNames,
    }));

    let cur_playing = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, searchParams)
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  async function selectAlbum(albumId: string) {
    let tracks = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}/tracks?include_groups=track&market=US&limit=20`,
      searchParams
    )
      .then((res) => res.json())
      .then((data) => data.items);

    setState((prevState) => ({
      ...prevState,
      trackData: tracks,
      selectedAlbum: albumId,
    }));
  }

  const playAudio = async (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
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
          <div key={album.id} onClick={() => selectAlbum(album.id)}>
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
