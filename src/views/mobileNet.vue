<template>
  <div class="wrapper">
    <div class="uploadArea">
      <a-upload
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :file-list="fileList"
        :before-upload="beforeUpload"
        @change="handleChange"
        accept="image/*"
      >
        <img v-if="imageUrl" id="img" :src="imageUrl" alt="avatar" />
        <div v-else>
          <a-icon type="plus" />
          <div class="ant-upload-text">识别图片</div>
        </div>
      </a-upload>
    </div>

    <div class="readText">
      <div class="textItem" v-for="item in predictions">
        <span class="probability"
          >{{ Math.round(item.probability * 100) }}%</span
        >
        <div class="classList">
          <a-tag class="name" v-for="name in item.className.split(',')">{{
            name
          }}</a-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const mobilenet = require("@tensorflow-models/mobilenet");

export default {
  data() {
    return {
      fileList: [],
      imageUrl: "",

      predictions: [],
      model: null,
      reading: false,
    };
  },
  watch: {},
  async created() {
    document.title = "tfjs模型-mobileNet";

    this.$message.loading("加载模型...", 20);
    this.model = await mobilenet.load({
      version: 2,
      modelUrl: 'https://lanniu-view.oss-cn-hangzhou.aliyuncs.com/actionRecognition/mobilenet/classification/model.json?tfjs-format=file'
    });

    this.$message.destroy();
  },
  methods: {
    async readImg() {
      if (this.reading) return;
      this.reading = true;
      this.$message.loading("识别中...", 20);

      const img = document.getElementById("img");
      this.predictions = await this.model.classify(img);

      this.reading = false;
      this.$message.destroy();
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    async beforeUpload(fileList) {},

    async handleChange(info) {
      this.imageUrl = await this.getBase64(info.file.originFileObj);
      this.fileList = [info.file];

      this.$nextTick(() => {
        this.readImg();
      });
    },
  },
};
</script>
<style scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  padding-top: 1px;
  box-sizing: border-box;
}

.probability {
  color: #3eaf7c;
  margin-right: 10px;
}

.textItem {
  display: flex;
  margin-bottom: 10px;
}

.name {
  margin-bottom: 10px;
}

.readText {
  text-align: right;
  margin: 0 auto 0;
  display: inline-block;
  max-width: 300px;
}

.classList {
  display: flex;
  flex-wrap: wrap;
}

.className {
  padding: 8px;
  border: 1px solid #000;
}

.uploadArea {
  width: 200px;
  height: 200px;
  margin: 80px auto 40px;
}

img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}
</style>
