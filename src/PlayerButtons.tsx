import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faPause, faArrowRotateLeft, faForwardStep } from '@fortawesome/free-solid-svg-icons';

interface Props {
  isPlaying: boolean;
  curTime: number;
  fullTime: number
  accessToken: string |null
  setCurTime: (time: number) => void;
  SetcurSong: (curSong: any) => void;
  curSong: any;

}

interface State {
  playState: boolean;
}

function PlayerButton(props: Props) {
  const { isPlaying, curTime,fullTime, accessToken, setCurTime,SetcurSong,curSong } = props;
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
    if(!state.playState){

      PlayStart()
    }
    if (curTime == fullTime){

      setCurTime(0);


    }else{
      setState((prevState) => ({
        playState: !prevState.playState
      }));
    }

   
  };

  const PlayStart =async () => {
    let PutParams = {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
      body: JSON.stringify({
        "uris": [curSong.uri],
        "position_ms": curTime*1000

    })

        
        
      }
      let playSong =  fetch(`https://api.spotify.com/v1/me/player/play`,PutParams)
      .then(response => {
        if (response.ok) {
          console.log('Start position updated successfully');
        } else {
          console.error('Error Playing the track');
        }
      })
      .catch(error => console.error(error));
      console.log(playSong)
    }

  const PlayPause =async () => {
  let PutParams = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
      },
      
      
    }
    let playSong =  fetch(`https://api.spotify.com/v1/me/player/pause`,PutParams)
    .then(response => {
      if (response.ok) {
        console.log('Track position updated successfully');
      } else {
        console.error('Error updating track position');
      }
    })
    .catch(error => console.error(error));
  }

  const getPlayPauseIcon = (): IconDefinition => {

    if (state.playState) {

      if (curTime < fullTime) {
        console.log(curTime)
        return faPause;

      } else {
        return faArrowRotateLeft;
      }
    } else {
      PlayPause()
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
