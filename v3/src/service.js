import axios from 'axios';


class Service {


    getNameSpaceID(token) {
        console.log('WOOOP', token)
        return axios({
            method:'post',
            url:'https://api.dropboxapi.com/2/users/get_current_account',
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(response => response.data.root_info.root_namespace_id)
            .catch(error => console.log('error i service: (wifi?)   ', error))
    }

    getFiles(namespaceID, token){
        return axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/files/list_folder',
            headers: {Authorization: `Bearer ${token}`},
            data: {'path': `ns:${namespaceID}`}
        })
            .then(response => response.data)
            .catch(error => console.log('error i service2:  ', error))
    }

    getOneFolder(namespaceID, token, folderName){
        console.log('foldername', folderName)
        return axios({
            method: 'post',
            url: 'https://api.dropboxapi.com/2/files/list_folder',
            headers: {Authorization: `Bearer ${token}`},
            data: {'path': `ns:${namespaceID}/${folderName}/`}
        })
            .then(response => response.data.entries)
            .catch(error => console.log('error i service2:  ', error))
    }


    downloadFile(fileName, token){
        console.log('download      :   ', fileName, token)
        return axios({
            method: 'post',
            url: 'https://content.dropboxapi.com/2/files/download',
            headers: {Authorization: `Bearer ${token}`, 'Dropbox-API-Arg': JSON.stringify({'path': `${fileName}`})}

        })
            .then(response => response)
            .catch(error => console.log('error i download :  ', error))
    }
}

export default new Service();

