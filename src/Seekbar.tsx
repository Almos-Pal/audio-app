import { useState, useEffect } from 'react';

interface State {
  seekbarValue: number;
}

interface Props {
  curTime: number;
  fullTime: number;
  onCurTimeChange: (newCurTime: number) => void;
}

function Seekbar(props: Props) {
  const { curTime, fullTime, onCurTimeChange } = props;
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
  

  const handleSeekbarChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newCurTime = Number(event.target.value);
    setSeekbarValue(newCurTime);
    onCurTimeChange(newCurTime);
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
