function TopBar() {
  const name = localStorage.getItem("userName") || "user";
  const email = localStorage.getItem("userEmail") || "user@email.com";

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("activeSection");
    window.location.href = "/login.html"; // same as your old app
  };

  return (
    <nav className="top-bar">
      <div className="info-1">
        <div className="profile">
          <div className="profile-info">
            <p className="para">@{name}</p>
            <p className="para">{email}</p>
          </div>

          <img
            className="profile-pic"
            src="/images/prf.png"
            alt="profile"
          />

          <div className="info logout-wrapper" onClick={handleLogout}>
            <img
              className="logo-logout"
              src="/images/logout.png"
              alt="logout"
            />
            <span className="logout-tooltip">Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopBar;
