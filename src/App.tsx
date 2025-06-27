import './App.css'
import { fetchUpcomingLaunches } from './backend/data'

function App() {

  return (
    <>
      <h1>Rocket Launch Countdown</h1>
      <div className="card">
        <button onClick={() => fetchUpcomingLaunches()}>
          get launches
        </button>
      </div>
    </>
  )
}

export default App
