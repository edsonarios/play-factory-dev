import './App.css'
import Player from './components/Player'

function App () {
  return (
    <>
      <div>
        <div className="flex justify-center">
          <div className='flex mt-8'>
            <img src="conversor.png" alt="" className='w-16 h-16 mr-4 mt-1' />
            <h1 className="text-4xl font-bold my-4">Video Conversor </h1>
          </div>
        </div>
        <div className='-mt-20'>
          <Player />
        </div>
      </div>
    </>
  )
}

export default App
