import Login from "./Pages/Login";
import SignUp from "./Components/SignUp";
import MyDashboard from "./Pages/MyDashboard";
import AllDashboard from "./Pages/AllDashboard";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Stores/store";

import ProtectedRoute from "./Components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "leaflet/dist/leaflet.css";
function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              <Route
                path="/mydashboard"
                element={
                  <ProtectedRoute>
                    <MyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alldashboard"
                element={
                  <ProtectedRoute>
                    <AllDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
