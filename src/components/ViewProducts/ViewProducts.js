import React, { useContext } from 'react';
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
import axios from '../../utils/axios';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import SwalUtils from '../../utils/SwalUtils';
import { ProductContext } from '../../context/product-context';
import './ViewProducts.css';

const ViewProducts = () => {
    const { setPage, setRowsPerPage, products, count, page, rowsPerPage, updateProducts } = useContext(ProductContext);
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    const handleDelete = (productId) => {
        SwalUtils.showConfirmationSwal('Do you want to delete this product?').then((result) => {
            if (result.value) {
                SwalUtils.showLoadingSwal();
                axios.delete(`/products/${productId}`)
                    .then(() => {
                        SwalUtils.closeSwal();
                        SwalUtils.showSuccessSwal('You have deleted this product!');
                        updateProducts();
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
            <Paper className={'root'} elevation={4}>
                <TableContainer className={'container'}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align={'left'}>Name</TableCell>
                                <TableCell align={'left'}>Description</TableCell>
                                <TableCell align={'right'}>Price</TableCell>
                                <TableCell align={'center'}>Launch Date</TableCell>
                                <TableCell align={'center'}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={product.productId}>
                                    <TableCell align={'left'}>{product.name}</TableCell>
                                    <TableCell align={'left'}>{product.description}</TableCell>
                                    <TableCell align={'right'}>{product.price.toFixed(2)}</TableCell>
                                    <TableCell align={'center'}>{product.launchDate}</TableCell>
                                    <TableCell align={'center'}>
                                        <IconButton className={'DeleteButton'}
                                                    onClick={() => handleDelete(product.productId)}
                                                    component="span">
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
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
};

export default ViewProducts;
