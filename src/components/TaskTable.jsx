import React, { Component } from 'react'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    CircularProgress,
} from 'material-ui'

import Task from './Task.jsx'
import firebase from '../db/firebase.js'

class TaskTable extends Component {
    constructor(props){
        super(props)

        this.tasks = []
        this.state = {
            tasks: [],
            limit: 10,
            name: undefined,
            year: undefined,
            tags: [],
        }
    }

    set name (name) {
        this.setState({name})
    }
    set limit (limit) {
        this.setState({limit})
    }
    set year (year) {
        this.setState({year})
    }
    set tags (tags) {
        this.setState({tags})
    }

    componentWillMount() {
        firebase.database().ref('/tasks').once('value').then(snap => {
            this.setState({
                tasks: snap.val()
            })
        })
    }

    getTasks = () => {
        let t = this.state.tasks

        if(this.state.name){
            t = t.filter( task => {
                return task.name.toLowerCase().indexOf(this.state.name.toLowerCase()) > -1
            })
        }

        // if searching by year
        if(this.state.year > 2011 && this.state.year < 2015){
            t = t.filter( task => {
                return task.year === this.state.year
            })
        }

        // if searching by tags
        if(this.state.tags[0] !== "" && this.state.tags.length > 0){
            t = t.filter( task => {
                if(!task.tags) return false
                let isRight = true
                this.state.tags.forEach( tag => {
                    if(task.tags.indexOf(tag) === -1){
                        isRight = false
                    }
                })
                return isRight
            })
        }
        if(this.state.limit){
            t = t.slice(0,this.state.limit)
        }
        return t.map(task => <Task key={task.id} task={task}/>)
    }

    render() {
        return (
            <div>
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
                    { this.state.tasks.length > 0 ?
                        this.getTasks() :""
                    }
                </TableBody>
            </Table>
            { this.state.tasks.length > 0 ? "":
                <div style={{width:50,margin:"20px auto"}}>
                    <CircularProgress
                        size={50}
                        thickness={4}
                    />
                </div>
            }
            </div>
        )
    }
}

export default TaskTable
