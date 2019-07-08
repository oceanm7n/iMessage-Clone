import React, {Component} from 'react';

import {connect} from 'react-redux';
import {getAllUsers, openDialogue} from '../../actions/controlsActions';

class Controls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        this
            .props
            .getAllUsers();
    }
    newDialogue = () => {
        const newDialogue = this.state.searchValue;
        this.props.openDialogue(newDialogue);
    }
    render() {
        return (
            <div className='controls'>
                <h2 style={{"marginTop": "10px"}}>Find a user:</h2>
                <input
                    type='text'
                    name='searchValue'
                    value={this.state.searchValue}
                    onChange={this.handleChange}/>
                <button onClick={this.newDialogue}>Send message</button>
            </div>
        );
    }
}

export default connect(state => ({controls: state.controls}), {getAllUsers, openDialogue})(Controls);