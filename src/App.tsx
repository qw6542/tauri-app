import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Home, About, List } from './pages';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/list">List</Link>
            </li>
          </ul>
        </nav>

        <hr />
        <Routes>
        <Route path="/" Component={Home} />
        <Route path="/about" Component={About} />
        <Route path="/list" Component={List} />

        </Routes>

      </div>
    </Router>
  );
};

export default App;