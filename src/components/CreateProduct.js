import React, { useContext, useEffect, useState } from 'react';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import axios from '../utils/axios';
import SwalUtils from '../utils/SwalUtils';
import { ProductContext } from '../context/product-context';

const CreateProduct = () => {
    
    const [productCategories, setProductCategories] = useState([]);
    const [product, setProduct] = useState({ name: '', description: '' });
    const [productCategory, setProductCategory] = useState('');
    const { updateProducts } = useContext(ProductContext);
    
    useEffect(() => {
        axios.get('/products/categories')
            .then(({ data }) => {
                setProductCategories(data.content);
            });
    }, []);
    
    const onCategoryChange = (event) => {
        const category = event.target.value;
        setProductCategory(category);
        product.productCategoryId = category;
        setProduct(product);
    };
    
    const onPriceChange = (event) => {
        setProduct({ ...product, price: event.target.value });
    };
    
    const onSaveButtonClick = () => {
        SwalUtils.showLoadingSwal();
        axios.post('/products', product).then(({ data }) => {
            SwalUtils.closeSwal();
            SwalUtils.showSuccessSwal(data.message);
            updateProducts();
        }).catch((error) => {
            SwalUtils.closeSwal();
            SwalUtils.showErrorSwal(error?.response?.data?.message || 'Something went wrong!');
        });
        setProduct({ name: '', description: '', price: '', productCategoryId: '' });
        setProductCategory('');
    };
    
    return (
        <div>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-start"
                spacing={3}
            >
                <Grid item xs={12}>
                    <TextField
                        value={product.name}
                        onChange={e => setProduct({ ...product, name: e.target.value })}
                        size={'small'}
                        label="Product Title"
                        fullWidth={true} variant="outlined"/>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={product.description}
                        onChange={e => setProduct({ ...product, description: e.target.value })}
                        multiline={true}
                        rows={2}
                        size={'small'}
                        label="Product Description"
                        fullWidth={true} variant="outlined"/>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={product.price}
                        size={'small'}
                        label="Product Price"
                        variant={'outlined'}
                        fullWidth={true}
                        onChange={onPriceChange}
                        InputProps={{
                            inputComponent: NumberFormatCustom,
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth={true} variant="outlined">
                        <InputLabel id={'category-label'}>Product Category</InputLabel>
                        <Select
                            onChange={onCategoryChange}
                            label="Product Category"
                            labelId="category-label"
                            variant="outlined"
                            value={productCategory}
                        >
                            {productCategories.map(category => (
                                <MenuItem
                                    key={category.productCategoryId}
                                    value={category.productCategoryId}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth={true} variant={'contained'} color="primary" onClick={onSaveButtonClick}>
                        Save Product
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix="Rs. "
        />
    );
}

export default CreateProduct;
