import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import File from './File.jsx'
import Tags from './Tags.jsx'
import { grey600 } from 'material-ui/styles/colors'
import {
  FlatButton,
  RaisedButton,
} from 'material-ui'
import FontIcon from 'material-ui/FontIcon';
import ChipInput from 'material-ui-chip-input'
import firebase from '../db/firebase.js'

const styles = {
  h2: {
    marginBottom: 5,
  },
  small: {
    color: grey600,
    fontWeight: "bold",
    marginBottom: "10px",
    display: "block",
  },
  h3: {
    marginTop: "20px",
    fontWeight: "500",
    paddingBottom: "5px",
    borderBottom: "1px solid rgba(0,0,0,0.08)"
  },
  editButton: {
    marginLeft: "10px",
  },
}

class TaskView extends Component {

  constructor(props){
    super(props)

    this.state = {
      editing: false,
      loggedIn: false,
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({loggedIn:true})
      } else {
        this.setState({loggedIn:false})
      }
    })
  }

  prettyName = (name) => {
    let parts = name.split('-')
    parts.splice(0,2)
    return parts.join('-').replace(/_/g," ").slice(0,-10)
  }

  startEdit = () => {
    this.setState({editing:true})
  }
  cancelEdit = () => {
    this.setState({editing:false})
  }
  save = () => {
    let desc = this.descriptionInput.value
    console.log(desc)
    firebase.database().ref('tasks/' + this.props.task.id).update({
      description: desc,
      tags: this.tags.state.chips,
    });
    this.setState({editing:false})
  }

  render () {
    return(
      <div>
        <h2 style={styles.h2}>
          {this.prettyName(this.props.task.name)}
          {this.state.editing ?
            <div style={{display:"inline-block"}}>
              <RaisedButton onClick={this.save} style={styles.editButton} label="save" primary={true} icon={<FontIcon className="material-icons">save</FontIcon>}/>
              <FlatButton onClick={this.cancelEdit} style={styles.editButton} label="cancel" icon={<FontIcon className="material-icons">cancel</FontIcon>}/>
            </div>
          :
          ( this.state.loggedIn ? <FlatButton onClick={this.startEdit} style={styles.editButton} label="edit" primary={true} icon={<FontIcon className="material-icons">edit</FontIcon>}/>: "")}
        </h2>
        <small style={styles.small} >{this.props.task.year}</small>
        {
          this.state.editing ?
            <ChipInput
              floatingLabelText="Tags"
              ref={c=>this.tags=c}
              defaultValue={this.props.task.tags}
              style={{width:400}}
            />
            :
            <Tags tags={this.props.task.tags}/>
          }

        <h3 style={styles.h3}>
          Description
        </h3>
        <div style={{marginLeft:10}}>
          {this.state.editing ?
            <textarea ref={c=>this.descriptionInput=c} defaultValue={this.props.task.description} rows="30" cols="80" />
            :
            <ReactMarkdown source={this.props.task.description||""} />
          }
        </div>

        <h3 style={styles.h3}>Files</h3>
        <div style={{marginLeft:10}}>
          {this.props.task.children.map( file => <File key={file.name} file={file} /> )}
        </div>
        <h3 style={styles.h3}>Comments</h3>
        <p>Comments bla bla bla </p>

      </div>
    )
  }
}

export default TaskView;
