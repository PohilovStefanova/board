import React, {Component} from 'react';

import axios from 'axios';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get('/api/replies/'+this.props.match.params.thread)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
    render() {
        return (
            <h1>

            </h1>
        );
    }
}

export default Board;