import React, {Fragment as F} from 'react';
import Service from '../service'
// import {Dropbox} from "dropbox/src/index";// ---> skapa egen fil för dropbox, som andra komponenter kan använda sig av istället


export default class Files extends React.Component {

    token = this.props.token;   //vår apps accesstoken från login
    namespace;                  //"id på clientens konto"
    state =
        {
            filesExists: false, //är true när den initiella fetchen är klar och det finns något att rendera
            files: [],          //den aktuella mappen(file) som renderas just nu
            home: [],           //rooten av clientens mappstruktur
            navigate: [],        //breadcrumbhantering
            starredItems: []
        }




    componentDidMount() {   //när sidan laddats

        Service.getNameSpaceID(this.token)          //skickar med vår token till services för att få användar id sendan..
            .then(response => {
                console.log('res', response)
                this.namespace = response
                Service.getFiles(this.namespace, this.token)    //vidare till getFiles() där vi får användarens filer
                    .then(response => {

                        this.setState(                              //när vi fått svar renderas filerna på sidan.
                            {
                                filesExists: true,
                                files: response.entries,
                                home: response.entries
                            }
                        )

                    })
            })


    }


    getFolder = (file) => { // Gör ett nytt fetchanrop till mappen(file) clienten klickade på
        return () => { //funktionen anropas direkt vid rendering, skapa en till inuti som kan anropas vid klick

            Service.getOneFolder(this.namespace, this.token, file.path_lower)
                .then(response => {
                    this.setState({
                        files: response,
                        navigate: [...this.state.navigate, file, {response}] //response består av den klickade mappens innehåll. Spara ner inför breadcrumbs-klick
                    })
                })
        }
    }

    goHome = () => {        //går tillbaka till roten av clientens mappstruktur
        this.setState({
            files: this.state.home
        })
    }

    navigate = (crumb, i) => { // styr breadcrumbs
        return () => { // navigate-funktionen anropas direkt vid rendering, skapa en till inuti som kan anropas vid klick
            this.state.navigate.splice((i + 2)) //plockar ut början av listan, fram till klicket(sätts in nedan). +2 pga: response[] mellan varje folder{}
            this.setState({
                files: this.state.navigate[i + 1].response, //nytt state: den klickade mappens innehåll läggs i files (i+1 = mappens INNEHÅLL istället för bara mappens namn)
                navigate: this.state.navigate               // listan med vad som blir kvar efter splice, det som är före breadcrumben vi klickade på
            })
        }
    }


    starClick = (i) => {
        return () => {
            if (!this.state.starredItems.includes(this.state.files[i])) {
                this.setState({
                    starredItems: [...this.state.starredItems, this.state.files[i]]
                })
            } else {
                return null
            }
        }
    }

    removeStar = (i) => {        //removes starred items when clicked
        return () => {
            this.state.starredItems.splice(i, 1)
            this.setState({
                starredItems: this.state.starredItems
            })
        }
    }

    onDownload = (file) => {

        return () => {
            Service.downloadFile(file.id, this.token)
                .then(response => {
                    console.log(response, 'path', file)

                    const a = document.createElement('a');
                    a.setAttribute('href', `${file.path_lower}`);
                    a.setAttribute('download', `${file.name}`);
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
        }
    }

    render() {
        return (
            <div className='mainContainer'>
                <div className='crumbs'>{this.state.navigate.map((crumb, i) => <a key={i}
                                                               onClick={this.navigate(crumb, i)}>/ {crumb.name} </a>)} </div>

                {this.state.filesExists
                    ?
                    <div className='mainContent'>
                        <a onClick={this.goHome}> HOME</a>

                        <ul>
                            {this.state.files.map((file, i) =>
                                (file['.tag'] === 'folder')
                                    ?
                                    <li key={i}><a
                                        onClick={this.getFolder(file)}>Folder: {file.name}</a> <a
                                        onClick={this.starClick(i)}>STAR</a></li>
                                    :

                                    <li key={i}>{`Name: ${file.name} Size: ${file.size} Last modified: ${file.client_modified}`}
                                        <a onClick={this.starClick(i)}>STAR</a> <a onClick={this.onDownload(file)}>DOWNLOAD</a></li>
                            )}
                        </ul>
                    </div>
                    :
                    <div>fanns inga files</div>
                }
                <div className='sidebar'>
                    <h2>Favourites:</h2>
                    <ul>
                        {this.state.starredItems.map((item, i) =>
                            <li key={i}>{item.name} <a onClick={this.removeStar(i)}>REMOVE STAR</a></li>
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}




