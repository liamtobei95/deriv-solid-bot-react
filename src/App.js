import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import DerivAPIProvider from './context/DerivAPIContext';
import Login from './pages/Login';
import 'react-notifications/lib/notifications.css';
import Example from './pages/Example';
import Home from './pages/Home';
import Solid from './pages/Solid';

function App() {
  return (
    <div className="bg-customBlack">
      <DerivAPIProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/login" render={() => <Login />} />
            <Route path="/test" render={() => <Example />} />
            <Route path="/home" render={() => <Home />} />
            <Route path="/solid" render={() => <Solid />} />

            <Redirect from="*" to="/login" />
          </Switch>
          </BrowserRouter>
        </DerivAPIProvider>
    </div>
  );
}

export default App;
