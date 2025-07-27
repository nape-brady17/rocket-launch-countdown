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
        if (!nextLaunch) {
          setNextLaunch({name: 'No upcoming launch', net: ''})
        }
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
    if (!upcomingLaunches || upcomingLaunches.length === 0) {
      setLaunches([{ name: 'No upcoming launches', net: '' }]);
      setViewTitle('Upcoming Launches');
      return;
    }
    const filteredLaunches = upcomingLaunches.filter(launch => launch.name !== nextLaunch?.name);
    if (!filteredLaunches || filteredLaunches.length === 0) {
      setLaunches([{ name: 'No other upcoming launches', net: ''}]);
      setViewTitle('Upcoming Launches');
      return;
    }
    setLaunches(filteredLaunches);
    setViewTitle('Upcoming Launches');
  };

  const handleShowPrevious = async () => {
    const previousLaunches = await fetchPreviousLaunches();
    if (!previousLaunches) {
      setLaunches([{ name: 'No previous launches', net: '' }]);
      setViewTitle('Previous Launches');
      return;
    }
    setLaunches(previousLaunches);
    setViewTitle('Previous Launches');
  };

  return (
    <>
      <h1 className="title">Florida Rocket Launch Countdown</h1>
      {nextLaunch && (
        <><h2 className="launchTitle">Next Launch</h2><div className="launchCard">
          <h1 className="nextLaunchName">{nextLaunch.name}</h1>
          <h1 className="nextLaunchDate">{new Date(nextLaunch.net).toLocaleString()}</h1>
          <div className="countdownContainer">
            {['Days', 'Hours', 'Mins', 'Secs'].map((label, i) => (
              <div className="countdownBlock" key={label}>
                <div className="countdownValue">
                  {i === 0 ? 'T-' : ''}
                  {nextLaunchCountdown[i].toString().padStart(2, '0')}
                  {i < 3 ? ':' : ''}
                </div>
                <div className="countdownLabel">{label}</div>
              </div>
            ))}
          </div>
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
              <h3 className="launchName">{launch.name}</h3>
              <p className="launchTime">{launch.net ? new Date(launch.net).toLocaleString() : ''}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
