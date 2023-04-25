import { useState, useEffect } from 'react';

interface State {
  seekbarValue: number;
}

interface Props {
  curTime: number;
  fullTime: number;
  accessToken: string | null;
  setCurTime: (newCurTime: number) => void;
}

function Seekbar(props: Props) {
  const { curTime, fullTime,accessToken, setCurTime } = props;
  const [state, setState] = useState<State>({ seekbarValue: curTime });
  const { seekbarValue } = state;
  
  const setSeekbarValue = (newValue: number): void => {
    setState({ ...state, seekbarValue: newValue });
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  useEffect(() => {
    setState(prevState => ({ ...prevState, seekbarValue: curTime }));
  }, [curTime]);
  
  const SeekbarMovement =  (audioUrl:string) => {
      
    let PutParams = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
      },
      
      
    }

   
    
    let playSong =  fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seekbarValue*1000}`,PutParams)
    .then(response => {
      if (response.ok) {
        console.log('Track position updated successfully');
      } else {
        console.error('Error updating track position');
      }
    })
    .catch(error => console.error(error));
  }

  const handleSeekbarChange = async(event: React.ChangeEvent<HTMLInputElement>)=> {
    const newCurTime = Number(event.target.value);
    console.log(seekbarValue)
    SeekbarMovement("alma")
    setSeekbarValue(newCurTime);
    setCurTime(newCurTime);



  };

  return (
    <div className="SeekContainer">
      <p className="curTime">{formatTime(curTime)}</p>
      <div className="Seekbar">
        <input
          type="range"
          name="seekbar"
          min="0"
          max={fullTime}
          step="1"
          value={seekbarValue}
          onChange={handleSeekbarChange}
          
        />
      </div>
      <p className="fullTime">{formatTime(fullTime)}</p>
    </div>
  );
}

export default Seekbar;
