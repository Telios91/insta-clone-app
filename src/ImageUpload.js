import React,  {useState} from 'react'
import { Button } from '@material-ui/core'
import { firebase, storage, db } from "./firebase"
import './ImageUpload.css'

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    // const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState ('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image)
      
      uploadTask.on(
          "state_changed",
          (snapshot) => {
              // progress bar function ...
              const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              ); 
              setProgress(progress);
          },
          (error) => {
              // error functiom ...
              console.log(error);
              alert(error.message)
          },
          () => {
              //complete function
              storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // post the image inside og the db
                    db.collection("+").add({
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      caption: caption,
                      imageUrl: url,
                      username: username
                    });

                    setProgress(0); // reset the user forms
                    setCaption(""); // reset the user forms
                    setImage(null); // reset the user forms

                })
          })
    }

    return (
        <div className="imageupload">
            <progress className="imageupload_progress"  value={progress} max="100" />
            <input type="text" placeholder='Enter a caption ...' onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload;
