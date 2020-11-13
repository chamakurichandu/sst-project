import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import TwilioApp from './TwilioApp';
import { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import '../types';
import { VideoProvider } from './components/VideoProvider';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

interface VideoAppProps {
    caption: string,
    roomName: string,
    closeVideoApp: () => void;
}

export default function VideoApp({ caption, roomName, closeVideoApp }: VideoAppProps) {
    const { error, setError } = useAppState();
    const connectionOptions = useConnectionOptions();

    console.log("caption: ", caption);
    console.log("roomName: ", roomName);

    return (
        <MuiThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <PrivateRoute exact path="/">
                        <UnsupportedBrowserWarning>
                            <VideoProvider options={connectionOptions} onError={setError}>
                                <ErrorDialog dismissError={() => setError(null)} error={error} />
                                <TwilioApp closeVideoApp={closeVideoApp} caption={caption} roomName={roomName} />
                            </VideoProvider>
                        </UnsupportedBrowserWarning>
                    </PrivateRoute>
                    {/* <PrivateRoute path="/room/:URLRoomName">
                        <UnsupportedBrowserWarning>
                            <VideoProvider options={connectionOptions} onError={setError}>
                                <ErrorDialog dismissError={() => setError(null)} error={error} />
                                <TwilioApp />
                            </VideoProvider>
                        </UnsupportedBrowserWarning>
                    </PrivateRoute> */}
                    {/* <Route path="/login">
                        <LoginPage />
                    </Route> */}
                    <Redirect to="/" />
                </Switch>
            </Router>
        </MuiThemeProvider>
    );
};
