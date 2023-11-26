import "./App.css";
import Player from "./components/Player";

function App() {
  return (
    <>
      <div>
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold my-4">Video Conversor</h1>
        </div>
        <Player />
      </div>
    </>
  );
}

export default App;
