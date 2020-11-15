import React, { useContext, useState } from 'react';
import './SearchProducts.css';
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Search } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import { ProductContext } from '../../context/product-context';
import NumberFormat from "react-number-format";

const initialSearchValues = {
    name: null,
    price: 0,
    comment: null,
    productCategoryId: null
};

const SearchProducts = () => {
    
    const [searchValues, setSearchValues] = useState(initialSearchValues);
    const [error, setError] = useState(false);
    const [productCategory, setProductCategory] = useState('');
    const { updateProducts, productCategories } = useContext(ProductContext);
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setError(false);
        setSearchValues({
            ...searchValues,
            [name]: value || null
        });
    };
    
    const handleButtonClick = () => {
        updateProducts({type: 'search', searchValues});
    }
    
    const handleCategoryChange = (event) => {
        let category = event.target.value;
        setProductCategory(category);
        setSearchValues({
            ...searchValues,
            productCategoryId: category || null
        });
    };
    
    return (
        <Grid
            component={Paper}
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}
            className={'search'}>
            <Grid xs={4} item>
                <TextField
                    fullWidth={true}
                    size={'small'}
                    placeholder={'Enter title...'}
                    label={'Filter by title'}
                    onChange={handleInputChange}
                    name={'name'}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color={'primary'}/>
                            </InputAdornment>
                        ),
                    }}
                    {...(error && { error: true })}
                    variant="outlined"/>
            </Grid>
            <Grid xs={4} item>
                <TextField
                    size={'small'}
                    placeholder={'Enter price...'}
                    label="Filter by price"
                    variant={'outlined'}
                    fullWidth={true}
                    onChange={handleInputChange}
                    name={'price'}
                    {...(error && { error })}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color={'primary'}/>
                            </InputAdornment>
                        ),
                        inputComponent: NumberFormatCustom
                    }}
                />
            </Grid>
            <Grid xs={4} item>
                <TextField
                    fullWidth={true}
                    size={'small'}
                    placeholder={'Enter comment...'}
                    label={'Filter by comment'}
                    onChange={handleInputChange}
                    name={'comment'}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color={'primary'}/>
                            </InputAdornment>
                        ),
                    }}
                    {...(error && { error })}
                    variant="outlined"/>
            </Grid>
            <Grid xs={5} item>
                <FormControl error={error} fullWidth={true} variant="outlined">
                    <InputLabel id={'category-label'}>Product Category</InputLabel>
                    <Select
                        onChange={handleCategoryChange}
                        label="Filter by category"
                        labelId="category-label"
                        variant="outlined"
                        value={productCategory}
                    >
                        <MenuItem
                            key={0}
                            value={0}>
                            {'All'}
                        </MenuItem>
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
            <Grid item xs={7}>
                <Button fullWidth={true} className={'searchButton'} size={'large'} variant={'outlined'} color="primary" onClick={handleButtonClick}>
                    Search
                </Button>
            </Grid>
        </Grid>
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


export default SearchProducts;
