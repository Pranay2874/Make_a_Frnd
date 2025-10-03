// app.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Signup } from './Pages/signup'; // Import Signup Page
import { Signin } from './Pages/signin'; // Import Signin Page
import { Home } from './Pages/Home';
import AboutUs from "./Pages/AboutUs";
import Profile from "./Pages/Profile";
import RandomChat from './Pages/RandomChat'; 
import InterestChat from './Pages/InterestChat'; 
import Chat from './components/Chat';

const router = createBrowserRouter([
  { path: "/signin", element: <Signin /> },
  { path: "/signup", element: <Signup /> },
  { path: "/", element: <Signup /> },
  { path: "/home", element: <Home /> },
  { path: "/Profile", element: <Profile /> },
  { path: "/AboutUs", element: <AboutUs /> }, // Added AboutUs as it was imported but unused
  { path: "/RandomChat", element: <RandomChat /> },

  // 💥 NEW: This route fixes the "No routes matched location" error.
  // The parameter name :usertargetId matches the name used in chat.jsx: useParams().
  { path: "/chat/:usertargetId", element: <Chat /> }, 

  // Dynamic route for InterestChat is correct
  { path: "/InterestChat/:interest", element: <InterestChat /> },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;