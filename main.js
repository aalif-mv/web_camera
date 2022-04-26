class Camera {
    static width = 320;
    static height = 0;

    static streaming = false;

    static video = null;
    static canvas = null;
    static photo = null;
    static startbutton = null;

    static tracks = null;

    static showViewLiveResultButton() {
        if (window.self !== window.top) {
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener('click', () => window.open(location.href));
        return true;
        }
        return false;
    }

    static startup() {
        if (this.showViewLiveResultButton()) { return; }
        this.video = document.getElementById('video');
        this.canvas = document.createElement('canvas');
        this.photo = document.getElementById('photo');
        this.startbutton = document.getElementById('startbutton');

        navigator.permissions.query({name: 'camera'})
        .then((permissionObj) => {
            console.log(permissionObj.state);
        })
        .catch((error) => {
            console.log('Got error :', error);
        })

        navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function(stream) {
            Camera.video.srcObject = stream;
            Camera.tracks = stream.getTracks()[0];
            Camera.video.play();
        })
        .catch(function(err) {
        console.log("An error occurred: " + err);
        alert(err);
        });

        video.addEventListener('canplay', function(ev){
        if (! Camera.streaming) {
            Camera.height = Camera.video.videoHeight / (Camera.video.videoWidth/Camera.width);
        
            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.
        
            if (isNaN(Camera.height)) {
            Camera.height = Camera.width / (4/3);
            }
        
            Camera.video.setAttribute('width', Camera.width);
            Camera.video.setAttribute('height', Camera.height);
            Camera.canvas.setAttribute('width', Camera.width);
            Camera.canvas.setAttribute('height', Camera.height);
            Camera.streaming = true;
        }
        }, false);

        startbutton.addEventListener('click', function(ev){
            Camera.takepicture();
            ev.preventDefault();
        }, false);
        
        this.clearphoto();
    }

    static clearphoto() {
        var ctx = this.canvas.getContext('2d');
        ctx.fillStyle = "#AAA";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        var data = this.canvas.toDataURL('image/png');
        this.photo.setAttribute('src', data);
    }

    static takepicture() {
        var context = this.canvas.getContext('2d');
        if (this.width && this.height) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            context.drawImage(this.video, 0, 0, this.width, this.height);
            
            var data = this.canvas.toDataURL('image/png');
            this.photo.setAttribute('src', data);
        } else {
            this.clearphoto();
        }
    }

    static stopCam() {
        this.tracks.stop();
    }
}


// /////////
Camera.startup()