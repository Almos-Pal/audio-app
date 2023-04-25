import { useEffect, useState } from 'react';
import PlayerButton from './PlayerButtons';
import Seekbar from './Seekbar';


interface Props {
  accessToken: string | null;
  SetcurSong: (curSong: any) => void;
  curSong: any;
}

interface State {
  curTime: number;
  fullTime: number;
}

const HandleButtons = (props: Props) => {
  const { accessToken, SetcurSong, curSong } = props;
  const [state, setState] = useState<State>({
    curTime: 0,
    fullTime: 0
  });

  const isPlaying: boolean = false;

  useEffect(() => {
    if (curSong) {
      setState(prevState => ({
        ...prevState,
        curTime: 0,
        fullTime: Math.round(curSong.duration_ms / 1000)
      }));
    }
  }, [curSong]);

  const setCurTime = (time: number) => {
    setState(prevState => ({
      ...prevState,
      curTime: time
    }));
  }

  return (
    <div className="HandleButtons">
      <PlayerButton isPlaying={isPlaying} curTime={state.curTime} fullTime={state.fullTime} accessToken={accessToken} setCurTime={setCurTime} SetcurSong={SetcurSong} curSong={curSong} />
      <Seekbar curTime={state.curTime} fullTime={state.fullTime} accessToken={accessToken} setCurTime={setCurTime} />
    </div>
  );
};

export default HandleButtons;
