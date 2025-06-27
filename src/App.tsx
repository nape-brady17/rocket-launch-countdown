import './App.css'
import { fetchUpcomingLaunches, fetchPreviousLaunches } from './backend/data'

function App() {

  return (
    <>
      <h1>Rocket Launch Countdown</h1>
      <div className="card">
        <button onClick={() => fetchUpcomingLaunches()}>
          Upcoming Launches
        </button>
        <button onClick={() => fetchPreviousLaunches()}>
          Previous Launches
        </button>
      </div>
    </>
  )
}

export default App
