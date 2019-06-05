import React, {Component} from 'react';

import {Card, CardHeader, CardBody, CardTitle, Button} from 'reactstrap';

import Reply from './Reply.js';

class ThreadThumbnail extends Component {
    state = {}

    render() {
        return (
            <Card>
                <CardHeader className="thumbnail-header">
                    <i>№ {this.props.thread._id}</i>
                    <Button
                        onClick={() => window.location.href = '/' + this.props.thread._id}>Open thread</Button>
                </CardHeader>
                <CardBody>
                    <CardTitle>{this.props.thread.text}</CardTitle>
                    {this
                        .props
                        .thread
                        .replies
                        .map((reply, index) => (<Reply key={index} reply={reply}/>))}
                </CardBody>
            </Card>
        );
    }
}

export default ThreadThumbnail;