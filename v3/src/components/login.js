import React, {Fragment as F} from 'react';
import {Dropbox} from 'dropbox';
import {parseQueryString} from '../utils';

import Files from './files';


// note to self:
//client id är app key fron dropbox-appen


const CLIENT_ID = 'hamdg2o7t6tygwy'

const dbx = new Dropbox({clientId: CLIENT_ID});

export default class Login extends React.Component {
    state = {
        authenticated: false,
        token: ''
    }

    getAccessTokenFromUrl = () => {
        const token = parseQueryString(window.location.hash).access_token;
        console.log(token)
        return token
    }

    isAuthenticated = () => {
        return !!this.getAccessTokenFromUrl() // !! gör funktionen till boolean, finns värde, -> return true
    }

    componentDidMount() {
        const token = localStorage.getItem('accessToken'); // börja med att se om token finns i LS
        if (token) {
            this.setState({
                authenticated: true,
                token
            })
        } else if (this.isAuthenticated()) { //har påbörjat login, token finns i URL men vi har inte sparat ner den ännu

            const token = this.getAccessTokenFromUrl();
            localStorage.setItem('accessToken', token) //sparar token i LS + i state
            console.log('token',token)
            this.setState({
                authenticated: true,
                token
            })


        } else {
            // Require the user to login => show Login button.
            //
            // If we reach this code block, something is wrong!
            // console.log('om detta körs gick något fel i Login-component vid inloggningsförsök')
        }
    }

    logoutBtn = () => {
        localStorage.removeItem('accessToken') // tar bort token från LS och återställer state
        this.setState({
            authenticated: false,
            token: ""
        });
        window.location.href= 'http://localhost:3000' // tillbaka till "start-url"
    }

    render() {

        const {
            authenticated
        } = this.state;

        let authUrl;
        if (!authenticated) {
            authUrl = dbx.getAuthenticationUrl('http://localhost:3000');
        }


        return (
            <div>
                {
                    !authenticated
                        ?
                        <F>
                            <h1 className="App-title">Welcome!</h1><h1  className="App-title-2" > Sign in to access your files at DropboxInterface joli<span className="App-title-end">(e)</span></h1>
                            <a className='auth' href={authUrl}>Authenticate</a>
                        </F>
                        : (
                            <F>
                                <div className='topHeader'>
                                    <h1 className="App-title-main">DropboxInterface joli<span className="App-title-end">(e)</span></h1>
                                    <button className='logOutBtn' onClick={this.logoutBtn}>Log Out</button>
                                </div>
                                <Files token={this.state.token}/>
                            </F>
                        )
                }
            </div>
        )
    }

}



