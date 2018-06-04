import React, {Fragment as F} from 'react';
import Service from '../service'
import {Dropbox} from "dropbox";


export default class Files extends React.Component {

    token = this.props.token;   //vår apps accesstoken från login
    namespace;                  //"id på clientens konto"
    state =
        {
            userName: '',
            filesExists: false, //är true när den initiella fetchen är klar och det finns något att rendera
            files: [],          //den aktuella mappen(file) som renderas just nu
            home: [],           //roten av clientens mappstruktur
            navigate: [],        //breadcrumbhantering
            starredItems: []
        }


    componentDidMount() {   //när sidan laddats

        Service.getNameSpaceID(this.token)          //skickar med vår token till services för att få användar id sendan..
            .then(response => {

                this.namespace = response.root_info.root_namespace_id
                this.setState({
                    userName: response.name.display_name
                })

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
            files: this.state.home,
            navigate: []
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

    // TODO: spara i localstorage
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

    removeStar = (i) => {        //removes starred items when clicked, TODO: ta bort från localstorage också
        return () => {
            this.state.starredItems.splice(i, 1)
            this.setState({
                starredItems: this.state.starredItems
            })
        }
    }

    onDownload = (file) => {
        return () => {
            Service.getTemporaryLink(this.token, file.path_lower)
                .then(data => {
                    const a = document.createElement('a');
                    a.setAttribute('href', data);
                    a.setAttribute('download', `${data.name}`);
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
        }
    }

    onUpload = () => {
        return () => {

            const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
            let dbx = new Dropbox({accessToken: this.token})
            const fileInput = document.getElementById('file-upload');

            const file = fileInput.files[0];

            if (file.size < UPLOAD_FILE_SIZE_LIMIT) {
                dbx.filesUpload({path: '/' + file.name, contents: file})
                    .then(response => {
                            this.setState({
                                files: [...this.state.files, response]
                            })
                        }
                    )
            } else {
                console.log('File too large, max-size 150mb')
            }
        }


    }

    renderFile(file, i) {               // göra detta till enskild komponent? <File file={file}/> och <Folder folder={folder}/>
        if (file['.tag'] === 'folder') {
            return (
                <li key={i}><p className="fas fa-folder"> </p><a

                    onClick={this.getFolder(file)}>{file.name}</a> <a
                    onClick={this.starClick(i)} className="far fa-star"> </a>
                </li>
            )
        } else {
            return (
                <li key={i}>{file.name}
                    <span><a onClick={this.starClick(i)} className="far fa-star"> </a>
                                              <a id='shared-link' onClick={this.onDownload(file)}
                                                 className="far fa-arrow-alt-circle-down"> </a>
                                              <a className="fas fa-info-circle"><p
                                                  className="fileMetadata">{`Size: ${file.size} Last modified: ${file.client_modified}`}</p></a>
                                            </span>

                </li>
            )
        }
    }

    render() {
        return (
            <F>
                <h3>{`Logged in user: ${this.state.userName}`}</h3>

                <input type='file' id='file-upload'/>
                <button onClick={this.onUpload()}>Upload File</button>


                <div className='mainContainer'>

                    <div className='crumb-wrapper'>
                        <div className='home fas fa-home' onClick={this.goHome}> </div>
                        <div className='breadcrumbs'>
                            {this.state.navigate.map((crumb, i) =>
                                <a key={i} onClick={this.navigate(crumb, i)}> {crumb.name} </a>)} </div>
                    </div>


                    {this.state.filesExists
                        ?
                        <div className='mainContent'>

                            <ul className='fileGrid'>
                                {this.state.files.map((file, i) => this.renderFile(file, i))}
                            </ul>
                        </div>
                        :
                        <div>Loading files</div>
                    }
                    <div className='sidebar'>
                        <h2>Favourites:</h2>
                        <ul>
                            {this.state.starredItems.map((item, i) =>
                                <li key={i}>{item.name} <a onClick={this.removeStar(i)} className="fas fa-times"> </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </F>
        )
    }
}




