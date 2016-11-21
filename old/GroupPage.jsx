import React, { Component, PropTypes } from 'react'

import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { Groups } from '../api/groups.js'
import { Tasks } from '../api/tasks.js'

import ReactMarkdown from 'react-markdown'

import {
    Table,
    TableBody,
    TableRow,
    TableHeaderColumn,
    TableHeader,
    FlatButton,
    FontIcon,
    TextField,
    RaisedButton,
    Paper,
    Divider,
} from 'material-ui'

import Task from './Task.jsx'

class GroupPage extends Component {

    constructor(props){
        super(props)
        this.state = {
          isEditing: false,
          group: {},
        }
    }

    deleteTask = (taskId) => {
      if(confirm("Are you sure you want to remove this task from group?"))
        Meteor.call('groups.deleteTask',this.state.group._id, taskId)
    }

    getTasks = () => {
        let group = this.state.group
        let rtask = []
        tasks = this.props.tasks
        if(group.tasks && tasks){
            group.tasks.forEach( taskId => {
                let task = tasks.find( mtask => taskId._str == mtask._id._str)
                if(task)
                rtask.push(
                    <Task
                    key={taskId}
                    task={task}
                    groups={this.props.groups}
                    deleteAction={this.props.currentUser ? this.deleteTask : undefined}
                    />
                )
            })
            return rtask
        }
    }

    componentWillReceiveProps = (newProps) => {
      let group = newProps.groups.find( group => group._id == this.props.params.groupId)
      if(group && group != this.state.group){
          this.setState({group})
      }
    }

    saveDescription = () => {
      Meteor.call('groups.updateDesc',this.state.group._id, this._desc.value, () =>{
        this.setState({isEditing: false})
      })
    }

    sendComment = () => {
      Meteor.call('groups.addComment',
        this.state.group._id,
        {
          text:this._comment.input.value,
          owner: this.props.currentUser.username,
        })
      this._comment.input.value = ""
    }

    getComments = () => {
      if(this.state.group.comments){
        return this.state.group.comments.map( comment => {
          return <Comment key={Math.random()*10000} comment={comment} />
        })
      }
    }

    render() {
        return(
            <div>
              <h1>{this.state.group.name}</h1>
              { this.state.isEditing ?
                <div>
                  <small>supports markdown</small><br/>
                  <textarea
                    style={{fontSize:16}}
                    ref={c=>this._desc=c}
                    placeholder="Description"
                    rows="8" cols="70"
                    defaultValue={this.state.group.description}/><br/>
                  <FlatButton onClick={this.saveDescription} label="save"/>
                </div>
                :
                <div>
                  <ReactMarkdown source={this.state.group.description} />
                  { this.props.currentUser ?
                  <FlatButton
                    onClick={()=>{this.setState({isEditing: true})}}
                    icon={<FontIcon className="material-icons">edit</FontIcon>}
                    label="edit description"/> : ""
                  }
                </div>
              }
              <h3>Tasks</h3>
              <Table
              selectable={false}
              >
              <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
              >
              <TableRow>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Tags</TableHeaderColumn>
                  <TableHeaderColumn
                  style={{width: this.props.currentUser ? 250 : 200}}
                  >Actions</TableHeaderColumn>
              </TableRow>
              </TableHeader>
              <TableBody
              displayRowCheckbox={false}
              >
              {this.getTasks()}
              </TableBody>
              </Table>

              <h3>Comments</h3>
              <Paper zDepth={1}>
                {this.getComments()}
              </Paper>
              { this.props.currentUser ?
                <div>
              <p>Leave a comment</p>
              <TextField
                id="comment"
                ref={c=>this._comment=c}
                placeholder="comment" />
              <RaisedButton
                onClick={this.sendComment}
                primary={true}
                label="comment" />
              </div>
              :""}
            </div>
        )
    }
}


class Comment extends Component {
  render() {
    return (
      <div>
        <div style={{padding: 20}}>
          <b>{this.props.comment.owner}</b><br/>
          {this.props.comment.text}
        </div>
        <Divider />
      </div>
    )
  }
}


GroupPage.propTypes = {
  groups: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('groups');
  Meteor.subscribe('tasks');
  return {
    groups: Groups.find({}).fetch(),
    tasks: Tasks.find({}).fetch(),
    currentUser: Meteor.user(),
  };
}, GroupPage);
