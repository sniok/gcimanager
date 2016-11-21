import React, { Component, PropTypes } from 'react'
import Task from './Task.jsx'
import { TextField, CircularProgress, RaisedButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'

import { createContainer } from 'meteor/react-meteor-data'
import { Tasks } from '../api/tasks.js'
import { Groups } from '../api/groups.js'
import { Meteor } from 'meteor/meteor'

// Task container
// Contains Tasks and search form

class TaskContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayTasks: 5,
      year: "",
      name: "",
      tags: [],
    }
  }
  // Return rendered filtered tasks
  getTasks = () => {
    let tasks = this.props.tasks
    // if searching by name
    if(this.state.name){
      tasks = tasks.filter( task => {
        return task.name.toLowerCase().indexOf(this.state.name.toLowerCase()) > -1
      })
    }

    // if searching by year
    if(this.state.year > 2011 && this.state.year < 2015){
      tasks = tasks.filter( task => {
        return task.year === this.state.year
      })
    }

    // if searching by tags
    if(this.state.tags[0] !== "" && this.state.tags.length > 0){
      tasks = tasks.filter( task => {
        isRight = true
        this.state.tags.forEach( tag => {
          if(task.tags.indexOf(tag) === -1){
            isRight = false
          }
        })
        return isRight
      })
    }
    return tasks.slice(0, this.state.displayTasks).map( (task, i) => {
      return(
        <Task
          key={task._id}
          task={task}
          groups={this.props.groups}
        />
      )
    })
  }
  // Display more tasks
  more = () => {
    this.setState(prevState => {
      return {
        displayTasks: prevState.displayTasks+10
      }
    }, () => {
      this._display.input.value = this.state.displayTasks
    })

  }
  // On form sumbit
  find = () => {
      let tags = this._tags.input.value.split(",")
      tags = tags.map( tag => {
          return tag.trim()
      })
      this.setState({
          displayTasks: parseInt(this._display.input.value),
          name: this._name.input.value,
          year: this._year.input.value,
          tags: tags,
      })

  }

  render() {
    return (
      <div className="TaskContainer">
        <h2>Tasks</h2>
        Task name<br/>
        <TextField
          hintText="Search by name"
          fullWidth={true}
          ref={c => this._name = c}
        />
        <div style={styles.inlineInput}>
          Limit<br/>
          <TextField
            id="limit"
            defaultValue={this.state.displayTasks}
            ref={c=>this._display = c}
            onChange={this.updateDisplayTasks}
          />
        </div>
        <div style={styles.inlineInput}>
          Year<br/>
          <TextField
            defaultValue={this.state.year}
            onChange={this.updateYear}
            hintText="Year"
            ref={c => this._year = c}
          />
        </div>
        <div style={styles.inlineInput}>
          Tags (comma separated)<br/>
          <TextField
            id="tags"
            placeholder="Search by tag"
            ref={c => this._tags = c}
          /><br/>
        </div><br/>
        <RaisedButton
            primary={true}
            label="Search"
            onClick={this.find}
        />
        <hr/>
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
              style={{width: 200}}
            >Actions</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
        {this.getTasks()}
        </TableBody>
      </Table>
        <RaisedButton label="more" fullWidth={true} onClick={this.more}/>
      </div>
    )
  }
}

const styles = {
  inlineInput : {
    display: "inline-block",
    marginRight: "10",
    marginTop: "5"
  }
}

// Subscribtion for react
TaskContainer.propTypes = {
  tasks: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks')
  Meteor.subscribe('groups')
  return {
    tasks: Tasks.find({}).fetch(),
    groups: Groups.find({}).fetch(),
    currentUser: Meteor.user(),
  };
}, TaskContainer);
