import './App.css'
import { useEffect, useState } from 'react';
import { fetchUpcomingLaunches, fetchPreviousLaunches, getCountdownTime } from './backend/data'

// since this interface is used here and in data.ts make it somewhere and import it into both places
export interface Launch {   // this interface can and should be expanded to include more information down the road
    name: string;
    net: string; 
}

function App() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [viewTitle, setViewTitle] = useState<string>('');
  const [nextLaunch, setNextLaunch] = useState<Launch | null>(null);
  const [nextLaunchCountdown, setNextLaunchCountdown] = useState<[number, number, number, number]>([0, 0, 0, 0]);

  useEffect(() => {
    const fetchNextLaunch = async () => {
      const upcomingLaunches = await fetchUpcomingLaunches();
      if (upcomingLaunches.length > 0) {
        const nextLaunch = upcomingLaunches[0];
        setNextLaunch(nextLaunch);
      }
    };
    fetchNextLaunch();
  }, []);

  useEffect(() => {
    if (!nextLaunch) return;

    const updateCountdown = () => {
      const countdown = getCountdownTime(nextLaunch.net);
      setNextLaunchCountdown(countdown);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextLaunch]);  

  const handleShowUpcoming = async () => {
    const upcomingLaunches = await fetchUpcomingLaunches();
    setLaunches(upcomingLaunches);
    setViewTitle('Upcoming Launches');
  };

  const handleShowPrevious = async () => {
    const previousLaunches = await fetchPreviousLaunches();
    setLaunches(previousLaunches);
    setViewTitle('Previous Launches');
  };

  return (
    <>
      <h1 className="title">Rocket Launch Countdown</h1>
      {nextLaunch && (
        <><h2 className="launchTitle">Next Launch</h2><div className="launchCard">
          <h1 className="nextLaunchName">{nextLaunch.name}</h1>
          <h1 className="nextLaunchDate">{new Date(nextLaunch.net).toLocaleString()}</h1>
          {/* <h1 className="nextLaunchCountdown">
              T-{nextLaunchCountdown[0].toString().padStart(2, '0')}:
              {nextLaunchCountdown[1].toString().padStart(2, '0')}:
              {nextLaunchCountdown[2].toString().padStart(2, '0')}:
              {nextLaunchCountdown[3].toString().padStart(2, '0')}
            </h1> */}
            <div className="countdownContainer">
              {['Days', 'Hours', 'Mins', 'Secs'].map((label, i) => (
                <div className="countdownBlock" key={label}>
                  <div className="countdownValue">{nextLaunchCountdown[i].toString().padStart(2, '0')}</div>
                  <div className="countdownLabel">{label}</div>
                </div>
              ))}
            </div>
          {/* <h3>Days Hours Mins Secs</h3> */}
        </div></>
      )}
  
      <div className="buttonGroup">
        <button onClick={handleShowUpcoming}>Upcoming Launches</button>
        <button onClick={handleShowPrevious}>Previous Launches</button>
      </div>

      {(<div className="launchList">
          <h2 className="launchTitle">{viewTitle}</h2>
          {launches.map((launch, index) => (
            <div key={index} className="launchCard">
              <h3>{launch.name}</h3>
              <p><strong>Launch Time:</strong> {new Date(launch.net).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
