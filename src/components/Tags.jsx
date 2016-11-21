import React, { Component } from 'react'
import { Chip } from 'material-ui'
import {blue100, lightGreen100, grey200} from 'material-ui/styles/colors';

class Tags extends Component {
    renderTags = () => {
        if(this.props.tags) {
            return this.props.tags.map( tag => {
                let color = grey200
                if(tag === "reviewed") color = lightGreen100
                if(tag === "new") color = blue100
                return <Chip
                    style={{margin:4}}
                    key={tag}
                    backgroundColor={color}
                    onRequestDelete={this.props.handleRequestDelete ? () => this.props.handleRequestDelete(tag) : undefined}
                >{tag}</Chip>
            })
        }
    }
    render() {
        return (
            <div style={{display:'Flex',flexWrap:'wrap'}}>
                {this.renderTags()}
            </div>
        )
    }

}

export default Tags