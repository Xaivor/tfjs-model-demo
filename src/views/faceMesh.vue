<template>
  <div class="wrapper">
    <canvas
      id="canvas"
      :style="{
        height: videoHeight / scale + 'px',
        width: videoWidth / scale + 'px',
      }"
      :width="videoWidth"
      :height="videoHeight"
    ></canvas>

    <video
      :style="{
        height: videoHeight / scale + 'px',
        width: videoWidth / scale + 'px',
      }"
      id="video"
      :width="videoWidth"
      :height="videoHeight"
    ></video>
  </div>
</template>

<script>
import '@mediapipe/face_mesh';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

import { drawKeypoints, drawSkevaron } from "../utils/draw";
import { getUserMedia } from "../utils/tool";

export default {
  components: {},
  props: [],
  data() {
    return {
      detector: null,
      ctx: null,
      video: null,

      videoWidth: 600,
      videoHeight: 480,
      scale: 2,

      timer: null,
      fps: 60,
    };
  },
  created() {
    document.title = "tfjs模型-faceMesh";
  },
  destroyed() {
    this.timer && clearInterval(this.timer);
  },
  async mounted() {
    // 加载模型
    await this.loadModal();

    // 初始化对象
    this.init();
  },
  methods: {
    init() {
      let that = this;
      this.video = document.getElementById("video");
      this.ctx = document.getElementById("canvas").getContext("2d");

      getUserMedia(
        {
          video: { facingMode: "user" },
          audio: false,
        },
        (data) => {
          that.video.srcObject = data;
          that.video.play();

          that.video.addEventListener("canplay", function () {
            // 获取视频分辨率
            that.videoWidth = this.videoWidth
            that.videoHeight = this.videoHeight;

            that.startRead();
          });
        },
        (error) => {
          alert(error);
        }
      );
    },

    async loadModal() {
      this.$message.loading("加载模型...", 20);

      const detectorConfig = {
        runtime: 'tfjs',
      };

      const detector = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        detectorConfig
      );

      this.detector = detector;
      console.log("detector", detector);

      this.$message.destroy();
      return true;
    },

    startRead() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.readPose();
      }, 1000 / this.fps);
    },

    async readPose() {
      this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
      this.ctx.drawImage(
        this.video,
        0,
        0,
        this.videoWidth,
        this.videoHeight
      );

      const faces = await this.detector.estimateFaces(this.video);

      console.log('faces', faces)

      // 渲染关键点
      // poses.forEach((pose) => {
      //   if (pose.keypoints.length > 0) {
      //     drawSkevaron({
      //       keypoints: pose.keypoints,
      //       lineArr: this.bodyLine,
      //       ctx: this.ctx,
      //     });

      //     drawKeypoints({
      //       keypoints: pose.keypoints,
      //       ctx: this.ctx,
      //     });
      //   }
      // });
    },
  },
};
</script>
<style scoped>
#canvas,
#video {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#video {
  opacity: 0;
}

#canvas {
  z-index: 9;
}
</style>
