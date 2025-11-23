import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>🔗 TinyLink</h1>
        </Link>
        <nav>
          <Link to="/" className="nav-link">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;