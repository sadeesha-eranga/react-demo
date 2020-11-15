import React, { createContext, useEffect, useState } from 'react';
import axios from '../utils/axios';
import SwalUtils from '../utils/SwalUtils';

export const ProductContext = createContext({
    products: [],
    productCategories: [],
    count: 0,
    page: 0,
    rowsPerPage: 10,
    setPage: () => {},
    setRowsPerPage: () => {},
    updateProducts: () => {}
});

const ProductsProvider = props => {
    const [products, setProducts] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const handleResponseData = (data) => {
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
    }
    
    const updateProducts = ({ type = 'get', searchValues }) => {
        if (type === 'get') {
            axios.get(`/products?page=${page}&size=${rowsPerPage}`)
                .then(({ data }) => {
                    handleResponseData(data);
                }).catch(() => SwalUtils.showErrorSwal("Couldn't fetch data from the server!"));
        } else {
            axios.post(`/products/search?page=${page}&size=${rowsPerPage}`, searchValues)
                .then(({ data }) => {
                    handleResponseData(data);
                }).catch(() => SwalUtils.showErrorSwal("Couldn't fetch data from the server!"));
        }
    }
    
    useEffect(() => {
        axios.get(`/products?page=${page}&size=${rowsPerPage}`)
            .then(({ data }) => {
                setCount(data.totalElements);
                setProducts(data.content);
                setPage(data.pageable.pageNumber);
                setRowsPerPage(data.pageable.pageSize);
            }).catch(() => SwalUtils.showErrorSwal("Couldn't fetch data from the server!"));
        axios.get('/products/categories')
            .then(({ data }) => {
                setProductCategories(data.content);
            }).catch(() => SwalUtils.showErrorSwal("Couldn't fetch data from the server!"));
    }, [page, rowsPerPage]);
    
    return (
        <ProductContext.Provider value={{
            products,
            productCategories,
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
