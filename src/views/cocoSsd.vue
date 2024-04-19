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
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { drawKeypoints, drawSkevaron, drawCenterText } from "../utils/draw";
import { getUserMedia } from "../utils/tool";

export default {
  data() {
    return {
      model: null,
      ctx: null,
      video: null,

      videoWidth: 600,
      videoHeight: 600,
      scale: 1.5,

      timer: null,
      fps: 60,
    };
  },
  created() {
    document.title = "tfjs模型-cocoSsd";
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
            that.videoWidth = this.videoWidth;
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

      this.model = await cocoSsd.load();
      console.log("model", this.model);

      this.$message.destroy();
      return true;
    },

    startRead() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.read();
      }, 1000 / this.fps);
    },

    async read() {
      this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight);
      this.ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);

      const boxes = await this.model.detect(this.video);

      // 渲染
      boxes.forEach((box) => {
        let keypoints = [
            {
              x: box.bbox[0],
              y: box.bbox[1],
            },
            {
              x: box.bbox[0] + box.bbox[2],
              y: box.bbox[1],
            },
            {
              x: box.bbox[0] + box.bbox[2],
              y: box.bbox[1] + box.bbox[3],
            },
            {
              x: box.bbox[0],
              y: box.bbox[1] + box.bbox[3],
            },
          ],
          lineArr = [[0, 1, 2, 3, 0]];

        drawSkevaron({
          keypoints,
          lineArr,
          ctx: this.ctx,
        });

        drawKeypoints({
          keypoints,
          ctx: this.ctx,
        });

        // 识别文字
        const fontSize = box.bbox[2] + box.bbox[3];
        drawCenterText({
          textStyle: {
            font: `${0.08 * fontSize}px 微软雅黑`,
            color: "#00ff66",
          },
          position: {
            x: box.bbox[0] + 0.5 * box.bbox[2],
            y: box.bbox[1] + 0.5 * box.bbox[3],
          },
          text: box.class,
          ctx: this.ctx,
        });
      });
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
