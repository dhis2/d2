import {createClass, default as React} from 'react';
import Nav from './Nav';
import Content from './Content';

export default createClass({
    render() {
        return (
            <div>
                <Nav />
                <Content />
            </div>
        );
    },
});
