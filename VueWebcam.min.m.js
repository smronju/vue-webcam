import Vue from 'vue';

var WebcamComponent = Vue.extend({
    render: function (h) {
        return h('video', {
            ref: 'video',
            attrs: {
                width: this.width,
                height: this.height,
                src: this.src,
                autoplay: this.autoplay
            }
        });
    },
    props: {
        autoplay: {
            type: Boolean,
            default: true
        },
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 300
        },
        mirror: {
            type: Boolean,
            default: true
        },
        screenshotFormat: {
            type: String,
            default: 'image/jpeg'
        }
    },
    data: function data() {
        return {
            video: '',
            src: '',
            stream: '',
            hasUserMedia: false,
            styleObject: {
                transform: 'scale(-1, 1)',
                filter: 'FlipH'
            }
        };
    },
    methods: {
        getPhoto: function getPhoto() {
            if (!this.hasUserMedia) 
                { return null; }
            var canvas = this.getCanvas();
            return canvas.toDataURL(this.screenshotFormat);
        },
        getCanvas: function getCanvas() {
            if (!this.hasUserMedia) 
                { return null; }
            var video = this.$refs.video;
            if (!this.ctx) {
                var canvas$1 = document.createElement('canvas');
                canvas$1.height = video.clientHeight;
                canvas$1.width = video.clientWidth;
                this.canvas = canvas$1;
                this.ctx = canvas$1.getContext('2d');
            }
            var ref = this;
            var ctx = ref.ctx;
            var canvas = ref.canvas;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas;
        }
    },
    mounted: function () {
        var this$1 = this;

        this.video = this.$refs.video;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true
            }, function (stream) {
                this$1.src = window.URL.createObjectURL(stream);
                this$1.stream = stream;
                this$1.hasUserMedia = true;
            }, function (error) {
                console.log(error);
            });
        }
    },
    beforeDestroy: function () {
        this.video.pause();
        this.src = '';
        this.stream.getTracks()[0].stop();
    },
    destroyed: function () {
        console.log('Destroyed');
    }
});
var VueWebcam = Vue.component('vue-webcam', WebcamComponent);

export default VueWebcam;
//# sourceMappingURL=VueWebcam.min.m.js.map
