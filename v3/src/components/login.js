import React from   'react';
import {Fragment as F} from 'react';
import {Dropbox} from 'dropbox';


export default class Login extends React.Component{

    // dbx = new Dropbox({ accessToken: 'KNeTyKvgwzAAAAAAAAAA2Ip29UxARWYwxU-_E1De_NaUp0ZPiTizRbEuQip6OX9o' });

    renderItems = (items) => {
        console.log(items)
        var filesContainer = document.getElementById('files');
        items.forEach(function(item) {
            var li = document.createElement('li');
            li.innerHTML = item.name;
            filesContainer.appendChild(li);
        });
    }

    //access_token = 'KNeTyKvgwzAAAAAAAAAA2Ip29UxARWYwxU-_E1De_NaUp0ZPiTizRbEuQip6OX9o';

    getAccessTokenFromUrl = () => {

        return 'KNeTyKvgwzAAAAAAAAAA2Ip29UxARWYwxU-_E1De_NaUp0ZPiTizRbEuQip6OX9o';
    }

    onClickHandler = () => {
        const that = this;
       let dbx = new Dropbox({ accessToken: this.getAccessTokenFromUrl() })
        console.log('körs')
        dbx.filesListFolder({path: ''})
            .then(function(response) {
                console.log(that)
                that.renderItems(response.entries);
            })
            .catch(function(error) {
                console.error(error);
            });
    }

    clickHandler = () => {
        this.onClickHandler()
        console.log('körs detta')
    }


    // componentDidMount(){
    //     if(isAuthenticated()) {
    //
    //     } else {
    //
    //     }
    // }

    render() {
        return (
            <F>
                <input

                placeholder='username'
                />
                <input
                placeholder='password'
                />
                <button onClick={this.clickHandler} >  CLICK to authenticate</button>
            </F>
        )
    }
}

