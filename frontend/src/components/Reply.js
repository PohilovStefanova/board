import React, {Component} from 'react';

class Reply extends Component {
    state = {}
    formatDate = (date) => {
        return date
    }
    render() {
        return (
            <React.Fragment >
                <div id={this.props._id} className="reply">
                    <div className="reply-header">
                        <span className="reply-order">Anonymous</span>
                        <div className="reply-header-id">№{this.props.reply._id}</div>
                    </div>
                    <div className="reply-body">{this.props.reply.text}</div>
                    <div className="reply-footer">{this.formatDate(this.props.reply.created_on)}</div>
                </div>
                <br/>
            </React.Fragment>
        );
    }
}

export default Reply;