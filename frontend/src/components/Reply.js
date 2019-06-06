import React, {Component} from 'react';
import DeleteReplyForm from './DeleteReplyForm';

class Reply extends Component {
    state = {}
    formatDate = (date) => {
        return date
    }
    render() {
        let number;
        if (this.props.number) number=<span className="reply-order">№{this.props.number}</span>
        return (
            <React.Fragment >
                <div className="reply">
                    <div className="reply-header">
                        <span className="reply-order">Anonymous</span>
                        <div className="reply-header-id">№ {this.props.reply._id}</div>
                        {number?<DeleteReplyForm 
                        thread_id={this.props.thread_id}
                        reply_id={this.props.reply._id}/>:""}
                    </div>
                    
                    <div className="reply-body">{this.props.reply.text}</div>
                    <div className="reply-footer">
                        {number?number:''}
                        {this.formatDate(this.props.reply.created_on)}
                    </div>
                </div>
                <br/>
            </React.Fragment>
        );
    }
}

export default Reply;