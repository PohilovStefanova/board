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

class PostThread extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formOpened: false,
            text: "",
            delete_password: "",
            alert: "",
            spinner: false
        };
    }
    handleClick = () => {
        this.setState({
            formOpened: !this.state.formOpened,
            alert: ""
        });
    }
    handleSubmit = (e) => {
        const {text, delete_password} = this.state;
        e.preventDefault();
        this.setState({spinner: true});
        setTimeout(() => {
            axios
                .post('/api/threads', {text, delete_password})
                .then(res => {
                    this.setState({formOpened: false, text: "", delete_password: "", alert: "", spinner: false})
                    setTimeout(() => window.location.href = '/', 10)
                })
                .catch(err => {
                    this.setState({alert: 'Unexpected error! See console for more info. '})
                    console.log(err)
                })
        }, 600)

    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render() {
        const alert = (
            <Alert color="warning">{this.state.alert}</Alert>
        )
        const form = (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label>Thread text</Label>
                    <Input
                        type="textarea"
                        value={this.state.text}
                        onChange={this.handleChange}
                        name="text"
                        placeholder="Enter text..."
                        required/>
                </FormGroup>
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
                    {this.state.spinner
                        ? <React.Fragment><br/><br/><Spinner type="grow" color="primary"/></React.Fragment>
                        : ""}
                </FormGroup>
                {this.state.alert !== ""
                    ? alert
                    : ""}
                <hr/>
            </Form>
        );
        return (
            <div className="thread-form">
                {this.state.formOpened
                    ? form
                    : ""}
                <Button onClick={this.handleClick}>{this.state.formOpened
                        ? 'Close the post form'
                        : 'Create a new thread'}</Button>
            </div>
        );
    }
}

export default PostThread;