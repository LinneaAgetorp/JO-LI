import React, {Fragment as F} from   'react';
import {Dropbox} from 'dropbox';
import utils from '../utils';
import Files from './files';


export default class Login extends React.Component{
    //client id är app key fron dropbox-appen
     CLIENT_ID = 'hamdg2o7t6tygwy'

//renderItems ska utföras i FILES-filen
    renderItems = (items) => {
        console.log(items)
        // const filesContainer = document.getElementById('files');
        // items.forEach(function(item) {
        //     const li = document.createElement('li');
        //     li.innerHTML = item.name;
        //     filesContainer.appendChild(li);
        // });
    }






    //detta ska vara en action,
    onClickHandler = () => {
        const that = this;
       let dbx = new Dropbox({
           accessToken: this.getAccessTokenFromUrl(),
           clientId: this.CLIENT_ID
       })



        //var dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID });????
            let authUrl = dbx.getAuthenticationUrl('http://localhost:3000/auth');
            document.getElementById('authlink').href = authUrl;


        dbx.filesListFolder({path: ''})
            .then(function(response) {
                console.log(that)

                that.renderItems(response.entries);
            })
            .catch(function(error) {
                console.error(error);
            });
    }

    getAccessTokenFromUrl = () => {
       return utils.parseQueryString(window.location.hash).accessToken;
        // return 'KNeTyKvgwzAAAAAAAAAA2Ip29UxARWYwxU-_E1De_NaUp0ZPiTizRbEuQip6OX9o'; -> genväg-access-token från appen
    }

    isAuthenticated = () => {
        return !!this.getAccessTokenFromUrl //gör funktionen till boolean, finns värde? -> return true
    }



    // componentDidMount(){
    //     if(isAuthenticated()) {
    //var dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID });
    //     var authUrl = dbx.getAuthenticationUrl('http://localhost:8080/auth');
    //     document.getElementById('authlink').href = authUrl;

    //     } else {
    //

    //     }
    // }

    render() {
        return (
            this.isAuthenticated()
            ?
            <F>
                <button>Log Out</button>
                <p>
                    Inloggad!
                </p>
                <Files/>
            </F>
            :
            <F>

                <button onClick={this.onClickHandler} >  CLICK to authenticate</button>
            </F>
        )
    }
}

