import React, { Component } from 'react'

import Banner from '../components/Banner.jsx'
import Content from '../components/Content.jsx'
import TaskTable from '../components/TaskTable.jsx'

import ChipInput from 'material-ui-chip-input'
import FontIcon from 'material-ui/FontIcon';

import {
    TextField,
    RaisedButton,
    FlatButton,
} from 'material-ui'

const styles = {
    field: {
        marginRight: "10px",
    }
}

class Index extends Component {

    constructor(props){
      super(props)

      this.state = {
        filter: false,
      }
    }

    search = () => {
        this._table.name = this._name.input.value
        this._table.limit = this._limit.input.value
        this._table.year = this._year.input.value
        this._table.tags = this._tags.state.chips
    }

    more = () => {
      this._limit.input.value = parseInt(this._limit.input.value) + 5
      this.search()
    }

    toggleFilter = () =>{
      this.setState({filter:!this.state.filter})
    }

    render() {
        return (
            <div>
                <Banner title="Search" />
                <Content>
                    <TextField id="name" ref={c=>this._name=c} floatingLabelText="Search by name" fullWidth={true}/>
                      <div style={{display:this.state.filter?"block":"none"}}>
                        <TextField id="year" style={styles.field} ref={c=>this._year=c} floatingLabelText="Year" />
                        <TextField id="limit" style={styles.field} defaultValue="10" ref={c=>this._limit=c} floatingLabelText="Limit" /><br/>
                        <ChipInput
                          floatingLabelText="Tags"
                          ref={c=>this._tags=c}
                        /><br/>
                      </div>

                    <RaisedButton
                      onClick={this.search}
                      label="search"
                      icon={<FontIcon className="material-icons">search</FontIcon>}
                      primary={true}
                    />
                    <FlatButton
                      style={{marginLeft:10}}
                      onClick={this.toggleFilter}
                      icon={<FontIcon className="material-icons">filter_list</FontIcon>}
                      label="filter"
                    />
                    <TaskTable ref={c=>this._table=c}/>
                    <RaisedButton
                      onClick={this.more}
                      fullWidth={true}
                      label="more"
                    />
                </Content>
            </div>
        )
    }
}

export default Index
