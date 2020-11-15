import React from 'react';
import './App.css';
import CreateProduct from './components/CreateProduct/CreateProduct';
import ViewProducts from './components/ViewProducts/ViewProducts';
import Divider from '@material-ui/core/Divider';
import ProductsProvider from './context/product-context';

function App() {
    return (
        <div className="app">
            <ProductsProvider>
                <CreateProduct/>
                <Divider
                    style={{ marginTop: 20, marginBottom: 20 }}
                />
                <ViewProducts/>
            </ProductsProvider>
        </div>
    );
}

export default App;
