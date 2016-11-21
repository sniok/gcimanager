import React, { Component } from 'react';

import firebase  from './db/firebase.js'

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      tasks: []
    }
    this.tasks = []
  }

  signUp = () => {
    if(!firebase.auth().currentUser)
    {
     var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      })
    } else {
      firebase.auth().signOut()
    }
  }
  
  componentWillMount() {
    /*firebase.auth().onAuthStateChanged(function(user) {
      console.log('hello '+user.displayName)
    })*/
   
    var db = firebase.database();
    db.ref('tasks').on('child_added', snap => {
      if(this.tasks.length < 20){
        this.tasks.push(snap.val())
        this.setState({
          tasks: this.tasks
        })
      }
    })
    
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <button onClick={this.signUp}>sign in</button>
        <p className="App-intro">
          {this.state.tasks.map( task => 
            <div>{task.name}</div>
            )}
        </p>
      </div>
    );
  }
}

export default App;
