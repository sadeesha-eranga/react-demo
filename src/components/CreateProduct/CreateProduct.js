import React, { useContext, useEffect, useState } from 'react';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import axios from '../../utils/axios';
import SwalUtils from '../../utils/SwalUtils';
import { ProductContext } from '../../context/product-context';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import './CreateProduct.css';

const initialValues = {
    name: '',
    description: '',
    price: '',
    productCategoryId: '',
    launchDate: new Date()
};

const CreateProduct = () => {
    
    const [values, setValues] = useState(initialValues);
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
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        });
    };
    
    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setProductCategory(category);
        setValues({
            ...values,
            productCategoryId: category
        });
    };
    
    const handlePriceChange = (event) => {
        setValues({
            ...values,
            price: event.target.value
        });
    };
    
    const handleLaunchDateChange = (date) => {
        setValues({
            ...values,
            launchDate: date
        });
        
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
                        onChange={handleInputChange}
                        size={'small'}
                        label="Product Title"
                        name={'name'}
                        value={values.name}
                        fullWidth={true} variant="outlined"/>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name={'description'}
                        value={values.description}
                        onChange={handleInputChange}
                        multiline={true}
                        rows={2}
                        size={'small'}
                        label="Product Description"
                        fullWidth={true} variant="outlined"/>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name={'price'}
                        value={values.price}
                        size={'small'}
                        label="Product Price"
                        variant={'outlined'}
                        fullWidth={true}
                        onChange={handlePriceChange}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            className={'DatePicker'}
                            autoOk={true}
                            disableToolbar
                            disablePast
                            variant="inline"
                            inputVariant="outlined"
                            format="dd-MM-yyyy"
                            id="date-picker-inline"
                            label="Launch Date"
                            value={values.launchDate}
                            name={'launchDate'}
                            onChange={handleLaunchDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={8}>
                    <FormControl fullWidth={true} variant="outlined">
                        <InputLabel id={'category-label'}>Product Category</InputLabel>
                        <Select
                            onChange={handleCategoryChange}
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