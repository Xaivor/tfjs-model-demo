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
    <video id="video" :width="videoWidth" :height="videoHeight"></video>
  </div>
</template>

<script>
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import { drawKeypoints, drawSkevaron } from "../utils/draw";
import { getUserMedia } from "../utils/tool";

export default {
  data() {
    return {
      detector: null,
      ctx: null,
      video: null,

      fingleLine: [
        [0, 1, 2, 3, 4],
        [0, 5, 6, 7, 8],
        [0, 17, 18, 19, 20],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
        [5, 9, 13, 17],
      ],

      videoWidth: 600,
      videoHeight: 600,
      scale: 2,

      timer: null,
      fps: 60,
    };
  },
  created() {
    document.title = "tfjs模型-poseNet";
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

      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detector = await handPoseDetection.createDetector(model, {
        runtime: "tfjs",
        detectorModelUrl:
          "https://lanniu-view.oss-cn-hangzhou.aliyuncs.com/actionRecognition/handpose_3d/detector/full/model.json?tfjs-format=file",
        landmarkModelUrl:
          "https://lanniu-view.oss-cn-hangzhou.aliyuncs.com/actionRecognition/handpose_3d/landmark/full/model.json?tfjs-format=file",
      });
      this.detector = detector;
      console.log("detector", detector);

      this.$message.destroy();
      return true;
    },

    startRead() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.readHand();
      }, 1000 / this.fps);
    },

    async readHand() {
      this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
      this.ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);

      const hands = await this.detector.estimateHands(this.video, {
        flipHorizontal: false,
      });

      // 渲染多双手
      hands.forEach((hand) => {
        if (hand.keypoints.length > 0) {
          drawSkevaron({
            keypoints: hand.keypoints,
            lineArr: this.fingleLine,
            ctx: this.ctx,
          });

          drawKeypoints({
            keypoints: hand.keypoints,
            ctx: this.ctx,
          });
        }
      });
    },
  },
};
</script>
<style scoped>
#canvas,
#video {
  position: absolute;
  width: 250px;
  height: 250px;
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
