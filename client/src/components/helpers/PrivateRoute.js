import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import {loadUser} from '../../actions/authActions';

const PrivateRoute = ({
    component: Component,
    auth,
    ...rest
}) => {
    return <Route
        {...rest}
        render={props => true//auth.isAuthenticated
        ? (<Component {...props}/>)
        : <Redirect to={{
            pathname: "/login"
        }}/>}/>
}


export default connect(state => ({auth: state.auth}), {loadUser})(PrivateRoute);