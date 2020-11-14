import React from 'react';
import './App.css';
import CreateProduct from './components/CreateProduct';
import ViewProduct from './components/ViewProduct';
import Divider from '@material-ui/core/Divider';

function App() {
    return (
        <div className="app">
            <CreateProduct/>
            <Divider style={{ marginTop: 20, marginBottom: 20 }}/>
            <ViewProduct/>
        </div>
    );
}

export default App;
