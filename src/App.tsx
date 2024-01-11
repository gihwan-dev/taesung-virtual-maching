import DeviceState from "./DeviceState";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <DeviceState />
    </div>
  );
}

export default App;
