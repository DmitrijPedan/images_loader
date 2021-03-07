import firebase from "firebase/app";
import 'firebase/storage'
import {upload} from "./src/scripts/upload";

const firebaseConfig = {
    apiKey: "AIzaSyA0ieYzeMJuqysZ3OYTXECGIcEsofrHRZQ",
    authDomain: "imageloader-e9250.firebaseapp.com",
    projectId: "imageloader-e9250",
    storageBucket: "imageloader-e9250.appspot.com",
    messagingSenderId: "731648251045",
    appId: "1:731648251045:web:5ef6294214c399e5c5e94c"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#fileInput', {
    multiSelect: true,
    fileTypes: ['.jpg', '.jpeg', '.png'],
    onUpload (files, infoBlocks) {
        files.forEach((file, i) => {
            const ref = storage.ref(`/images/${file.name}`);
            const task = ref.put(file);
            task.on('state_changed',
                snapshot => {
                    const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
                    infoBlocks[i].querySelector('.progress').style.width = percentage;
                },
                error => {
                    console.log(error);
                },
                () => {
                    infoBlocks[i].querySelector('.progress').textContent = '100%';
                    document.getElementById('uploadBtn').setAttribute('disabled', 'disabled');
                    task.snapshot.ref.getDownloadURL().then(url => {
                        console.log(url)
                    })
                })
        })
    }
});
