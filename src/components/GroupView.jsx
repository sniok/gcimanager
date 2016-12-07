import React, { Component } from 'react'

import TaskTable from './TaskTable.jsx'
import ReactMarkdown from 'react-markdown'

import {
  FlatButton,
  FontIcon,
  RaisedButton,
} from 'material-ui'

import firebase from '../db/firebase.js'

class GroupView extends Component {
  constructor(props){
    super(props)

    this.state = {
      editing: false,
      loggedIn: false,
    }
  }
  startEdit = () => {
    this.setState({editing:true})
  }
  cancelEdit = () => {
    this.setState({editing:false})
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({loggedIn:true, displayName: user.displayName || user.email})
      } else {
        this.setState({loggedIn:false})
      }
    })
  }

  save = () => {
    let desc = this.descriptionInput.value
    firebase.database().ref('groups/' + this.props.id).update({
      description: desc,
    });
    this.setState({editing:false})
  }

  render () {
    return(
      <div>
        <h2>
          {this.props.group.name}
        </h2>
        <h3>
          Description
          {this.state.editing ?
            <div style={{display:"inline-block"}}>
              <RaisedButton style={{marginLeft:"10px"}} onClick={this.save} label="save" primary={true} icon={<FontIcon className="material-icons">save</FontIcon>}/>
              <FlatButton onClick={this.cancelEdit} label="cancel" icon={<FontIcon className="material-icons">cancel</FontIcon>}/>
            </div>
          :
          ( this.state.loggedIn ?
          <FlatButton
            onClick={this.startEdit}
            label="edit"
            style={{marginLeft:"10px"}}
            primary={true}
            icon={<FontIcon className="material-icons">edit</FontIcon>}/>
          : "" )}
        </h3>
        <div style={{marginLeft:10}}>
          {this.state.editing ?
            <textarea ref={c=>this.descriptionInput=c} defaultValue={this.props.group.description} rows="30" cols="80" />
            :
            <ReactMarkdown source={this.props.group.description||""} />
          }
        </div>
        <h3>Tasks</h3>
        <TaskTable group={this.props.id}/>
      </div>
    )

  }
}

export default GroupView;
