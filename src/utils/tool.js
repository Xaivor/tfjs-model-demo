// 调用摄像头
export function getUserMedia(constraints, success, error) {
  // 最新API
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(success)
      .catch(error)
  } else if (navigator.webkitGetUserMedia) {
    //webkit核心浏览器
    navigator.webkitGetUserMedia(constraints, success, error)
  } else if (navigator.mozGetUserMedia) {
    //firfox浏览器
    navigator.mozGetUserMedia(constraints, success, error);
  } else if (navigator.getUserMedia) {
    //旧版API
    navigator.getUserMedia(constraints, success, error);
  } else {
    error('不支持访问用户媒体');
  }
}