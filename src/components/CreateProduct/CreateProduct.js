import React, { useContext, useEffect, useState } from 'react';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, FormHelperText } from '@material-ui/core';
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
    // const [productCategories, setProductCategories] = useState([]);
    const [productCategory, setProductCategory] = useState('');
    const [errors, setErrors] = useState({});
    const { updateProducts, productCategories } = useContext(ProductContext);
    
    // useEffect(() => {
    //     axios.get('/products/categories')
    //         .then(({ data }) => {
    //             setProductCategories(data.content);
    //         });
    // }, []);
    
    const validate = () => {
        let errs = {};
        errs.name = values.name && values.name.trim() !== '' ? '' : 'Please enter a valid product title';
        errs.price = values.price && values.price > 0 ? '' : 'Please enter a valid price';
        errs.launchDate = values.launchDate ? '' : 'Please select a launch date';
        errs.productCategoryId = values.productCategoryId ? '' : 'Please select a product category';
        setErrors(errs);
        return Object.values(errs).every(value => value === '');
    };
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    };
    
    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setProductCategory(category);
        setValues({
            ...values,
            productCategoryId: category
        });
        setErrors({
            ...errors,
            productCategoryId: ''
        });
    };
    
    const handlePriceChange = (event) => {
        setValues({
            ...values,
            price: event.target.value
        });
        setErrors({
            ...errors,
            price: ''
        });
    };
    
    const handleLaunchDateChange = (date) => {
        setValues({
            ...values,
            launchDate: date
        });
        setErrors({
            ...errors,
            launchDate: ''
        });
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            SwalUtils.showLoadingSwal();
            axios.post('/products', {
                name: values.name,
                description: values.description,
                price: values.price,
                launchDate: values.launchDate,
                productCategoryId: values.productCategoryId
            }).then(({ data }) => {
                SwalUtils.closeSwal();
                SwalUtils.showSuccessSwal(data.message);
                updateProducts();
            }).catch((error) => {
                SwalUtils.closeSwal();
                SwalUtils.showErrorSwal(error?.response?.data?.message || 'Something went wrong!');
            });
            setValues(initialValues);
            setProductCategory('');
        }
    };
    
    return (
        <form autoComplete={'off'} onSubmit={handleSubmit}>
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
                        fullWidth={true}
                        {...(errors?.name && { error: true, helperText: errors.name })}
                        variant="outlined"/>
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
                        {...(errors?.description && { error: true, helperText: errors.description })}
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
                        onChange={handleInputChange}
                        {...(errors?.price && { error: true, helperText: errors.price })}
                        InputProps={{
                            inputComponent: NumberFormatCustom
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormControl error={!!errors.launchDate}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                error={!!errors.launchDate}
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
                        {errors.launchDate && <FormHelperText>{errors.launchDate}</FormHelperText> }
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <FormControl error={!!errors.productCategoryId} fullWidth={true} variant="outlined">
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
                        {errors.productCategoryId && <FormHelperText>{errors.productCategoryId}</FormHelperText> }
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth={true} variant={'contained'} color="primary" type={'submit'}>
                        Save Product
                    </Button>
                </Grid>
            </Grid>
        </form>
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
