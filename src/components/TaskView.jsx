import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import File from './File.jsx'
import Tags from './Tags.jsx'
import { grey600 } from 'material-ui/styles/colors'
import {
  FlatButton,
  RaisedButton,
  Paper,
  TextField,
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
      displayName: null,
    }
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

  sendComment = () => {
    let text = this.comment.input.value
    let comments = this.props.task.comments || []
    comments.push({
      owner: this.state.displayName,
      text: text,
    })
    firebase.database().ref('tasks/' + this.props.task.id).update({
      comments: comments,
    })
    this.comment.input.value = ""
  }

  deleteComment = (id) => {
    let comments = this.props.task.comments
    comments.splice(id,1)
    firebase.database().ref('tasks/' + this.props.task.id).update({
      comments: comments,
    })
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
        {this.props.task.comments ? this.props.task.comments.map( (comment, i) =>
          <Comment handleDelete={this.deleteComment} displayName={this.state.displayName} key={i} id={i} comment={comment} />)
          :
          <div>Be first to comment</div>
        }
        {this.state.loggedIn ?
          <div>
            <TextField fullWidth={true} ref={c=>this.comment=c} hintText="Text" style={{marginTop: "-10px"}} floatingLabelText="Add comment" /><br/>
            <RaisedButton primary={true} label="send" onClick={this.sendComment}/>
          </div>
        :
          <div style={{paddingTop: 10}}>
            Log in to comment
          </div>
        }
      </div>
    )
  }
}

class Comment extends Component {
  render() {
    return (
      <Paper style={{padding: "15px 15px"}} zDepth={1}>
        <b>{this.props.comment.owner}</b>
        <div>{this.props.comment.text}</div>
        {this.props.displayName === this.props.comment.owner ?
          <FlatButton onClick={()=>{this.props.handleDelete(this.props.id)}} style={{right: "0"}} label="Delete" />
          :""
        }

      </Paper>
    )
  }
}

export default TaskView;
