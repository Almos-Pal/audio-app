import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faPause, faArrowRotateLeft, faForwardStep } from '@fortawesome/free-solid-svg-icons';

interface Props {
  isPlaying: boolean;
  curTime: number;
  fullTime: number
  setCurTime: (time: number) => void;
}

interface State {
  playState: boolean;
}

function PlayerButton(props: Props) {
  const { isPlaying, curTime,fullTime, setCurTime } = props;
  const [state, setState] = useState<State>({ playState: isPlaying });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
  
    if (state.playState) {
      intervalId = setInterval(() => {
        if (curTime < fullTime) {
          setCurTime(curTime + 1);
        } 
      }, 1000);
    }
  
    return () => clearInterval(intervalId);
  }, [state.playState, curTime, setCurTime, fullTime]);
  
  const handlePlayPause = (): void => {
    if (curTime == fullTime){

      setCurTime(0);


    }else{
      setState((prevState) => ({
        playState: !prevState.playState
      }));
    }

   
  };

  const getPlayPauseIcon = (): IconDefinition => {
    if (state.playState) {
      if (curTime < fullTime) {
        return faPause;
      } else {
        return faArrowRotateLeft;
      }
    } else {
      return faPlay;
    }
  };

  return (
    <div className="PlayerController">
      <div className="backward">
        <FontAwesomeIcon icon={faForwardStep} />
      </div>
      <div className="play" onClick={handlePlayPause}>
        <FontAwesomeIcon icon={getPlayPauseIcon()} />
      </div>
      <div className="forward">
        <FontAwesomeIcon icon={faForwardStep} />
      </div>
    </div>
  );
}

export default PlayerButton;
