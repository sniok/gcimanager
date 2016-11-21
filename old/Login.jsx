import React, { Component, PropTypes } from 'react'
import LoginForm from './LoginForm.jsx'
import { createContainer } from 'meteor/react-meteor-data'

import { Meteor } from 'meteor/meteor'

class Login extends Component {
    render() {
        return(
            <div>
                { this.props.currentUser ? <div>{this.props.currentUser.username}<br/><button onClick={()=>{Meteor.logout()}}>Log Out</button></div> : <LoginForm /> }
            </div>
        )
    }
}

Login.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, Login);
