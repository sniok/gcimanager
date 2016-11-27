import React, { Component } from 'react'
import { Link } from 'react-router'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    CircularProgress,
    RaisedButton,
    FlatButton,
    Dialog,
    TextField,
    FontIcon,
} from 'material-ui'

import firebase from '../db/firebase.js'

class GroupsTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            groups: undefined,
            loading: true,
            loggedIn: false,
        }
    }

    componentWillMount() {
        firebase.database().ref('/groups').on('value', snap => {
            this.setState({
                groups: snap.val(),
                loading: false,
            })
        })
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            this.setState({loggedIn:true})
          } else {
            this.setState({loggedIn:false})
          }
        })
    }

    renderGroups = () => {
        let r = []
        for( let id in this.state.groups){
            if ({}.hasOwnProperty.call(this.state.groups, id)) {
                let group = this.state.groups[id]
                r.push(<TableRow key={id}>
                  <TableRowColumn>{group.name}</TableRowColumn>
                  <TableRowColumn>{group.comments ? group.comments.length : "0"}</TableRowColumn>
                  <TableRowColumn>{group.tasks ? group.tasks.length : "0"}</TableRowColumn>
                  <TableRowColumn style={{width: 100 }}>
                      <Link to={`/group/${id}`}>
                        <FlatButton icon={<FontIcon className="material-icons">fullscreen</FontIcon>} label="view"/>
                      </Link>
                      { this.props.deleteAction ? <FlatButton onClick={() => {this.props.deleteAction(this.props.task._id)}} label="Delete"/> : ""}
                  </TableRowColumn>
                </TableRow>)
            }
        }
        return r
    }

    render () {
        return(
            <div>
            { this.state.loggedIn ? <RaisedButton primary={true} label="Create" onClick={()=>{this._createDialog.open()}}/> : "" }
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
                        <TableHeaderColumn>Comments</TableHeaderColumn>
                        <TableHeaderColumn>Tasks</TableHeaderColumn>
                        <TableHeaderColumn
                        style={{width: 100}}
                        >Actions</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody
                    displayRowCheckbox={false}
                >
                    { this.state.groups ?
                        this.renderGroups() : ""
                    }
                </TableBody>
            </Table>
            { this.state.loading ?
                <div style={{width:50,margin:"20px auto"}}>
                    <CircularProgress
                        size={50}
                        thickness={4}
                    />
                </div>
                :
                ""
            }
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
            <FlatButton
                label="Cancel"
                onClick={this.handleClose}
            />,
            <RaisedButton
                primary={true}
                label="Create"
                onClick={this.handleSave}
            />,
        ]
    }
    handleSave = () => {
        var newGroupKey = firebase.database().ref().child('groups').push().key;
        firebase.database().ref('groups/' + newGroupKey).update({
          name: this._groupName.input.value,
          tasks: [],
          comments: [],
          description: "",
        })
        this.handleClose()
    }
    handleClose = () => {
        this.setState({open: false})
    }
    open = () => {
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
                <TextField floatingLabelText="Group name" id="name" ref={c => this._groupName = c} />
            </Dialog>
        )
    }
}

export default GroupsTable
