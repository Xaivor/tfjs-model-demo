# CocoSsd





![screenshot-20220726-161320.png](https://gitee.com/Xiavor/tfjs-model-demo/raw/master/md/screenshot-20220726-161320.png)



# 简介

对象识别模型，其主要的作用是，定位并识别图中的多个对象。

此模型只能检测 COCO 数据集中定义的对象。[定义的80类](https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/src/classes.ts)

这个TensorFlow.js模型不需要你了解机器学习。它可以将输入作为任何基于浏览器的图像元素，并返回具有类名和置信度的边界框数组。`<img><video><canvas>`



# 使用

在项目中获取此模型主要有两种方法：

- script标签 引入js
- npm模块 导入import





## script引入

```html
<script src="<https://cdn.jsdelivr.net/npm/@tensorflow/tfjs>"> </script>
<script src="<https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd>"> </script>
<img id="img" src="cat.jpg"/>

<script>
const img = document.getElementById('img');

cocoSsd.load().then(model => {
    model.detect(img).then(predictions =>{
        console.log('Predictions: ', predictions);
    });
});
</script>
```





## npm导入

```bash
yarn add @tensorflow/tfjs-backend-cpu
yarn add @tensorflow/tfjs-backend-webgl
yarn add @tensorflow-models/coco-ssd
```





## 模型使用

```jsx
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import *as cocoSsdfrom "@tensorflow-models/coco-ssd";
const img = document.getElementById('img');
const model = await cocoSsd.load();
const predictions = await model.detect(img);
```

> `predictions` 即为输出的模型数据数组。





## API

### load

```java
export interface ModelConfig {
  base?: ObjectDetectionBaseModel;
  modelUrl?: string;
}

cocoSsd.load(config: ModelConfig = {});
```

**属性值：**

- base（选填）：模型类型，可选值：
  - mobilenet_v1
  - mobilenet_v2（最高准确）
  - `lite_mobilenet_v2` 默认值（速度最快）
- modelUrl：模型地址，默认`外网`





### detect

使用模型，传入图像资源，返回一个具有类名和置信度的边界框数组。

```javascript
model.detect(
  img: tf.Tensor3D | ImageData | HTMLImageElement |
      HTMLCanvasElement | HTMLVideoElement,
  maxNumBoxes: number,
  minScore: number
)
```

**属性值：**

- img：Tensor支持的图像数据
- maxNumBoxes：设置最多识别对象，默认`20`
- ·minScore：输出最小置信度，区间 [0,1]，默认`0.5`





**返回值：**

```json
[{
  bbox: [x, y, width, height],
  class: "person",
  score: 0.8380282521247864
}, {
  bbox: [x, y, width, height],
  class: "kite",
  score: 0.74644153267145157
}]
```