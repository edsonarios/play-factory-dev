import './App.css'
import PlyrComponent from './components/player-video'

function App () {
  return (
    <>
      <div>
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold my-4">Video Conversor</h1>
        </div>

        <PlyrComponent />
      </div>
    </>
  )
}

export default App
