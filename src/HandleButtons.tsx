import { useEffect, useState } from 'react';
import PlayerButton from './PlayerButtons';
import Seekbar from './Seekbar';

const HandleButtons = () => {
  const [curTime, setCurTime] = useState(0);
  const fullTime:number = 200;
  let isPlaying: boolean = false;
 




  return (
    <div className="HandleButtons">
      <PlayerButton isPlaying={isPlaying} curTime={curTime} fullTime={fullTime} setCurTime={setCurTime} />
      <Seekbar curTime={curTime} fullTime={fullTime} onCurTimeChange={setCurTime} />
    </div>
  );
};

export default HandleButtons;
