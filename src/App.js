import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Home from "./routes/home";
import About from "./routes/about";
import BarHeather from "./components/barHeather";
import Board, { loaderBoard } from "./routes/board";


const router2 = createBrowserRouter([
  {
    path: "/",
    element: <BarHeather />,
    errorElement: <p>Error</p>,
    children: [
      { path: "/wos_traslator/", element: <Home /> },
      { path: "/wos_traslator/board/:Path", element: <Board />, loader:loaderBoard},
      { path: "/wos_traslator/about", element: <About/>}
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router2} />;
}