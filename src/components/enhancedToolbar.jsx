import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        marginTop: 50
    },
    title: {
        flex: '1 1 100%',
        textAlign: 'center'
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();

    return (
        <Toolbar className={clsx(classes.root)} >
            <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                {props.title}
            </Typography>
        </Toolbar>
    );
};

export default EnhancedTableToolbar;