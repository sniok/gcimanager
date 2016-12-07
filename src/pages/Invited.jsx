import React, { Component } from 'react'

import { browserHistory } from 'react-router'
import Banner from '../components/Banner.jsx'
import Content from '../components/Content.jsx'
import {
  CircularProgress,
  TextField,
  RaisedButton,
} from 'material-ui'
import firebase from '../db/firebase.js'

class Invited extends Component {
  constructor(props){
    super(props)

    this.state = {
      loading: true,
      isValid: false,
      loggedIn: false,
      errorMessage: false,
      createdUser: false,
    }
  }

  createNewUser = (email, password) => {
    // Create new firebase user
    this.setState({loading: true, createdUser: true})
    firebase.auth().createUserWithEmailAndPassword(email, password).catch( error => {
      var errorMessage = error.message
      this.setState({errorMessage,loading: false, createdUser: false})
    })
  }
  activateInvite = () => {
    if(this.state.createdUser && this.state.loggedIn){
      firebase.database().ref(`invites/${this.props.params.invite}`).update({
        activated: true,
      })
      browserHistory.push('/')
    }
  }

  componentWillMount() {
    // Checking if logged in
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({loggedIn:true})
      } else {
        this.setState({loggedIn:false})
      }
    })
    // Checking for invite
    firebase.database().ref(`/invites/${this.props.params.invite}`).once('value').then( snap => {
      if(snap.val() != null && !snap.val().activated){
        this.setState({loading: false, isValid: true})
      }else{
        this.setState({loading: false})
      }
    })
  }
  render () {
    this.activateInvite()
    return(
      <div>
        <Banner title="Register"/>
        <Content>
          {
            this.state.loading ?
            <div style={{width:50,margin:"20px auto"}}>
                <CircularProgress
                    size={50}
                    thickness={4}
                />
            </div>
            :
            (
              this.state.loggedIn ?
              "You are already logged in"
              :
              (
                this.state.isValid ?
                <div>
                  You have been invited to the GCI Task manager.<br/>
                  { this.state.errorMessage ? <b>{this.state.errorMessage}<br/></b> : "" }
                  <TextField ref={c=>this._email=c} floatingLabelText="Email" /><br/>
                  <TextField ref={c=>this._password=c} floatingLabelText="Password" type="password" /><br/>
                  <RaisedButton
                    primary={true}
                    label="Register"
                    onClick={()=>{
                      this.createNewUser(this._email.input.value,this._password.input.value)
                    }}/>
                </div>
                :
                <div>Invite is not valid</div>
              )
            )
          }
        </Content>
      </div>
    )
  }
}

export default Invited;
