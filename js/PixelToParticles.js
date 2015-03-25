/**
 * Created by MojoManyana on 25.3.2015.
 */

window.URL =
    window.URL ||
    window.webkitURL ||
    window.mozURL ||
    window.msURL;

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

var PixelToParticles = function() {

}

PixelToParticles.prototype.video;
PixelToParticles.prototype.canvas;
PixelToParticles.prototype.context2d;
PixelToParticles.prototype.tmpCanvas;
PixelToParticles.prototype.tmpContext2d;
PixelToParticles.prototype.width;
PixelToParticles.prototype.height;
PixelToParticles.prototype.particleRadius;

PixelToParticles.prototype.startProcessing = function (canvas, tmpCanvas, particleRadius) {
    this.video = document.createElement("video");
    this.video.width = canvas.width;
    this.video.height = canvas.height;
    this.width = canvas.width;
    this.height = canvas.height;
    this.canvas = canvas;
    this.context2d = this.canvas.getContext("2d");
    this.tmpCanvas = tmpCanvas;
    this.tmpCanvas.width = tmpCanvas.width;
    this.tmpCanvas.height = tmpCanvas.height;
    this.tmpContext2d = this.tmpCanvas.getContext("2d");
    this.particleRadius = particleRadius;

    var self = this;

    this.video.addEventListener("play", function() {
        self.timerCallback();
    }, false);

    navigator.getUserMedia(
        {
            video: true,
            audio: false
        },
        function (stream) {
            self.video.src = URL.createObjectURL(stream);
            self.video.play();
        },
        function (error) {
            alert(JSON.stringify(error, null, '\t'));
        });
};

PixelToParticles.prototype.timerCallback = function() {
    if (this.video.paused || this.video.ended) {
        return;
    }
    this.computeFrame();
    var self = this;
    setTimeout(function () {
        self.timerCallback();
    }, 10);
};

PixelToParticles.prototype.computeFrame = function() {
    this.tmpContext2d.drawImage(this.video, 0, 0, this.width, this.height);
    var frame = this.tmpContext2d.getImageData(0, 0, this.width, this.height);
    this.applyEffect(frame);
    return;
};

PixelToParticles.prototype.applyEffect = function (frame){

    var w = this.width;
    var h = this.height;
    var d = new Array(h / this.particleRadius*2);

    // Loop all pixels skipping the particleRadius interval
    for (var y = 0; y < h; y += this.particleRadius*2) {
        d[y] = new Array(w / this.particleRadius*2);
        for (var x = 0; x < w ; x += this.particleRadius*2) {
            var pixelBasePosition = x * 4 + y * w * 4;
            d[y][x] = {
                r : frame.data[pixelBasePosition],
                g : frame.data[pixelBasePosition + 1],
                b : frame.data[pixelBasePosition + 2]
            };
        }
    }

       // Now create image from pixels
    for (var y = 0; y < h; y += this.particleRadius*2) {
        for (var x = 0; x < w ; x += this.particleRadius*2) {
            var color = this.rgbToHex(d[y][x].r, d[y][x].g, d[y][x].b);

            this.context2d.beginPath();
            this.context2d.arc(x - this.particleRadius, y - this.particleRadius, this.particleRadius, 0, 2 * Math.PI, false);
            this.context2d.fillStyle = color;
            this.context2d.fill();
            //this.context2d.lineWidth = 2;
            //this.context2d.strokeStyle = '#aa3355';
            //this.context2d.stroke();
        }
    }

    //this.context2d.putImageData(frame, 0, 0);
};


PixelToParticles.prototype.rgbToHex = function(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};




