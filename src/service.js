import axios from 'axios';


class Service {


    getNameSpaceID(token) {
        return axios({
            method:'post',
            url:'https://api.dropboxapi.com/2/users/get_current_account',
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(response => response.data)
            .catch(error => console.log('error trying to get namespace ID   ', error))
    }

    getFiles(namespaceID, token){
        return axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/files/list_folder',
            headers: {Authorization: `Bearer ${token}`},
            data: {'path': `ns:${namespaceID}`}
        })
            .then(response => response.data)
            .catch(error => console.log('error trying to get file:  ', error))
    }

    getOneFolder(namespaceID, token, folderName){
        return axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/files/list_folder',
            headers: {Authorization: `Bearer ${token}`},
            data: {'path': `ns:${namespaceID}/${folderName}/`}
        })
            .then(response => response.data.entries)
            .catch(error => console.log('error message, trying to get folder:  ', error))
    }


    getTemporaryLink(token, file) {
        return axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/files/get_temporary_link',
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
            data: {"path": `${file}`}

        })
            .then(response => response.data.link)
            .catch(error => console.log('error message, trying to get temporary link: ',error))
    }

}

export default new Service();

