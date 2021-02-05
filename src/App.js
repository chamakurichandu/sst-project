import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import NavBar from './components/navbar';
import ResponsiveDrawer from './components/responsiveDrawer';
// import Game from './components/game';
// import Exhibitors from './components/exhibitors';
// import Attendees from './components/attendees';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import clsx from 'clsx';
import SignInSide from './components/signInSidePage';
import SignUpSide from './components/signUpSidePage';
import VerifyEmail from './components/verifyEmail';
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/resetPassword';
import SetPassword from './components/setPassword';
// import Auditoriumcss3d from './components/auditoriumcss3d';
// import FlatAuditorium from './components/flatAuditorium';
import NotFound from './components/notfound';
// import Agenda from './components/agenda';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
// import Mentors from './components/mentors';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { AlertTitle } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import BusinessCard from './components/businessCard';
// import VideoApp from './twilioproj/videoApp';
import AppStateProvider from './twilioproj/state';
// import NetworkingRooms from './components/networkingRooms';
// import SSWebSocket from './components/ssWebSocket';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import config from './config.json';
import { Message } from "react-chat-ui";
// import MentorPanel from './components/mentorPanel';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import FlatYoutubeAuditorium from './components/flatYoutubeAuditorium';
// import SalesPanel from './components/salesPanel';
// import ExhibitorPanel from './components/exhibitorPanel';
// import EventFeed from './components/eventFeed';
// import EditStall from './components/editStall';
// import Fab from '@material-ui/core/Fab';
// import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import Users from './components/users';
import AddNewUser from './components/addNewUser';
import EditUser from './components/editUser';
import Warehouses from './components/warehouses';
import AddNewWarehouse from './components/addNewWarehouse';
import EditWarehouse from './components/editWarehouse';
import AddManagers from './components/addManagers';
import Materials from './components/materials';
import AddMaterial from './components/addMaterial';
import EditMaterial from './components/editMaterial';
import UOM from './components/uom';
import ProductCategory from './components/productCategory';
import SupplyVendors from './components/supplyVendors';
import AddSupplyVendor from './components/addSupplyVendor';
import EditSupplyVendor from './components/editSupplyVendor';
import ServiceVendors from './components/serviceVendors';
import AddServiceVendor from './components/addServiceVendor';
import EditServiceVendor from './components/editServiceVendor';
import Projects from './components/projects';
import Customers from './components/customers';
import AddCustomer from './components/addCustomer';
import EditCustomer from './components/editCustomer';
import ProjectUtils from './components/projectUtils';
import AddProject from './components/addProject';
import EditProject from './components/editProject';
import ProjectDetails from './components/projectDetails';
import WarehouseHome from './components/warehouseHome';
import Procurements from './components/procurements';
import WarehouseReceive from './components/warehouseReceive';
import WarehouseReceiveDetails from './components/warehouseReceiveDetails';
import UpdateProjectWork from './components/updateProjectWork';
import ReleaseIndents from './components/releaseIndents';
import DocumentsFolder from './components/documentsFolder';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App(props) {
  const dir = document.getElementsByTagName('html')[0].getAttribute('dir');

  const fullScreenHandle = useFullScreenHandle();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [refreshUI, setRefreshUI] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [showSalesVideoCallNotification, setShowSalesVideoCallNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [createBusinessCard, setCreateBusinessCard] = useState(false);
  const history = useHistory();
  const [businessCardStep, setBusinessCardStep] = useState(1);
  const [showMentorVideo, setShowMentorVideo] = useState(false);
  const [showSalesVideoCall, setShowSalesVideoCall] = useState(false);
  const [showNetworkingVideo, setShowNetworkingVideo] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [newMessages, setNewMessages] = useState([]);
  const [webSocketClient, setWebSocketClient] = useState(null);
  const [isMentor, setIsMentor] = useState(false);
  const [isExhibitor, setIsExhibitor] = useState(false);
  const [isAttendee, setIsAttendee] = useState(false);
  const [isSalesMen, setIsSalesMen] = useState(false);

  const [superAdminRole, setSuperAdminRole] = useState(false);
  const [adminRole, setAdminRole] = useState(false);
  const [warehouseRole, setWarehouseRole] = useState(false);
  const [procurementRole, setProcurementRole] = useState(false);
  const [projectManagerRole, setProjectManagerRole] = useState(false);
  const [engineeringManagerRole, setEngineeringManagerRole] = useState(false);
  const [supervisorRole, setSupervisorRole] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseReceiveTransaction, setWarehouseReceiveTransaction] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedUOM, setSelectedUOM] = React.useState(null);
  const [selectedSupplyVendor, setSelectedSupplyVendor] = React.useState(null);
  const [selectedServiceVendor, setSelectedServiceVendor] = React.useState(null);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [selectedProjectWork, setSelectedProjectWork] = React.useState(null);


  const [pingTimer, setPingTimer] = useState(null);
  const [mentorAppliedRequests, setMentorAppliedRequests] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [salesCallRequests, setSalesCallRequests] = useState([]);
  const [inProcessUser, setInProcessUser] = useState(null);
  const [videoCallWaiting, setVideoCallWaiting] = useState(false);
  const [videoCallWaitingQueueSize, setVideoCallWaitingQueueSize] = useState(0);
  const [videoCallWaitingQueuePosition, setVideoCallWaitingQueuePosition] = useState(0);
  const [currentExhibitorStallInfo, setCurrentExhibitorStallInfo] = useState(null);
  const [salesVideoCallMembers, setSalesVideoCallMembers] = useState([]);
  const [salesVideoCallMembersNames, setSalesVideoCallMembersNames] = useState([]);
  const [salesPersonCalling, setSalesPersonCalling] = useState(null);
  const [salesPersonCallingName, setSalesPersonCallingName] = useState(null);

  const [productCategories, setProductCategories] = React.useState(null);
  const [UOMs, setUOMs] = React.useState(null);
  const [customers, setCustomers] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [warehouses, setWarehouses] = React.useState([]);

  const [project, setProject] = React.useState(null);
  const [procurement, setProcurement] = React.useState(null);

  const [currentMode, setCurrentMode] = React.useState(0);
  const [modes, setModes] = React.useState(["Home", "Procurement", "Warehouse", "Projects", "Outsourcing", "Finance", "HR & Payroll", "Analytics", "Admin Settings"]);

  const left = !drawerOpen ? '72px' : '240px';
  const right = !drawerOpen ? '72px' : '240px';
  const leftM = !drawerOpen ? '52px' : '240px';
  const rightM = !drawerOpen ? '52px' : '240px';

  const useStyles = makeStyles((theme) => ({

    root: {
      flexGrow: 1,
    },
    open: {
      width: "calc(100vw - 240px)",
      position: "relative",
      '@media (max-width: 600px)': {
        width: "calc(100vw - 52px)",
      }
    },
    close: {
      width: "calc(100vw - 72px)",
      position: "relative",
      '@media (max-width: 600px)': {
        width: "calc(100vw - 52px)",
      }
    },
    left: {
      left: left,
      '@media (max-width: 600px)': {
        left: leftM
      }
    },
    right: {
      right: right,
      '@media (max-width: 600px)': {
        right: rightM
      }
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));
  const classes = useStyles();

  const themeChanged = () => {
    console.log("themeChangedInApp");
    setRefreshUI(false);

    setTimeout(() => {
      setRefreshUI(true);
    }, 10);
  };

  const openWebSocketConnect = () => {
    closeWebSocketConnection();
    let profileData = JSON.parse(window.localStorage.getItem("profile"));
    console.log(profileData);
    const fullUrl = config["websocketurl"];// + profileData["user_id"];
    console.log(fullUrl);
    const newClient = new W3CWebSocket(fullUrl);
    const pingData = { "action": "sendmessage", "payload": { "to": profileData["user_id"], "body": "ping", "type": "chat" } };

    setWebSocketClient(newClient);
    newClient.onopen = () => {
      console.log('WebSocket Client Connected');
      console.log("client.readyState: ", newClient.readyState);

      // newClient.send(JSON.stringify({ "action": "presence", "payload": { "action": "subscribe" } }));

      let timer = setInterval(async () => {
        try {
          await Auth.currentAuthenticatedUser();
          newClient.send(JSON.stringify(pingData));
        }
        catch (error) {
          console.log("Error: ", error);
        }
      }, 60000);

      setPingTimer(timer);
    };
    newClient.onclose = (event) => {
      console.log("WebSocket is closed now.: ", event);

      setTimeout(() => {
        openWebSocketConnect();
      }, 2000);
    };
    newClient.onmessage = (message) => {
      console.log(message.data);
      const jsonData = JSON.parse(message.data);
      console.log(jsonData["action"]);
      switch (jsonData["action"]) {

        case "auth":
          const data = { "action": "auth", "payload": { "user_id": profileData["user_id"], "user_name": (profileData["name"] ? profileData["name"] : "") } };
          console.log(data);
          newClient.send(JSON.stringify(data));
          break;

        case "presence":
          // console.log(jsonData["payload"]["action"]);
          if (jsonData["payload"]["action"] === "status") {
            if (jsonData["payload"]["type"] === "online") {
              console.log(jsonData["payload"]["from"] + "  came online");
              //props.onUserCameOnline(jsonData["payload"]["from"]);
            }
            else {
              console.log(jsonData["payload"]["from"] + "  went offline");
              //props.onUserWentOffline(jsonData["payload"]["from"]);
            }
          }
          else if (jsonData["payload"]["action"] === "roster") {
            console.log(jsonData["payload"]["members"]);
          }
          break;

        case "sendmessage":
          if (jsonData["payload"]["type"] === "chat") {
            if (jsonData["payload"]["body"] === "ping") {
              // Its a ping message
              console.log("Ping");
            }
            else {
              // let messages = { ...chatMessages };
              //console.log("before: ", chatMessages);
              if (chatMessages[jsonData["payload"]["from"]] === undefined)
                chatMessages[jsonData["payload"]["from"]] = [];

              const msg = new Message({ id: 1, message: jsonData["payload"]["body"] });
              chatMessages[jsonData["payload"]["from"]].push(msg);

              const msgs = [...chatMessages[jsonData["payload"]["from"]]];
              setNewMessages(msgs);

              showNotificationForNewChatMessage("New : " + jsonData["payload"]["body"]);
            }
          }
          break;
        case "mentor":
          if (jsonData["payload"]["type"]) {
            if (jsonData["payload"]["type"] === "accept") {
              // jsonData["payload"]["mentor"]

              setShowNotification(true);
            }
            else if (jsonData["payload"]["type"] === "reject") {
              // getListOfAppliedMentoring();
            }
            else if (jsonData["payload"]["type"] === "applied") {
              console.log("mentors: ", jsonData["payload"]["mentors"]);
              let appliedMentors = [];
              for (let i = 0; i < jsonData["payload"]["mentors"].length; ++i) {
                appliedMentors.push(jsonData["payload"]["mentors"][0]["mentor_id"]);
              }
              setMentorAppliedRequests(appliedMentors);
              // {"action": "mentor", "payload": {"type": "applied", "mentors": [{"mentor_id": "ap-south-1_EH6LoIlGK:61fe920d-1dea-44c2-a727-ec6ea18a3389", "message": "asds"}]}}
            }
            else if (jsonData["payload"]["type"] === "list") {
              if (jsonData["payload"]["members"] && jsonData["payload"]["members"].length > 0) {
                setMentorRequests([...jsonData["payload"]["members"]]);
                console.log("setting memebers applied for mentoring");
                // /console.log(jsonData["payload"]["members"][0]["user_id"]);
              }
              else {
                setMentorRequests([]);
              }
            }
          }
          break;
        case "sales":
          console.log("------ sales -------");
          console.log("jsonData[payload]: ", jsonData["payload"]);
          if (jsonData["payload"]["type"]) {
            if (jsonData["payload"]["type"] === "applied") {
              console.log("Action: Sales: type: applied");
              console.log(jsonData["payload"]["saless"]);
            }
            else if (jsonData["payload"]["type"] === "list") {
              console.log(jsonData["payload"]["members"]);
              setSalesVideoCallMembers(jsonData["payload"]["members"]);
              setSalesVideoCallMembersNames(jsonData["payload"]["members_names"]);
            }
            else if (jsonData["payload"]["type"] === "enqueue") {
              console.log("Action: Sales: type: enqueue");
            }
            else if (jsonData["payload"]["type"] === "dequeue") {
              console.log("Action: Sales: type: dequeue");
            }
            else if (jsonData["payload"]["type"] === "accept") {
              setSalesPersonCalling(jsonData["payload"]["sales"]);
              setSalesPersonCallingName(jsonData["payload"]["sales_name"]);
              setShowSalesVideoCallNotification(true);

              setVideoCallWaiting(false);
              setVideoCallWaitingQueuePosition(0);
              setVideoCallWaitingQueueSize(0);
            }
            else if (jsonData["payload"]["type"] === "reject") {
              setVideoCallWaiting(false);
              setVideoCallWaitingQueuePosition(0);
              setVideoCallWaitingQueueSize(0);
            }
            else if (jsonData["payload"]["type"] === "queue") {
              console.log("queue: ", jsonData["payload"]);
              setVideoCallWaitingQueuePosition(jsonData["payload"]["pos"]);
              setVideoCallWaitingQueueSize(jsonData["payload"]["total"]);
            }
          }
          break;

          if (jsonData["payload"]["type"]) {

          }
      }
    };
  };

  const closeWebSocketConnection = () => {
    if (webSocketClient != null) {
      webSocketClient.close();
    }

    if (pingTimer) {
      clearInterval(pingTimer);
      setPingTimer(null);
    }
  };

  const sendChat = (to, message) => { // to and message in props
    console.log("sendChat 1");
    if (webSocketClient && webSocketClient.readyState === WebSocket.OPEN) {
      console.log("sendChat 2: to: ", to);
      const data = { "action": "sendmessage", "payload": { "to": to, "body": message, "type": "chat" } };
      webSocketClient.send(JSON.stringify(data));

      const msg = new Message({ id: 0, message: message });
      if (chatMessages[to] === undefined)
        chatMessages[to] = [];
      chatMessages[to].push(msg);

      const msgs = [...chatMessages[to]];
      setNewMessages(msgs);

      return true;
    }

    return false;
  };

  const sendGetListForMentoring = () => {
    console.log("sendGetListForMentoring 1");
    if (webSocketClient && webSocketClient.readyState === WebSocket.OPEN) {
      let profileData = JSON.parse(window.localStorage.getItem("profile"));

      const data = { "action": "mentor", "payload": { "mentor": profileData["user_id"], "type": "list" } };
      webSocketClient.send(JSON.stringify(data));
    };
  };

  const sendGetSalesVideoCallQueue = (sales_user_id) => {
    console.log("sendGetSalesVideoCallQueue");
    if (webSocketClient && webSocketClient.readyState === WebSocket.OPEN) {
      const data = { "action": "sales", "payload": { "sales": sales_user_id, "type": "list" } };
      webSocketClient.send(JSON.stringify(data));
    };
  };

  const applyForMentoring = (to, message) => {
    console.log("applyForMentoring 1");
    if (webSocketClient && webSocketClient.readyState === WebSocket.OPEN) {
      const data = {
        "action": "mentor",
        "payload": {
          "mentor": to,
          "type": "enqueue",
          "message": message
        }
      };
      webSocketClient.send(JSON.stringify(data));

      getListOfAppliedMentoring();

      return true;
    }

    return false;
  };

  const applyForSalesVideoCall = (to) => {
    console.log("applyForSalesVideoCall 1");
    if (webSocketClient && webSocketClient.readyState === WebSocket.OPEN) {
      const data = {
        "action": "sales",
        "payload": {
          "type": "enqueue",
          "sales": to
        }
      };
      webSocketClient.send(JSON.stringify(data));

      setVideoCallWaiting(true);
      // sendGetSalesVideoCallQueue(to);
      appliedForSalesVideoCall();

      return true;
    }

    return false;
  };

  const appliedForSalesVideoCall = () => {
    console.log("appliedForSalesVideoCall 1");
    if (webSocketClient && webSocketClient.readyState === WebSocket.OPEN) {
      const data = {
        "action": "sales",
        "payload": {
          "type": "applied"
        }
      };
      webSocketClient.send(JSON.stringify(data));

      return true;
    }

    return false;
  };

  const acceptAttendeeForMentoring = (to, action) => {
    console.log("acceptAttendeeForMentoring 1");
    if (webSocketClient && webSocketClient.readyState === WebSocket.OPEN) {
      let profileData = JSON.parse(window.localStorage.getItem("profile"));
      console.log("acceptAttendeeForMentoring 2: to: ", to);
      const data = {
        "action": "mentor",
        "payload": {
          "attendee": to,
          "type": action
        }
      };
      webSocketClient.send(JSON.stringify(data));

      return true;
    }

    return false;
  };

  const acceptAttendeeForSalesCall = (to, action) => {
    console.log("acceptAttendeeForSalesCall 1");
    if (webSocketClient && webSocketClient.readyState === WebSocket.OPEN) {
      let profileData = JSON.parse(window.localStorage.getItem("profile"));
      console.log("acceptAttendeeForSalesCall 2: to: ", to);
      const data = {
        "action": "sales",
        "payload": {
          "attendee": to,
          "type": action
        }
      };
      webSocketClient.send(JSON.stringify(data));

      setSalesPersonCalling(profileData["user_id"]);
      setSalesPersonCallingName(to);

      return true;
    }

    return false;
  };

  const getListOfAppliedMentoring = () => {
    console.log("getListOfAppliedMentoring 1");
    if (webSocketClient && webSocketClient.readyState === WebSocket.OPEN) {
      console.log("getListOfAppliedMentoring 2");
      const data = {
        "action": "mentor",
        "payload": {
          "type": "applied"
        }
      };
      webSocketClient.send(JSON.stringify(data));

      return true;
    }

    return false;
  };

  const loadPreviousMessages = (to) => {
    if (chatMessages[to] === undefined)
      chatMessages[to] = [];
    const msgs = [...chatMessages[to]];
    setNewMessages(msgs);
  };

  const onNewPasswordRequired = () => {
    history.push('/setpassword');
  };

  const onAuthSuccess = (needToThrow = true) => {
    console.log("onAuthSuccess 1");
    let profileData = JSON.parse(window.localStorage.getItem("profile"));
    console.log("onAuthSuccess 1.1");
    console.log(profileData);
    console.log("onAuthSuccess 1.2");
    if (profileData["name"] === null) {
      setBusinessCardStep(1);
      setCreateBusinessCard(true);
    }

    console.log("onAuthSuccess 2");
    console.log("profileData[role]: ", profileData["role"]);

    setSuperAdminRole(profileData["role"].includes("superadmin"));
    setAdminRole(profileData["role"].includes("admin"));
    setWarehouseRole(profileData["role"].includes("warehouse"));
    setProcurementRole(profileData["role"].includes("procurement"));
    setProjectManagerRole(profileData["role"].includes("projectmanager"));
    setEngineeringManagerRole(profileData["role"].includes("engineeringmanager"));
    setSupervisorRole(profileData["role"].includes("supervisor"));
    console.log("onAuthSuccess 3");
    if ((profileData["role"].includes("superadmin")
      || profileData["role"].includes("admin")
      || profileData["role"].includes("warehouse")
      || profileData["role"].includes("procurement")
      || profileData["role"].includes("projectmanager")
      || profileData["role"].includes("engineeringmanager")
      || profileData["role"].includes("supervisor")
    )
    ) {
      // console.log("Valid User");
      // openWebSocketConnect();

      setAuthSuccess(true);
    }
    else {
      console.log("onAuthSuccess 4");
      setAuthSuccess(false);
      console.log("onAuthSuccess 5");
      if (needToThrow) {
        throw new Error("Not authorized to access");
      }
      else {
        console.log("Redirect to signin");
      }

      return;
    }
  };

  const onAuthFailure = () => {
    setAuthSuccess(false);
  };

  const showBusinessCard = (step) => {
    setBusinessCardStep(step);
    setCreateBusinessCard(true);
  };

  const closeBusinessCard = () => {
    setCreateBusinessCard(false);
  };

  const onSignUpSuccess = () => {
    // console.log("onSignUpSuccess");
    // console.log(props);
    history.push('/verifyemail');
  };

  const onVerifyEmailSuccess = () => {
    console.log("onVerifyEmailSuccess");
    //checkIsAuthenticated();
  };

  const onForgotPasswordSuccess = () => {

  };

  const onResetPasswordSuccess = () => {

  };

  async function checkIsAuthenticated() {
    try {
      let user = await Auth.currentAuthenticatedUser();
      setAuthSuccess(true);
    }
    catch (error) {
      console.log("error in auth checking");
      setAuthSuccess(false);
    }
  };

  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      console.log("useEffect");
      try {
        const url = config["baseurl"] + "/api/user/checkauth";
        axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
        const response = await axios.get(url);
        console.log("checkAuth: response: ", response);
        onAuthSuccess(false);
      }
      catch (error) {
        console.log("error in authchecking");
        setAuthSuccess(false);
      }
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      // closeWebSocketConnection();
      setInProcessUser(null);
      window.localStorage.setItem("authToken", null);
      // await Auth.signOut();
      setAuthSuccess(false);
      console.log("called replace");
    } catch (error) {
      console.log('error signing out: ', error);
      setAuthSuccess(false);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const showNotificationForNewChatMessage = (message) => {
    enqueueSnackbar(message, { anchorOrigin: { vertical: "bottom", horizontal: "right" }, variant: "info" });
  };

  const takeMentorCall = () => {
    console.log("takeMentorCall");
    // history.push("/mentoringrooms");

    window.localStorage.setItem("twilioRoomName", "12345678");
    setShowNotification(false);
    setShowMentorVideo(true);
  };

  const takeExhibitorVideoCall = () => {
    console.log("takeExhibitorVideoCall");
    setShowSalesVideoCallNotification(false);
    setShowSalesVideoCall(true);
  }

  const closeVideoApp = () => {
    console.log("closeVideoApp func called");
    setShowMentorVideo(false);
    setShowNetworkingVideo(false);
    setShowSalesVideoCall(false);
    setShowSalesVideoCallNotification(false);
  };

  const joinNetworkingRoom = (inRoomName) => {
    setRoomName(inRoomName);
    setShowNetworkingVideo(true);
  };

  const sendAcceptForMentoring = (user_id) => {
    console.log("sendAcceptForMentoring");
    acceptAttendeeForMentoring(user_id, "accept");

    window.localStorage.setItem("twilioRoomName", "12345678");

    setShowMentorVideo(true);
  };

  const sendRejectForMentoring = (user_id) => {
    console.log("sendRejectForMentoring");
    acceptAttendeeForMentoring(user_id, "reject");
  };

  const sendAcceptForSalesCall = (user_id) => {
    console.log("sendAcceptForMentoring");
    acceptAttendeeForSalesCall(user_id, "accept");

    window.localStorage.setItem("twilioRoomName", "12345678");
    setShowSalesVideoCall(true);
  };

  const sendRejectForSalesCall = (user_id) => {
    console.log("sendRejectForMentoring");
    acceptAttendeeForSalesCall(user_id, "reject");
  };

  console.log("authSuccess: ", authSuccess);
  return (
    <React.Fragment>
      <FullScreen handle={fullScreenHandle}>
        <main>
          {/* {authSuccess && <SSWebSocket chatMessage={chatMessage} />} */}
          <div className={classes.root}>
            {!authSuccess &&
              <BrowserRouter>
                <Switch>
                  <Route exact path="/signin" render={(props) => <SignInSide onAuthSuccess={onAuthSuccess} onNewPasswordRequired={onNewPasswordRequired} setInProcessUser={setInProcessUser} {...props} />} />
                  <Route exact path="/signup" render={(props) => <SignUpSide onSignUpSuccess={onSignUpSuccess} {...props} />} />
                  <Route exact path="/verifyemail" render={(props) => <VerifyEmail onVerifyEmailSuccess={onVerifyEmailSuccess} {...props} />} />
                  <Route exact path="/forgotpassword" render={(props) => <ForgotPassword onForgotPasswordSuccess={onForgotPasswordSuccess} {...props} />} />
                  <Route exact path="/resetpassword" render={(props) => <ResetPassword onResetPasswordSuccess={onResetPasswordSuccess} {...props} />} />
                  {inProcessUser && <Route exact path="/setpassword" render={(props) => <SetPassword onAuthSuccess={onAuthSuccess} inProcessUser={inProcessUser} {...props} />} />}
                  <Route exact path="/" render={(props) => <SignInSide onAuthSuccess={onAuthSuccess} onNewPasswordRequired={onNewPasswordRequired} setInProcessUser={setInProcessUser} {...props} />} />
                  <Redirect to="/signin" />
                </Switch>
              </BrowserRouter>
            }

            {authSuccess && !showMentorVideo && !showNetworkingVideo && !showSalesVideoCall &&
              < BrowserRouter >
                <NavBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} currentMode={currentMode} setCurrentMode={setCurrentMode} modes={modes} setModes={setModes} projects={projects} setProjects={setProjects} setProject={setProject} handleSignOut={handleSignOut} showBusinessCard={showBusinessCard} fullScreenHandleEnter={fullScreenHandle.enter} videoCallWaiting={videoCallWaiting} videoCallWaitingQueueSize={videoCallWaitingQueueSize} videoCallWaitingQueuePosition={videoCallWaitingQueuePosition} />
                <ResponsiveDrawer drawerOpen={drawerOpen} currentMode={currentMode} setCurrentMode={setCurrentMode} modes={modes} setModes={setModes} project={project} setDrawerOpen={setDrawerOpen} isSalesMen={isSalesMen} isExhibitor={isExhibitor} isManagePanels={isSalesMen || isExhibitor} themeChangedInApp={themeChanged} />
                <Switch>
                  {<Route exact path="/project-approvals" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <DocumentsFolder refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} type={"approvals"} project={project} {...props} /> </div>} />}
                  {<Route exact path="/project-lettercorr" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <DocumentsFolder refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} type={"lettercorr"} project={project} {...props} /> </div>} />}
                  {<Route exact path="/project-dwaboq" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <DocumentsFolder refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} type={"dwaboq"} project={project} {...props} /> </div>} />}
                  {<Route exact path="/project-projectestimates" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <DocumentsFolder refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} type={"projectestimates"} project={project} {...props} /> </div>} />}
                  {<Route exact path="/project-workorders" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <DocumentsFolder refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} type={"workorders"} project={project} {...props} /> </div>} />}

                  {<Route exact path="/projects" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <Projects refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} setSelectedProject={setSelectedProject} setCustomers={setCustomers} setProject={setProject}  {...props} /> </div>} />}
                  {<Route exact path="/projects-utils" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <ProjectUtils refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole}  {...props} /> </div>} />}
                  {<Route exact path="/addproject" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <AddProject refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole}  {...props} /> </div>} />}
                  {<Route exact path="/editproject" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <EditProject refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} project={project} customers={customers} {...props} /> </div>} />}
                  {<Route exact path="/projectdetails" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <ProjectDetails refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} project={project} setProject={setProject} customers={customers} setSelectedProjectWork={setSelectedProjectWork} {...props} /> </div>} />}
                  {<Route exact path="/updateprojectwork" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <UpdateProjectWork refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} project={project} customers={customers} projectWork={selectedProjectWork} {...props} /> </div>} />}

                  {<Route exact path="/procurements" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <Procurements refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} setProcurement={setProcurement} projects={projects} setProjects={setProjects} warehouses={warehouses} setWarehouses={setWarehouses} {...props} /> </div>} />}

                  {<Route exact path="/customers" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <Customers refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} setSelectedCustomer={setSelectedCustomer}  {...props} /> </div>} />}
                  {<Route exact path="/addcustomer" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <AddCustomer refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} {...props} /> </div>} />}
                  {<Route exact path="/editcustomer" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <EditCustomer refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} selectedCustomer={selectedCustomer} {...props} /> </div>} />}

                  {<Route exact path="/servicevendors" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <ServiceVendors refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} setSelectedServiceVendor={setSelectedServiceVendor}  {...props} /> </div>} />}
                  {<Route exact path="/addservicevendor" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <AddServiceVendor refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} {...props} /> </div>} />}
                  {<Route exact path="/editservicevendor" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <EditServiceVendor refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} selectedServiceVendor={selectedServiceVendor} {...props} /> </div>} />}

                  {<Route exact path="/supplyvendors" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <SupplyVendors refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} setSelectedSupplyVendor={setSelectedSupplyVendor}  {...props} /> </div>} />}
                  {<Route exact path="/addsupplyvendor" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <AddSupplyVendor refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} {...props} /> </div>} />}
                  {<Route exact path="/editsupplyvendor" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <EditSupplyVendor refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} selectedSupplyVendor={selectedSupplyVendor} {...props} /> </div>} />}

                  {adminRole && <Route exact path="/addmanagers" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <AddManagers refreshUI={refreshUI} onAuthFailure={onAuthFailure} selectedWarehouse={selectedWarehouse} setSelectedWarehouse={setSelectedWarehouse} {...props} /> </div>} />}
                  {adminRole && <Route exact path="/addwarehouse" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <AddNewWarehouse refreshUI={refreshUI} onAuthFailure={onAuthFailure} selectedWarehouse={selectedWarehouse} {...props} /> </div>} />}
                  {adminRole && selectedWarehouse && <Route exact path="/editwarehouse" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <EditWarehouse refreshUI={refreshUI} onAuthFailure={onAuthFailure} selectedWarehouse={selectedWarehouse} setSelectedWarehouse={setSelectedWarehouse} {...props} /> </div>} />}
                  {(warehouseRole || adminRole) && <Route exact path="/warehouses" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <Warehouses refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} setSelectedWarehouse={setSelectedWarehouse} {...props} /> </div>} />}
                  {(warehouseRole || adminRole) && <Route exact path="/warehousehome" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <WarehouseHome refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} warehouse={selectedWarehouse} setWarehouseReceiveTransaction={setWarehouseReceiveTransaction} {...props} /> </div>} />}
                  {(warehouseRole || adminRole) && <Route exact path="/warehousereceive" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <WarehouseReceive refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} warehouse={selectedWarehouse} {...props} /> </div>} />}
                  {(warehouseRole || adminRole) && <Route exact path="/warehousereceivedetails" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <WarehouseReceiveDetails refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} warehouse={selectedWarehouse} warehouseReceiveTransaction={warehouseReceiveTransaction} {...props} /> </div>} />}
                  {(warehouseRole || adminRole) && <Route exact path="/releaseindents" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <ReleaseIndents refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} warehouse={selectedWarehouse} {...props} /> </div>} />}



                  {(warehouseRole || adminRole) && <Route exact path="/addmaterial" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <AddMaterial refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} productCategories={productCategories} setProductCategories={setProductCategories} UOMs={UOMs} setUOMs={setUOMs} {...props} /> </div>} />}
                  {(warehouseRole || adminRole) && <Route exact path="/editmaterial" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <EditMaterial refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} productCategories={productCategories} setProductCategories={setProductCategories} UOMs={UOMs} setUOMs={setUOMs} selectedMaterial={selectedMaterial} {...props} /> </div>} />}
                  {(warehouseRole || adminRole) && <Route exact path="/materials" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <Materials refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} productCategories={productCategories} setProductCategories={setProductCategories} UOMs={UOMs} setUOMs={setUOMs} setSelectedMaterial={setSelectedMaterial} {...props} /> </div>} />}

                  {(warehouseRole || adminRole) && <Route exact path="/uoms" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <UOM refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} UOMs={UOMs} setUOMs={setUOMs} {...props} /> </div>} />}

                  {(warehouseRole || adminRole) && <Route exact path="/product-category" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <ProductCategory refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} productCategories={productCategories} setProductCategories={setProductCategories} {...props} /> </div>} />}

                  {adminRole && <Route exact path="/users" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <Users refreshUI={refreshUI} onAuthFailure={onAuthFailure} setSelectedUser={setSelectedUser} {...props} /> </div>} />}
                  {adminRole && <Route exact path="/addnewuser" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <AddNewUser refreshUI={refreshUI} onAuthFailure={onAuthFailure} {...props} /> </div>} />}
                  {adminRole && selectedUser && <Route exact path="/edituser" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <EditUser refreshUI={refreshUI} onAuthFailure={onAuthFailure} selectedUser={selectedUser} {...props} /> </div>} />}

                  <Route exact path="/not-found" component={NotFound} />
                  {<Route exact path="/index.html" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <Warehouses refreshUI={refreshUI} onAuthFailure={onAuthFailure} adminRole={adminRole} warehouseRole={warehouseRole} setSelectedWarehouse={setSelectedWarehouse} {...props} /> </div>} />}
                  {/* <Route exact path="/index.html" render={(props) => <div className={clsx(drawerOpen ? classes.open : classes.close, dir === 'rtl' ? classes.right : classes.left)}> <Users refreshUI={refreshUI} onAuthFailure={onAuthFailure} setSelectedUser={setSelectedUser} {...props} /> </div>} /> */}
                  <Route render={() => <Redirect to="/not-found" />} />
                </Switch>
              </BrowserRouter>
            }

            {
              authSuccess && createBusinessCard && <BusinessCard onAuthFailure={onAuthFailure} closeBusinessCard={closeBusinessCard} businessCardStep={businessCardStep} />
            }

          </div>
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={showNotification} autoHideDuration={60000} >
            <Alert onClose={handleNotificationClose} severity="info">
              <AlertTitle>Mentor calling</AlertTitle>
              {/* <strong>check it out!</strong> {notificationMessage} */}
              <Button onClick={takeMentorCall}>Attend video call with Mentor</Button>
            </Alert>
          </Snackbar>
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={showSalesVideoCallNotification} autoHideDuration={60000} >
            <Alert onClose={handleNotificationClose} severity="info">
              <AlertTitle>Exhibitor Video call!!</AlertTitle>
              {/* <strong>check it out!</strong> {notificationMessage} */}
              <Button onClick={takeExhibitorVideoCall}>Join video call with {salesPersonCallingName}</Button>
            </Alert>
          </Snackbar>

        </main>
      </FullScreen>
      {/* <Fab style={{ position: 'absolute', top: '50%', right: 10 }} color="primary" aria-label="add">
        <AddIcon />
      </Fab> */}


    </React.Fragment >
  );
}

export default App;
