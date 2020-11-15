import React, { createContext, useEffect, useState } from 'react';
import axios from '../utils/axios';
import SwalUtils from '../utils/SwalUtils';

export const ProductContext = createContext({
    products: [],
    count: 0,
    page: 0,
    rowsPerPage: 10,
    setPage: () => {},
    setRowsPerPage: () => {},
    updateProducts: () => {}
});

const ProductsProvider = props => {
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const updateProducts = () => {
        console.log('updateProducts');
        axios.get(`/products?page=${page}&size=${rowsPerPage}`)
            .then(({ data }) => {
                if (data.content.length > 0) {
                    setCount(data.totalElements);
                    setProducts(data.content);
                    setPage(data.pageable.pageNumber);
                    setRowsPerPage(data.pageable.pageSize);
                } else {
                    if (page > 0) {
                        setPage(page - 1);
                    } else {
                        setProducts([]);
                        setCount(0);
                    }
                }
            }).catch(() => SwalUtils.showErrorSwal("Couldn't fetch data from the server!"));
    }
    
    useEffect(() => {
        console.log('useEffect');
        axios.get(`/products?page=${page}&size=${rowsPerPage}`)
            .then(({ data }) => {
                setCount(data.totalElements);
                setProducts(data.content);
                setPage(data.pageable.pageNumber);
                setRowsPerPage(data.pageable.pageSize);
            }).catch(() => SwalUtils.showErrorSwal("Couldn't fetch data from the server!"));;
    }, [page, rowsPerPage]);
    
    return (
        <ProductContext.Provider value={{
            products,
            count,
            page,
            rowsPerPage,
            updateProducts,
            setPage,
            setRowsPerPage
        }}>
            {props.children}
        </ProductContext.Provider>
    );
}

export default ProductsProvider;
