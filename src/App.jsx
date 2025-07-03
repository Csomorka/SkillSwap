import {
  BrowserRouter,
  Navigate,
  replace,
  Route,
  Routes,
} from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Feed from "./pages/Feed";
import Account from "./pages/Account";
import MessageInbox from "./pages/MessageInbox";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PageNotFound from "./pages/PageNotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import ChatRoom from "./messages/ChatRoom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="feed" />} />
              <Route path="feed" element={<Feed />} />
              <Route path="messages" element={<MessageInbox />} />
              <Route path="/messages/:conversationId" element={<ChatRoom />} />
              <Route path="account" element={<Account />} />
              <Route path="profile/:userId" element={<ProfilePage />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
