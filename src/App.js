import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import 'react-notifications/lib/notifications.css';
import Example from './pages/Example';
import Home from './pages/Home';

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Switch>
          <Route path="/login" render={() => <Login />} />
          <Route path="/test" render={() => <Example />} />
          <Route path="/home" render={() => <Home />} />

          <Redirect from="*" to="/login" />
        </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
