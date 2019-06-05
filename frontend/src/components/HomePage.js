import React, {Component} from 'react';
import axios from 'axios';

import ThreadThumbnail from './ThreadThumbnail';
import PostForm from './PostForm'
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            threads: []
        };
    };

    componentDidMount() {
        axios
            .get('/api/threads')
            .then(res => {
                this.setState({threads: res.data})
            })
            .catch(err => console.log(err))
    }
    render() {
        return (
            <div>
                <h1 id="boardHeader">All threads</h1>
                <hr />
                <PostForm />
                <hr />
                {this.state.threads.map((thread, index, array) => (
                    <React.Fragment key={index}>
                            <ThreadThumbnail thread={thread}/> {index !== array.length - 1
                                ? <hr/>
                                : ""}
                        </React.Fragment>
                ))}
            </div>
        );
    }
}

export default HomePage;