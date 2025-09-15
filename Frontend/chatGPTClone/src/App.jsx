import { Route, Router, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

const App = () => {
  return (

    <div className="h-screen ">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </ Route>
      </Routes>
    </div>
  )
}

export default App