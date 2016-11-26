import React, { Component } from 'react'

import { Link } from 'react-router'

import Tags from './Tags.jsx'

import {
    Chip,
    FlatButton,
    TableRow,
    TableRowColumn,
} from 'material-ui'
import FontIcon from 'material-ui/FontIcon';

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      currentUser: true
    }
  }
  // Return formatted name
  getName = () => {
    let parts = this.props.task.name.split('-')
    parts.splice(0,2)
    return parts.join('-').replace(/_/g," ").slice(0,-10)
  }
  // Toggles files
  toggleShowFiles = () => {
    this.setState( prevState => {
      return {
        expanded: !prevState.expanded
      }
    })
  }
  // Renders tags
  getTags = () =>{
    if(this.props.task.tags)
      return this.props.task.tags.map( tag =>
        <Chip key={tag}>{tag}</Chip>
    )
  }
  // Handler for arrow button
  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded})
  }
  // Open task editor
  openDialog = () =>{
      this._dialog.openDialog()
  }
  openViewModal = () => {
      this._viewModal.openDialog()
  }
  // Force render
  update =  () => {
      this.forceUpdate()
  }

  render() {
      return (
          <TableRow>
            <TableRowColumn>{this.getName()}</TableRowColumn>
            <TableRowColumn><Tags tags={this.props.task.tags}/></TableRowColumn>
            <TableRowColumn style={{width: 100 }}>
                <Link to={`/task/${this.props.task.id}`}>
                  <FlatButton icon={<FontIcon className="material-icons">fullscreen</FontIcon>} label="view"/>
                </Link>
                { this.props.deleteAction ? <FlatButton onClick={() => {this.props.deleteAction(this.props.task._id)}} label="Delete"/> : ""}
            </TableRowColumn>
          </TableRow>
      )
  }
}
/*
<TaskEditDialog groups={this.props.groups} task={this.props.task} handleClose={this.update} ref={c => this._dialog = c} />
*/

export default Task
