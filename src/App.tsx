import {useState} from 'react';
import SongCard from "./SongCard";
import HandleButtons from './HandleButtons';
import FetchApi from './FetchApi';

interface State{
  accessToken: string | null;
  curSong : any;
}

function App() {

  const [state, setState] = useState<State>({
    accessToken: localStorage.getItem("access_token"),
    curSong: null,

  });
  const setCurSong = (song: any) => {
    setState((prevState) => ({
      ...prevState,
      curSong: song
    }));
  };


  return (
    <>
      <FetchApi accessToken={state.accessToken} SetcurSong={setCurSong}/>
      <SongCard/>
      <HandleButtons accessToken={state.accessToken} SetcurSong={setCurSong} curSong={state.curSong}/>
      
    </>
  );
}

export default App;
