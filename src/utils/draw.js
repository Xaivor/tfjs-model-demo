// tfjs专用画图函数
const DEFAULT_STYLE = {
  pointStyle: {
    //点样式
    width: 4,
    borderWidth: 4,
    borderColor: "#ffffff",
    fillColor: "#00ff66",
  },
  lineStyle: {
    //线样式
    width: 4,
    color: "#ffffff",
  },
  textStyle: {
    // 字样式
    width: 4,
    font: '50px 微软雅黑',
    color: "#ffffff"
  }
}

// 画字
export function drawCenterText({ position, textStyle, text, ctx }) {
  textStyle = {
    ...DEFAULT_STYLE.textStyle,
    ...textStyle
  }

  ctx.font = textStyle.font;
  ctx.lineWidth = textStyle.width;
  ctx.fillStyle = textStyle.color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, position.x, position.y);
}


// 画关键点
export function drawKeypoints({ keypoints, pointStyle, ctx }) {
  for (var i = 0; i < keypoints.length; i++) {
    var x = keypoints[i].x;
    var y = keypoints[i].y;

    if (keypoints[i].score) {
      (keypoints[i].score > 0.4) && drawPoint({ y, x, pointStyle, ctx });
    } else {
      drawPoint({ y, x, pointStyle, ctx });
    }
  }
}

// 画点
export function drawPoint({ y, x, pointStyle, ctx }) {
  pointStyle = {
    ...DEFAULT_STYLE.pointStyle,
    ...pointStyle
  }

  ctx.beginPath();
  ctx.arc(x, y, pointStyle.width, 0, 2 * Math.PI, false);
  ctx.lineWidth = pointStyle.borderWidth;
  ctx.strokeStyle = pointStyle.borderColor;
  ctx.fillStyle = pointStyle.fillColor;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}


// 关键点连线
export function drawSkevaron({ keypoints, lineArr, lineStyle, ctx }) {
  for (let i = 0; i < lineArr.length; i++) {
    for (let j = 0; j < lineArr[i].length - 1; j++) {
      drawSegment({
        akeypoints: keypoints[lineArr[i][j]],
        bkeypoints: keypoints[lineArr[i][j + 1]],
        lineStyle,
        ctx
      });
    }
  }
}

// 画线
export function drawSegment({ akeypoints, bkeypoints, lineStyle, ctx }) {
  lineStyle = {
    ...DEFAULT_STYLE.lineStyle,
    ...lineStyle
  }


  var ax = akeypoints.x,
    ay = akeypoints.y,
    bx = bkeypoints.x,
    by = bkeypoints.y;

  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineWidth = lineStyle.width;
  ctx.strokeStyle = lineStyle.color;
  ctx.stroke();
  ctx.restore();
}