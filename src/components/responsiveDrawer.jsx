import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import logo from '../assets/svg/logos/logo.svg';
import lstrings from '../lstrings.js';
import LanguageSelect from './languageSelect';
import infoLogo from '../assets/svg/ss/question.svg';
import { useHistory } from "react-router-dom";
import InventoryImage from '../assets/svg/ss/inventory-3.svg';
import DashboardImage from '../assets/svg/ss/dashboard-2.svg';
import ProcurementImage from '../assets/svg/ss/commercial-2.svg';
import PaymentStatusImage from '../assets/svg/ss/money-bag-2.svg';
import ProjectsImage from '../assets/svg/ss/brief-2.svg';
import ShipImage from '../assets/svg/ss/water-supply.svg';
import ProductionImage from '../assets/svg/ss/architect-3.svg';
import WarehouseImage from '../assets/svg/ss/warehouse-2.svg';
import GroupImage from '../assets/svg/ss/team-3.svg';
import MaterialsImage from '../assets/svg/ss/cement.svg';
import MeasureIcon from '../assets/svg/ss/measure-tape.svg';
import CategoriesIcon from '../assets/svg/ss/categories.svg';
import CustomerIcon from '../assets/svg/ss/customer.svg';
import CollectIcon from '../assets/svg/ss/collect.svg';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    menuButton: {
        marginRight: 0,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        left: 'auto',
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        left: 'auto',
        zIndex: theme.zIndex.drawer + 2,
        display: 'flex',
        justifyContent: 'space-between',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        left: 'auto',
        // width: '72px !important',
        transition: theme

            .transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    dividerFullWidth: {
        margin: `10px 0 0 ${theme.spacing(1)}px`,
        textAlign: 'left',
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        bottom: 2
    },
    imageIcon: {
        width: '100'
    },
    textStyle: {
        textAlign: 'right',
        paddingRight: '5px'
    },
    textNormal: {
        textAlign: 'left',
        paddingLeft: '5px'
    }
}));

export default function ResponsiveDrawer(props) {
    const { drawerOpen, setDrawerOpen, themeChangedInApp } = props;
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();

    const [language, setLanguage] = React.useState('en');

    const themeChanged = (event) => {
        setLanguage(event.target.value);
        let direction = 'ltr';
        let lang = event.target.value;
        if (event.target.value === 'ar') {
            direction = 'rtl';
            theme.direction = 'rtl';
            lang = 'ar';
        }
        else if (event.target.value === 'en') {
            direction = 'ltr';
            theme.direction = 'ltr';
            lang = 'en';
        }
        else {
            direction = 'ltr';
            theme.direction = 'ltr';
            lang = 'en';
        }

        document.getElementsByTagName('html')[0].setAttribute("dir", direction);

        lstrings.setLanguage(lang);

        themeChangedInApp();
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    return (

        <div className={classes.root}>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: drawerOpen,
                    [classes.drawerClose]: !drawerOpen,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: drawerOpen,
                        [classes.drawerClose]: !drawerOpen,
                    }),
                }}
            >
                <div>
                    <div className={classes.toolbar}>
                        <IconButton className={clsx(classes.menuButton, {
                            [classes.hide]: !drawerOpen,
                        })}>
                            <img src={logo} width='150' alt="" />
                        </IconButton>
                        <IconButton onClick={handleDrawerClose} className={clsx(classes.menuButton, {
                            [classes.hide]: !drawerOpen,
                        })}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>

                    <div>
                        <Divider />
                        <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                            {lstrings.Dashboard}
                        </Typography>
                        <List>
                            <ListItem button key={lstrings.ProjectsDashboard} onClick={() => history.push("/exhibitorpanel")}>
                                <ListItemIcon><img src={DashboardImage} height='25' alt="" /></ListItemIcon>
                                <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.ProjectsDashboard} />
                            </ListItem>
                            <ListItem button key={lstrings.Inventory} onClick={() => history.push("/salespanel")}>
                                <ListItemIcon><img src={InventoryImage} height='25' alt="" /></ListItemIcon>
                                <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Inventory} />
                            </ListItem>
                            <ListItem button key={lstrings.Procurement} onClick={() => history.push("/salespanel")}>
                                <ListItemIcon><img src={ProcurementImage} height='25' alt="" /></ListItemIcon>
                                <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Procurement} />
                            </ListItem>
                            <ListItem button key={lstrings.PaymentStatus} onClick={() => history.push("/salespanel")}>
                                <ListItemIcon><img src={PaymentStatusImage} height='25' alt="" /></ListItemIcon>
                                <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.PaymentStatus} />
                            </ListItem>
                        </List>
                    </div>

                    <Divider />
                    <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                        {lstrings.ProjectManagement}
                    </Typography>
                    <List>
                        <ListItem button key={lstrings.Projects} onClick={() => history.push("/projects")}>
                            <ListItemIcon><img src={ProjectsImage} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Projects} />
                        </ListItem>
                        <ListItem button key={"projects-utils"} onClick={() => history.push("/projects-utils")}>
                            <ListItemIcon><img src={CollectIcon} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary="Project Utils" />
                        </ListItem>

                        <ListItem button key={lstrings.Customers} onClick={() => history.push("/customers")}>
                            <ListItemIcon><img src={CustomerIcon} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Customers} />
                        </ListItem>
                        <ListItem button key={lstrings.SupplyVendors} onClick={() => history.push("/supplyvendors")}>
                            <ListItemIcon><img src={ShipImage} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.SupplyVendors} />
                        </ListItem>
                        <ListItem button key={lstrings.ServiceVendors} onClick={() => history.push("/servicevendors")}>
                            <ListItemIcon><img src={ProductionImage} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.ServiceVendors} />
                        </ListItem>
                    </List>

                    <Divider />
                    <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                        {lstrings.Warehouse}
                    </Typography>
                    <List>
                        <ListItem button key={lstrings.Warehouses} onClick={() => history.push("/warehouses")}>
                            <ListItemIcon><img src={WarehouseImage} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Warehouses} />
                        </ListItem>
                        <ListItem button key={lstrings.Materials} onClick={() => history.push("/materials")}>
                            <ListItemIcon><img src={MaterialsImage} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Materials} />
                        </ListItem>
                        <ListItem button key={lstrings.UOMs} onClick={() => history.push("/uoms")}>
                            <ListItemIcon><img src={MeasureIcon} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.UOMs} />
                        </ListItem>
                        <ListItem button key={lstrings.ProductCategory} onClick={() => history.push("/product-category")}>
                            <ListItemIcon><img src={CategoriesIcon} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.ProductCategory} />
                        </ListItem>
                    </List>

                    <Divider />
                    <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                        {lstrings.UserManagement}
                    </Typography>
                    <List>
                        <ListItem button key={lstrings.Users} onClick={() => history.push("/users")}>
                            <ListItemIcon><img src={GroupImage} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Users} />
                        </ListItem>
                    </List>
                    <Divider />
                    <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                        {lstrings.Misc}
                    </Typography>
                    <List>
                        <ListItem button key={lstrings.Help} onClick={() => history.push("/agenda")}>
                            <ListItemIcon><img src={infoLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Help} />
                        </ListItem>
                    </List>
                </div>
                {/* {drawerOpen && <LanguageSelect language={language} themeChanged={themeChanged}></LanguageSelect>} */}
            </Drawer>
        </div >
    );
}
