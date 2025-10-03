import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Signup } from './Pages/signup'; // Import Signup Page
import { Signin } from './Pages/signin'; // Import Signin Page
import { Home } from './Pages/Home';
import AboutUs from "./Pages/AboutUs";
import Profile from "./Pages/Profile";
import RandomChat from './Pages/RandomChat'; 
import InterestChat from './Pages/InterestChat'; 

const router = createBrowserRouter([
  { path: "/signin", element: <Signin /> },
  { path: "/signup", element: <Signup /> },
  { path: "/", element: <Signup /> },
  { path: "/home", element: <Home /> },
  { path: "/Profile", element: <Profile /> },
  { path: "/RandomChat", element: <RandomChat /> },
  // Update this route to handle dynamic `interest` parameter
  { path: "/InterestChat/:interest", element: <InterestChat /> },  // Dynamic route
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
