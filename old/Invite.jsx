import React, { Component, PropTypes } from 'react'
import RegisterForm from './RegisterForm.jsx'
import { createContainer } from 'meteor/react-meteor-data'

import { Meteor } from 'meteor/meteor'
import { Invites } from '../api/invites.js'

class Invite extends Component {
    checkInvite = () => {
      if(!this.props.invites)
        return <div>No invites left :(</div>

      if(this.props.currentUser)
        return <div>You are already logged in.</div>

      if(!this.props.invites.find(invite => invite.invite === this.props.params.invite)){
        return <div>Wrong invite</div>
      }
      setTimeout(() => {
        $('#at-field-invite').val(this.props.params.invite)
      },200) // i'm sorry
      return <RegisterForm />
    }
    render() {
        return(
            <div>
                { this.checkInvite() }
            </div>
        )
    }
}

Invite.propTypes = {
  currentUser: PropTypes.object,
  invites: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('invites')
  return {
    currentUser: Meteor.user(),
    invites: Invites.find({}).fetch(),
  };
}, Invite);
