import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Home from "./routes/home";
import About from "./routes/about";
import BarHeather from "./components/barHeather";
import Board from "./routes/board";
import Error from "./routes/error";


const router2 = createBrowserRouter([
  {
    path: "/",
    element: <BarHeather />,
    errorElement: <Error/>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/board", element: <Board />},
      { path: "/about", element: <About/>}
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router2} />;
}