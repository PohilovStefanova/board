import React, {Component} from 'react';
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Alert,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner
} from 'reactstrap'

import axios from 'axios';

class DeleteReplyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            delete_password: "",
            alert: "",
            spinner: false
        };
    }
    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            delete_password: ""
        })
    }
    handleChange = (e) => {
        this.setState({delete_password: e.target.value});
    }
    deleteReply = () => {
        this.setState({spinner: true})
        setTimeout(() => window.location.reload(), 1500);
    }
    handleSubmit = () => {
        const {thread_id} = this.props;
        const delete_password = this.state.delete_password;
        const requestBody = {
            thread_id,
            delete_password
        }
        axios
            .delete('/api/threads', {data: requestBody})
            .then((res) => {
                if (res.data !== 'Success') 
                    this.setState({alert: res.data})
                else {
                    this.setState({spinner: true})
                    setTimeout(() => window.location.href='/', 1500);
                }
                console.log(res.data)
            })
            .catch(err => {
                let alert = 'ERROR'
                this.setState({alert})
            });
    }
    render() {
        return (
            <React.Fragment>
                <button className="delete-button" onClick={this.toggle}>Delete</button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>

                    <Form>
                        <ModalBody>
                            <FormGroup>
                                <Label>Enter delete password</Label>
                                <Input
                                    type='password'
                                    name='delete_password'
                                    value={this.state.delete_password}
                                    onChange={this.handleChange}/>
                            </FormGroup>
                            {this.state.alert !== ""
                                ? <Alert color="warning">{this.state.alert}</Alert>
                                : ""}
                            {this.state.spinner
                                ? <Spinner type="grow" color="primary"/>
                                : ""}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.handleSubmit}>Delete</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

export default DeleteReplyForm;