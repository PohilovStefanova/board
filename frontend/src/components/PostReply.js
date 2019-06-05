import React, {Component} from 'react';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Alert,
    Spinner
} from 'reactstrap'

import axios from 'axios';

class PostReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formOpened: false,
            alert: "",
            text: "",
            delete_password: "",
            spinner: false
        };
    }
    handleClick = () => {
        this.setState({
            formOpened: !this.state.formOpened,
            alert: ""
        });
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        const {text, delete_password} = this.state;
        const thread_id = this.props.thread_id
        console.log(thread_id)
        axios
            .post('/api/replies', {
                text, delete_password, thread_id
            })
            .then(res => {
                this.setState({spinner: true})
                console.log(res.data)
                setTimeout(() => window.location.href='/'+this.props.thread_id, 1000)
            })
            .catch(err => {
                this.setState({alert: 'Unexpected error! See console for more info'})
                console.log(err);
            })
        e.preventDefault();
    }
    render() {
        const alert = (
            <Alert color="warning">{this.state.alert}</Alert>
        )
        const form = (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label>Reply text</Label>
                    <Input
                        type="textarea"
                        value={this.state.text}
                        onChange={this.handleChange}
                        name="text"
                        placeholder="Enter text..."
                        required/></FormGroup>
                <FormGroup>
                    <Label>Delete password</Label>
                    <Input
                        type="password"
                        value={this.state.delete_password}
                        onChange={this.handleChange}
                        name="delete_password"
                        placeholder="Enter delete password"
                        required/>
                </FormGroup>
                <FormGroup>
                    <Button color="primary" type="submit">Submit</Button>
                    
                </FormGroup>
                {this.state.spinner?<Spinner type="grow" />:""}
                {this.state.alert !== ""
                    ? alert
                    : ""}
                <hr/>
            </Form>
        )
        return (
            <div className="post-form">
                {this.state.formOpened
                    ? form
                    : ""}
                <Button onClick={this.handleClick}>{this.state.formOpened
                        ? 'Close the post form'
                        : 'Reply to the thread'}</Button>
            </div>
        );
    }
}

export default PostReply;