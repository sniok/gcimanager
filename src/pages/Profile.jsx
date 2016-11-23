import React, { Component } from 'react'

import Banner from '../components/Banner.jsx'
import Content from '../components/Content.jsx'

import firebase from '../db/firebase.js'

import { TextField, RaisedButton, CircularProgress } from 'material-ui'

import { browserHistory } from 'react-router'

class Profile extends Component {

  constructor(props){
    super(props)

    this.state = {
      loggedIn: false,
      profile: null,
      saving: false,
    }
  }

  save = () => {
    this.setState({saving: true})
    this.state.profile.updateProfile({
      displayName: this.name.input.value,
    }).then( () => {
      this.setState({saving: false})
    }, function(error) {
      console.log("Error when saving")
    });
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({loggedIn:true, profile: user})
      } else {
        this.setState({loggedIn:false})
        browserHistory.push('/login')
      }
    });
  }

  render () {
    return(
      <div>
        <Banner title="Profile" />
        <Content>
          {this.state.profile ?
            <div>
            <TextField
              disabled={true}
              floatingLabelText="Email"
              defaultValue={this.state.profile.email}
            /><br/>
            <TextField
              ref={c=>this.name=c}
              floatingLabelText="Display name"
              defaultValue={this.state.profile.displayName}
            /><br/>
          <RaisedButton
            onClick={this.save}
            label="Save"
            primary={true}
          />
        {this.state.saving ? <CircularProgress style={{marginLeft:10}} size={20} thickness={3} /> : ""}
          </div>
          :
          ""}
        </Content>
      </div>
    )
  }
}

export default Profile
