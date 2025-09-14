import { Route, Router, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";

const App = () => {
  return (

    <div className="h-screen ">
      <Routes>
        <Route path="/" element={<MainLayout />} />
      </Routes>
    </div>
  )
}

export default App