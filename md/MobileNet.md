# MobileNet

<img src="https://gitee.com/Xiavor/tfjs-model-demo/raw/master/md/screenshot-20220705-152309.png" alt="screenshot-20220705-152309" style="zoom:67%;" />

# 简介

‎MobileNet 是小型，低延迟，低功耗的模型。

它们可以用于图片的分类，和检测。



这个模型不需要你了解ai。

它可以将任何基于浏览器的图像元素（例如元素）作为输入，并返回最可能的预测及其置信度的数组。`<img><video><canvas>`



# 基本使用

在项目中获取此模型主要有两种方法：

- script标签 引入js
- npm模块 导入import



## script引入

```HTML
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.1"> </script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@1.0.0"> </script>

<img id="img" src="cat.jpg"></img>

<script>
  const img = document.getElementById('img');
  
  mobilenet.load().then(model => {
    model.classify(img).then(predictions => {
      console.log('Predictions: ', predictions);
    });
  });
</script>
```





## npm导入

首先安装三个依赖包

- `@tensorflow/tfjs`
- `@tensorflow/tfjs-backend-webgl`
- `@tensorflow-models/mobilenet` 



```Apache
npm install --save @tensorflow/tfjs @tensorflow/tfjs-backend-webgl @tensorflow-models/mobilenet
```



再导入到项目里来

```JavaScript
// main.js 首先得导入webgl
import '@tensorflow/tfjs-backend-webgl';


// 使用页面
const mobilenet = require("@tensorflow-models/mobilenet");
const img = document.getElementById("img");
const model = await mobilenet.load();
const predictions = await model.classify(img);

console.log('predictions：', predictions)
```



# API

## load()

加载模型、`mobilenet` 是模型。

```JavaScript
mobilenet.load({
    version: 1,
    alpha?: 0.25 | .50 | .75 | 1.0,
    modelUrl?: string
    inputRange?: [number, number]
  }
)
```



参数（可选）：

- version：基础模型版本，1对应[MobileNetV1](https://github.com/tensorflow/models/blob/master/research/slim/nets/mobilenet_v1.md)，2对应[MobileNetV2](https://github.com/tensorflow/models/tree/master/research/slim/nets/mobilenet)（默认为1）
- alpha：智能准确性，数值越大，越智能，消耗性能越高（默认值为1）
- modelUrl：模型地址，默认外网，需要VPN，也可以下载下来，放到自己服务器上
- inputRange：输入像素范围，通常是‎ [0, 1] or [-1, 1]





## classify()

使用mobilenet进行分类，它将返回一个从大到小降序排序的概率数组。

```Gherkin
model.classify(
  img: tf.Tensor3D | ImageData | HTMLImageElement |
      HTMLCanvasElement | HTMLVideoElement,
  topk?: number
)
```



参数：

- img：5种图像输入类型
- topk：输出概率数组长度（默认为3）



返回：

```YAML
[{
  className: "Egyptian cat",
  probability: 0.8380282521247864
}, {
  className: "tabby, tabby cat",
  probability: 0.04644153267145157
}, {
  className: "Siamese cat, Siamese",
  probability: 0.024488523602485657
}]
```