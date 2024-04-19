# HandPose

![screenshot-20220715-093705](https://gitee.com/Xiavor/tfjs-model-demo/raw/master/md/screenshot-20220715-093705.png)

# 简介

handPose，可以用来识别手部的关键点。

并且可以识别多只手，每只手具有21个关键点。





# 基本使用

在项目中获取此模型主要有两种方法：

- script标签 引入js
- npm模块 导入import



## script引入

```HTML
<!-- Require the peer dependencies of hand-pose-detection. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter"></script>
<!-- You must explicitly require a TF.js backend if you're not using the TF.js union bundle. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"></script>
```





## npm导入

```Dockerfile
yarn add @tensorflow-models/hand-pose-detection
yarn add @tensorflow/tfjs-core, @tensorflow/tfjs-converter
yarn add @tensorflow/tfjs-backend-webgl
yarn add @mediapipe/hands
```



导入项目

```JavaScript
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
```



# API

## detector

创建一个detector。

目前`SupportedModels`支持的类型，只有`MediaPipeHands`形式

```JavaScript
const model = handPoseDetection.SupportedModels.MediaPipeHands;
const detectorConfig = {
  runtime: 'tfjs',
};
const detector = await handPoseDetection.createDetector(model, detectorConfig);
```

detectorConfig 的参数有：

- *runtime：必须为*`*tfjs*`
- *maxHands：默认为*`*2*`*，**最多识别手的个数*
- *modelType：默认为*`*full*`*，lite和full，**制定的加载类型*
- *detectorModelUrl：默认外网，**detector模型地址*
- *landmarkModelUrl：默认外网，**landmark模型地址*



## estimateHands

使用detector estimateHands识别图像、视频。

```JavaScript
const estimationConfig = {flipHorizontal: false};
const hands = await detector.estimateHands(image, estimationConfig);
```

Image可支持的类型：

- `tf.Tensor3D`
- `ImageData`
- `HTMLImageElement`
- `HTMLCanvasElement `
- `HTMLVideoElement`



estimationConfig的参数有：

-  *flipHorizontal：默认为*`*false*`*，**成像是否水平翻转*
- *staticImageMode：默认为*`*false*`*，**常规图片模式*

> 若为true，则模型将对于每帧图片进行识别

> 若为false，只检测第一帧，输出坐标点，然后仅跟踪坐标点，直到失去手部追踪，不需重新识别





# 坐标点位

![img](https://justhealth.feishu.cn/space/api/box/stream/download/asynccode/?code=MjY2OTU2NjAwNTliYzgxODk4NDViMDEwNjBmZmM4NDRfbUFrMEp6aFljUVkzcG1FYWxzYW9RRnZ4aENDSm1lWnhfVG9rZW46Ym94Y242VE9hUmtuZWNITm95NWhTUXZJaFliXzE2NTc4NTE3Njg6MTY1Nzg1NTM2OF9WNA)

```JSON
[
  {
    score: 0.8,
    handedness: ‘Right’,
    keypoints: [
      {x: 105, y: 107, name: "wrist"},
      {x: 108, y: 160, name: "pinky_finger_tip"},
      ...
    ],
    keypoints3D: [
      {x: 0.00388, y: -0.0205, z: 0.0217, name: "wrist"},
      {x: -0.025138, y: -0.0255, z: -0.0051, name: "pinky_finger_tip"},
      ...
    ]
  }
]
```

> Scroe: 置信度 0~1