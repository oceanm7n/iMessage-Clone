import React, {Component} from 'react';

import {connect} from 'react-redux';
import {logout} from '../actions/authActions';
import {Link} from 'react-router-dom';

class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleLogout = () => {
        this.props.logout();
    }

    render() {
        const auth = this.props.auth.isAuthenticated;
        const user = this.props.auth.user || null;
        let username;
        if (user) username = user.name;
        const guestHeader = <div className='navbar'>
            <Link to='/' className='navbar-header'>iMessage clone</Link>
            <Link className='navbar-btn' to='/register'>Register</Link>
            <Link className='navbar-btn' to='/login'>Login</Link>
        </div>;

        const userHeader = <div className='navbar'>
            <span className='navbar-header'>Welcome, {username}!</span>
            <button onClick={this.handleLogout} className='navbar-btn'>Logout</button>
            <Link className='navbar-btn' to='/inbox'>Inbox</Link>
            <Link className='navbar-btn' to='/home'>Home</Link>
        </div>
        return <React.Fragment>
            {this.props.auth.isLoading?'Loading...':auth
                ? userHeader
                : guestHeader}</React.Fragment>
    }
}

const mapStateToProps = (state) => ({auth: state.auth})
export default connect(mapStateToProps, {logout})(AppNavbar);