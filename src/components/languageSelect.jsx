import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function LanguageSelect({language, themeChanged}) {
    const classes = useStyles();
    return (
        <FormControl variant="outlined" className={classes.formControl}>
            < NativeSelect
                id="demo-simple-select-outlined"
                value={language}
                onChange={themeChanged}
                label="Language"
            >
                <option value={'en'}>English</option>
                <option value={'ar'}>عربى</option>
            </NativeSelect>
        </FormControl>
    );
}
