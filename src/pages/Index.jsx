import React, { Component } from 'react'

import Banner from '../components/Banner.jsx'
import Content from '../components/Content.jsx'
import TaskTable from '../components/TaskTable.jsx'

import { 
    TextField,
    RaisedButton,
} from 'material-ui'

const styles = {
    field: {
        marginRight: "10px",
    }
}

class Index extends Component { 

    search = () => {
        this._table.limit = this._limit.input.value
        this._table.year = this._year.input.value
        this._table.name = this._name.input.value
        this._table.tags = this._tags.input.value.split(',').map(t=>t.trim())
    }

    render() {
        return (
            <div>
                <Banner title="Search" />
                <Content>
                    <TextField id="name" ref={c=>this._name=c} placeholder="Search by name" fullWidth={true}/>
                    <TextField id="year" style={styles.field} ref={c=>this._year=c} placeholder="Year" />
                    <TextField id="limit" style={styles.field} defaultValue="10" ref={c=>this._limit=c} placeholder="Limit" />
                    <TextField id="tags" style={styles.field} ref={c=>this._tags=c} placeholder="Tags" /><br/>
                    <RaisedButton onClick={this.search} label="search" primary={true} />
                    <TaskTable ref={c=>this._table=c}/>
                </Content>
            </div>
        )
    }
}

export default Index