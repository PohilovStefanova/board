import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import HomePage from './components/HomePage';

import {Container} from 'reactstrap';
import Board from './components/Board';

function App() {
    return (
        <div className="App">
            <Router>
                <AppNavbar/>
                <Container>
                    <Switch>
                        <Route path="/" exact component={HomePage}/>
                        <Route path="/:thread" exact component={Board}/>
                    </Switch>
                </Container>
            </Router>
        </div>
    );
}

export default App;
