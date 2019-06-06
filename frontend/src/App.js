import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import HomePage from './components/HomePage';
import AppFooter from './components/AppFooter';
import Info from './components/Info'
import {Container} from 'reactstrap';
import Thread from './components/Thread';

function App() {
    return (
        <div className="App">
            <Router>
                <AppNavbar/>
                <Container>
                    <Switch>
                        <Route path="/" exact component={HomePage}/>
                        <Route path="/info" component={Info} />
                        <Route path="/:thread" exact component={Thread}/>
                    </Switch>
                    <AppFooter />
                </Container>

            </Router>
        </div>
    );
}

export default App;
