import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SignUp from "./pages/SignUp";
import AuthPage from "./pages/AuthPage";
import LogIn from "./pages/LogIn";

const App = () => {
  const queryClient = new QueryClient(
    {
      defaultOptions: {
        queries: {
          // staleTime: 6 * 1000,   // 1 min
          // cacheTime: 10 * 60 * 1000,  // 10 minutes (optional)
          refetchOnWindowFocus: false,
        },
      },
    }
  )
  return (

    <div className="h-screen ">

      <QueryClientProvider
        client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Routes>
          <Route path="/" element={<AuthPage />}>
            <Route index element={<LogIn />} />
            <Route path="signUp" element={<SignUp />} />
          </Route>
          <Route path="/home" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="chat/:chatId" element={<ChatPage />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </div>
  )
}

export default App