import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import { Groups } from '../api/groups.js'

import {
    Table,
    TableHeader,
    TableBody,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    FlatButton,
    RaisedButton,
    FontIcon,
    Dialog,
    TextField,
} from 'material-ui'

import { Link } from 'react-router'

class GroupsContainer extends Component {
    renderBody = () => {
        return this.props.groups.map( group => {
                return (
                    <TableRow key={group._id}>
                        <TableRowColumn>{group.name}</TableRowColumn>
                        <TableRowColumn>{group.tasks.length}</TableRowColumn>
                        <TableRowColumn>{group.comments.length}</TableRowColumn>
                        <TableRowColumn><Link to={"/group/"+group._id}><FlatButton icon={<FontIcon className="material-icons">fullscreen</FontIcon>} label="view"/></Link></TableRowColumn>
                    </TableRow>
                    )
            })
    }

    render() {
        return (
            <div>
                <h2>Groups</h2>
                { this.props.currentUser ? <RaisedButton onClick={()=> {this._createDialog.openDialog()}}primary={true} icon={<FontIcon className="material-icons">add</FontIcon>} label="Create new"/> : ""}
                <CreateGroupDialog ref={c => this._createDialog = c}/>
                <Table
                    selectable={false}
                >
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                >
                <TableRow>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Tasks</TableHeaderColumn>
                    <TableHeaderColumn>Comments</TableHeaderColumn>
                    <TableHeaderColumn
                        style={{width: 200}}
                    >Actions</TableHeaderColumn>
                </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}
                >
                    {this.renderBody()}
                </TableBody>
                </Table>
            </div>
        )
    }
}

class CreateGroupDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            open: false
        }
        this.actions = [
            <RaisedButton
                primary={true}
                label="Create"
                onClick={this.handleSave}
            />
        ]
    }
    handleSave = () => {
        Meteor.call('groups.Create',this._groupName.input.value)
        this.handleClose()
    }
    handleClose = () => {
        this.setState({open: false})
    }
    openDialog = () => {
        this.setState({open: true})
    }
    render() {
        return (
            <Dialog
                title="Create new group"
                actions={this.actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
            >
                Input name:<br/>
                <TextField id="name" ref={c => this._groupName = c} placeholder="Name" />

            </Dialog>
        )
    }
}

GroupsContainer.propTypes = {
  groups: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('groups');
  return {
    groups: Groups.find({}).fetch(),
    currentUser: Meteor.user(),
  };
}, GroupsContainer);
