import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../utils/axios';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import SwalUtils from '../utils/SwalUtils';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 500,
    },
});

const ViewProduct = () => {
    const classes = useStyles();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    useEffect(() => {
        axios.get(`/products?page=${page}&size=${rowsPerPage}`)
            .then((response) => {
                setProducts(response.data.content);
            });
    }, [page, rowsPerPage]);
    
    const handleDelete = (productId) => {
        SwalUtils.showConfirmationSwal('Do you want to delete this product?').then((result) => {
            if (result.value) {
                SwalUtils.showLoadingSwal();
                axios.delete(`/products/${productId}`)
                    .then(({ data }) => {
                        SwalUtils.closeSwal();
                        SwalUtils.showSuccessSwal('You have deleted this product!');
                    })
                    .catch((error) => {
                        SwalUtils.closeSwal();
                        SwalUtils.showErrorSwal(error?.response?.data?.message || 'Something went wrong!');
                    });
            }
        });
    };
    
    return (
        <div>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align={'left'}>Name</TableCell>
                                <TableCell align={'left'}>Description</TableCell>
                                <TableCell align={'right'}>Price</TableCell>
                                <TableCell align={'center'}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={product.productId}>
                                    <TableCell align={'left'}>{product.name}</TableCell>
                                    <TableCell align={'left'}>{product.description}</TableCell>
                                    <TableCell align={'right'}>{product.price.toFixed(2)}</TableCell>
                                    <TableCell align={'center'}>
                                        <IconButton onClick={() => handleDelete(product.productId)} component="span">
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={products.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
};

export default ViewProduct;
