import './index.css';

import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';

import App from './pages/App';
import Channel from './pages/Channel';
import Login from './pages/Login';
import Signup from './pages/Signup';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/channel" component={Channel} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
    </Router>
  ),
  root,
);