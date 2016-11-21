import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'

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

import Tags from './Tags.jsx'

class TaskEditDialog extends Component {
    constructor(props){
        super(props)
        this.actions = [
            <FlatButton
                label="Save"
                onClick={this.handleClose}
            />
        ]

        this.state = {
            open: false,
            tags: this.props.task.tags || [],
            groupValue: "",
            snackbarOpen: false,
        }
    }
    openDialog = () => {
        this.setState({open: true})
    }

    save = () => {
        Meteor.call('tasks.setTags', this.props.task._id, this.state.tags)
    }

    handleClose = () =>{
        this.setState({open: false})
        this.save()
        this.props.handleClose()
    }
    getTags = () => {
        return this.state.tags.map( tag => {
            return <Chip style={{margin:4}} key={tag}>{tag}</Chip>
        })
    }
    addTag = () => {
        if(this.state.tags.indexOf(this._name.input.value) > -1){
            return
        }
        this.setState({
                tags: this.state.tags.concat([this._name.input.value]),
                snackbarOpen: false,
        }, () => { this._name.input.value = "" })
    }
    deleteTag = (tag) => {
        let newTags = this.state.tags
        newTags.splice(this.state.tags.indexOf(tag),1)
        this.setState({
            tags: newTags,
            snackbarOpen: false,
        }, this.save)
    }

    handleGroupInputChange = (event, index, value) => {
        this.setState({groupValue:value, snackbarOpen: false});
    }

    addToGroup = () => {
        if(this.state.groupValue){
            Meteor.call('groups.addTask',this.state.groupValue,this.props.task._id)
            this.setState({snackbarOpen:true})
        }
    }

    getGroupsList= () => {
        return this.props.groups.map( group => {
            return (
                <MenuItem key={group._id} value={group._id} primaryText={group.name} />
            )
        })
    }

    render() {
        return (
            <Dialog
                title={this.props.task.name}
                actions={this.actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
            >
                <Tags handleRequestDelete={(tag) => { this.deleteTag(tag)}} tags={this.state.tags} />
                <h4>Edit tags</h4>
                <TextField id="tname" ref={c => this._name = c} placeholder="Tag name"/>
                <FlatButton label="Add" onClick={this.addTag}/>
                <h4>Add to group</h4>
                <SelectField
                    value={this.state.groupValue}
                    onChange={this.handleGroupInputChange}
                    maxHeight={200}
                >
                    {this.getGroupsList()}
                </SelectField>
                <FlatButton id="add" label="Add" onClick={this.addToGroup}/>
                <Snackbar
                    open={this.state.snackbarOpen}
                    message="Task added to group"
                    autoHideDuration={2000}
                />
            </Dialog>
        )
    }
}


export default TaskEditDialog