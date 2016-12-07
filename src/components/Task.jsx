import React, { Component } from 'react'

import { Link } from 'react-router'

import Tags from './Tags.jsx'
import firebase from '../db/firebase.js'

import {
    Chip,
    TableRow,
    TableRowColumn,
    SelectField,
    MenuItem,
} from 'material-ui'

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      loggedIn: false,
      value: this.props.task.group || null,
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
  // Return formatted name
  getName = () => {
    let parts = this.props.task.name.split('-')
    parts.splice(0,2)
    return parts.join('-').replace(/_/g," ").slice(0,-10)
  }
  // Renders tags
  getTags = () =>{
    if(this.props.task.tags)
      return this.props.task.tags.map( tag =>
        <Chip key={tag}>{tag}</Chip>
    )
  }
  renderGroupsList = () => {
    const groups = this.props.groups
    let r = []
    for(let id in groups){
      if ({}.hasOwnProperty.call(groups, id)) {
        r.push(<MenuItem key={id} value={id} primaryText={groups[id].name} />)
      }
    }
    return r
  }
  addToGroup = (event, index, value) => {
    // Check if selected the same
    if(value === this.state.value) return

    // Remove element from previous group
    if(this.state.value !== null){
      let tasks = this.props.groups[this.state.value].tasks || []
      tasks = tasks.filter( taskId => taskId !== this.props.task.id)
      firebase.database().ref('groups/' + this.state.value).update({
        tasks: tasks,
      })
    }

    // Add groupId to Task
    firebase.database().ref('tasks/' + this.props.task.id).update({
      group: value,
    })

    // Add taskId to Group
    if(value !== null){
      let tasks = this.props.groups[value].tasks || []
      tasks.push(this.props.task.id)
      firebase.database().ref('groups/' + value).update({
        tasks: tasks,
      })
    }

    if(value || value === null) this.setState({value})
  }

  render() {
      return (
          <TableRow>
            <TableRowColumn><Link to={`/task/${this.props.task.id}`}>{this.getName()}</Link></TableRowColumn>
            <TableRowColumn><Tags tags={this.props.task.tags}/></TableRowColumn>
            <TableRowColumn style={{width: 150 }}>
              <SelectField
                hintText="select"
                style={{width: 150}}
                value={this.state.value}
                onChange={this.addToGroup}
                disabled={!this.state.loggedIn}
              >
                <MenuItem value={null} primaryText="" />
                {this.renderGroupsList()}
              </SelectField>
            </TableRowColumn>
          </TableRow>
      )
  }
}

export default Task
