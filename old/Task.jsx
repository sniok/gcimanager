import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'

import File from './File.jsx'
import Tags from './Tags.jsx'
import TaskEditDialog from './TaskEditDialog.jsx'

import {
    Chip,
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardText,
    FlatButton,
    Dialog,
    TextField,
    TableRow,
    TableRowColumn,
    SelectField,
    MenuItem,
    Snackbar,
} from 'material-ui'
import FontIcon from 'material-ui/FontIcon';

class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      currentUser: Meteor.user(),
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
            <TableRowColumn style={{width: this.props.deleteAction ? 250 : 200 }}>
                <FlatButton onClick={this.openViewModal} icon={<FontIcon className="material-icons">fullscreen</FontIcon>} label="view"/>
                { this.state.currentUser ? <FlatButton onClick={this.openDialog} icon={<FontIcon className="material-icons">edit</FontIcon>} label="Edit"/> : "" }
                { this.props.deleteAction ? <FlatButton onClick={() => {this.props.deleteAction(this.props.task._id)}} label="Delete"/> : ""}
            </TableRowColumn>
            <TaskEditDialog groups={this.props.groups} task={this.props.task} handleClose={this.update} ref={c => this._dialog = c} />
            <TaskModal task={this.props.task} ref={c => this._viewModal = c}/>
          </TableRow>
      )
  }
}

class TaskModal extends Component {
    constructor(props){
        super(props)

        this.actions = [
            <FlatButton
                label="Close"
                onClick={this.handleClose}
            />
        ]

        this.state = {
            open: false
        }
    }
    // Renders file list
    getFiles = () => {
        return this.props.task.children.map( file => {
            return (<File key={file.name} file={file}/>)
        })
    }
    handleClose = () =>{
        this.setState({open: false})
    }
    openDialog = () => {
        this.setState({open: true})
    }
    // Get image preview if available
    getPreview = () => {
        let file = this.props.task.children.find( file => {
            let format = file.name.slice(-3)
            if(format === "jpg" || format === "png" || format === "gif"){
                return true
            }
            return false
        })
        if(file){
            return (<div><h3>Preview</h3><img alt="" style={{maxHeight:150}}className="taskPreview" src={"http://brlcad.org/gci/data/"+file.path}/></div>)
        }
    }
    render() {
        return (
            <Dialog
                title={this.props.task.name}
                actions={this.actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
                autoDetectWindowHeight={false}
                style={{paddingTop: 0}}
                repositionOnUpdate={false}
            >
                {this.getPreview()}
                <h3>Files</h3>
                {this.getFiles()}
                <h3>Tags</h3>
                <Tags tags={this.props.task.tags} />
            </Dialog>
        )
    }

}

export default Task
