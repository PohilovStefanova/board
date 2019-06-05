import React, {Component} from 'react';
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Spinner
} from 'reactstrap'

import PostReply from './PostReply';
import Reply from './Reply';
import axios from 'axios';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            alert: ''
        };
    }
    componentDidMount() {
        axios
            .get('/api/replies/' + this.props.match.params.thread)
            .then(res => {
                if (typeof res.data !== 'string') {
                    this.setState({data: res.data})
                } else 
                    this.setState({alert: res.data})
            })
            .catch(err => {
                console.log(err)
            })
    }
    render() {
        let threadcard = <h1 className="BoardPage"><Spinner type="grow" color="primary"/></h1>;
        if (Object.entries(this.state.data).length !== 0 && this.state.data.constructor === Object) {
            threadcard = (
                <div className="ThreadPage">
                    <a href={`/`}>
                        <h1>Go to the main page</h1>
                    </a>
                    <hr/>
                    <PostReply thread_id={this.state.data._id}/>
                    <hr/>
                    <Card>
                        <CardHeader className="thumbnail-header">
                            <i>№ {this.state.data._id}</i>
                        </CardHeader>
                        <CardBody>
                            <CardTitle>{this.state.data.text}</CardTitle>
                            {this
                                .state
                                .data
                                .replies
                                .map((reply, index, array) => {
                                    return (<Reply key={index} number={index+1} reply={reply}/>)
                                })}
                        </CardBody>
                    </Card>
                    <br/>
                    <div
                        ref={(el) => {
                        this.scrollref = el
                    }}></div>
                    {this.state.data.replies.length > 3
                        ? <PostReply
                                thread_id={this.state.data._id}/>
                        : ""}
                </div>
            );
        } else if (this.state.alert) {
            threadcard = (
                <div><br/>
                    <Alert color='danger'>{this.state.alert}</Alert>
                </div>
            );
        }
        else {
            threadcard = <Alert color='warning'>Error</Alert>
        }
        return (
            <React.Fragment>{threadcard}</React.Fragment>
        );
    }
}

export default Board;