import './App.css'
import { useState } from 'react';
import { fetchUpcomingLaunches, fetchPreviousLaunches } from './backend/data'

// since this interface is used here and in data.ts make it somewhere and import it into both places
export interface Launch {   // this interface can and should be expanded to include more information down the road
    name: string;
    net: string; 
}

function App() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [viewTitle, setViewTitle] = useState<string>('');

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
      <h1>Rocket Launch Countdown</h1>
      <div className="buttonGroup">
        <button onClick={handleShowUpcoming}>Upcoming Launches</button>
        <button onClick={handleShowPrevious}>Previous Launches</button>
      </div>

      {(<div className="launchList">
          <h2>{viewTitle}</h2>
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
