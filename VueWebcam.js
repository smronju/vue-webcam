// TODO:
// 1. Enable mirror option
// 2. Improve options handling
// 3. Error handling

const Vue = require('vue').default;

const WebcamComponent = Vue.extend({
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
  data() {
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

  mounted() {
    this.video = this.$refs.video;
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;

    // new api for video and audio called navigator.mediadevices
    // for new browsers video can directly consume MediaStream using srcObject
    //
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          this.video = this.$refs.video; // reInitializing as it doesn't work sometime.
          this.video.srcObject = stream;
          this.stream = stream;
          this.hasUserMedia = true;
        })
        .catch(error => {
          console.log(error);
        });
    } else if (navigator.getUserMedia) {
      // if new api not there, use the old one
      navigator.getUserMedia(
        { video: true },
        stream => {
          this.video = this.$refs.video;
          // below line won't work on new browser because of this
          // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL#Using_object_URLs_for_media_streams
          // this.src = window.URL.createObjectURL(stream);
          this.video.srcObject = stream;
          this.stream = stream;
          this.hasUserMedia = true;
        },
        error => {
          console.log(error);
        }
      );
    }
  },
  methods: {
    getPhoto() {
      if (!this.hasUserMedia) return null;

      const canvas = this.getCanvas();
      return canvas.toDataURL(this.screenshotFormat);
    },
    getCanvas() {
      if (!this.hasUserMedia) return null;

      const video = this.$refs.video;
      if (!this.ctx) {
        const canvas = document.createElement('canvas');
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
        this.canvas = canvas;

        this.ctx = canvas.getContext('2d');

        /*if (this.mirror) {
           const context = canvas.getContext('2d');
           context.translate(canvas.width, 0);
           context.scale(-1, 1);
           this.ctx = context;
           } else {
           this.ctx = canvas.getContext('2d');
           }*/
      }

      const { ctx, canvas } = this;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return canvas;
    }
  },

  beforeDestroy: function() {
    this.video.pause();
    this.src = '';
    this.stream &&
      this.stream.getTracks()[0] &&
      this.stream.getTracks()[0].stop();
  },

  destroyed: function() {
    console.log('Destroyed');
  },
  render: function(h) {
    return h('video', {
      ref: 'video',
      attrs: {
        width: this.width,
        height: this.height,
        src: this.src,
        autoplay: this.autoplay
      }
    });
  }
});

const VueWebcam = Vue.component('vue-webcam', WebcamComponent);
export default VueWebcam;
