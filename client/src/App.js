import React, {Component} from 'react';
import './App.css';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';

import store from './store';
import {loadUser} from './actions/authActions';
import PrivateRoute from './components/helpers/PrivateRoute';

import AppNavbar from './components/AppNavbar'
import Register from './components/sign/Register';
import Home from './components/Home';
import About from './components/About';
import Login from './components/sign/Login';
import Inbox from './components/containers/Inbox';

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser())
    }

    render() {
        const auth = store
            .getState()
            .auth
            .isAuthenticated;
        return (
            <Provider store={store}>
                <Router>
                    <AppNavbar/>
                    <Switch>
                        <Route
                            path='/'
                            exact
                            component={auth
                            ? Home
                            : About}/>
                        <Route path='/register' exact component={Register}/>
                        <Route path='/login' exact component={Login}/>
                        <PrivateRoute exact path="/inbox" component={Inbox}/>
                    </Switch>
                </Router>
            </Provider>
        );
    }

}

export default App;
