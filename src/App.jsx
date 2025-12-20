import { useState } from "react";
import Sidebar from "./components/sidebar";
import TopBar from "./components/topbar";


import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Todo from "./pages/Todo";
import Reminders from "./pages/Reminders";
import Archive from "./pages/Archive";

function App() {
  const [section, setSection] = useState(
    localStorage.getItem("activeSection") || "dashboard"
  );

  const renderSection = () => {
    switch (section) {
      case "habits":
        return <Habits />;
      case "todo":
        return <Todo />;
      case "reminders":
        return <Reminders />;
      case "archive":
        return <Archive />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-root">
      <Sidebar section={section} setSection={setSection} />

      <div className="main-wrapper">
        <TopBar />
        <div id="main-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default App;
