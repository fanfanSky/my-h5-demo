// 导入人脸识别库
import {
    nets,
    SsdMobilenetv1Options,
    fetchImage,
    detectSingleFace,
    matchDimensions,
    detectAllFaces,
    resizeResults,
    draw,
    createCanvasFromMedia,
    Box,
} from 'face-api.js';
import { Toast } from 'vant';
/**
 * @param {*} compressBase64Img 压缩base64图片方法
 * @param {*} base64 需要压缩的原来的base64图片
 * @param {*} w 设置图片宽度
 * @param {*} qlt 压缩系数
 * @param {*} callback 回调方法
 */
function compressBase64Img(base64, w, qlt, callback) {
    var newImage = new Image();
    var quality = qlt;    //压缩系数0-1之间
    newImage.src = base64;
    newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
    var imgWidth, imgHeight;
    newImage.onload = function () {
        imgWidth = this.width;
        imgHeight = this.height;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        if (Math.max(imgWidth, imgHeight) > w) {
            if (imgWidth > imgHeight) {
                canvas.width = w;
                canvas.height = w * imgHeight / imgWidth;
            } else {
                canvas.height = w;
                canvas.width = w * imgWidth / imgHeight;
            }
        } else {
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            quality = qlt;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
        // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
        // while (base64.length / 1024 > 150) {
        // 	quality -= 0.01;
        // 	base64 = canvas.toDataURL("image/jpeg", quality);
        // }
        // // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
        // while (base64.length / 1024 < 50) {
        // 	quality += 0.001;
        // 	base64 = canvas.toDataURL("image/jpeg", quality);
        // }
        callback(base64);//必须通过回调函数返回，否则无法及时拿到该值
    }
}

/**
 * @param {*} FaceRecognition 判断是否含有人脸方法  (face-api.js)人脸识别库
 * @param {*} imgStr 可以是base64图片，也可本地图片
 */
function FaceRecognition(imgStr) {
    let result = new Promise((resolve, reject) => {
        //加载训练好的模型（weight，bias）
        // ageGenderNet 识别性别和年龄
        // faceExpressionNet 识别表情,开心，沮丧，普通
        // faceLandmark68Net 识别脸部特征用于mobilenet算法
        // faceLandmark68TinyNet 识别脸部特征用于tiny算法
        // faceRecognitionNet 识别人脸
        // ssdMobilenetv1 google开源AI算法除库包含分类和线性回归
        // tinyFaceDetector 比Google的mobilenet更轻量级，速度更快一点
        // mtcnn  多任务CNN算法，一开浏览器就卡死
        // tinyYolov2 识别身体轮廓的算法，不知道怎么用
        Promise.all([
            nets.faceRecognitionNet.loadFromUri('/models'),
            nets.faceLandmark68Net.loadFromUri('/models'),
            nets.faceLandmark68TinyNet.loadFromUri('/models'),
            nets.ssdMobilenetv1.loadFromUri('/models'),
            nets.tinyFaceDetector.loadFromUri('/models'),
            nets.faceExpressionNet.loadFromUri('/models'),
            nets.mtcnn.loadFromUri('/models'),
        ]).then(startRect);
        async function startRect() {
            //读取人脸标签数据
            const img = await fetchImage(imgStr)
            const options = new SsdMobilenetv1Options({ minConfidence: 0.38 })
            //扫描图片中人脸的轮廓数据  detectSingleFace: 检测单个人脸  detectAllFaces：检测多个人脸
            const detections = await detectSingleFace(img, options).withFaceLandmarks().withFaceDescriptor().withFaceExpressions()
            console.log('人脸数据', detections);
            if (detections) return resolve(true);
            else return resolve(false);
        }
    })
    return result;
}


/**
 * @param {*} getCurrentAddress 获取当前位置信息（此方法可直接用：index.html下已经引入高德地图）
 * @param {*} result  返回值(一个Promise对象)
 */
function getCurrentAddress() {
    let toast = Toast.loading({ message: "正在获取当前位置信息…" }); // 显示正在加载中
    let result = new Promise((resolve, reject) => {
        //初始化地图
        var map = new AMap.Map("container", {
            zoom: 14, //缩放级别
            // center: this.center, //设置地图中心点
            resizeEnable: true,  //地图初始化加载定位到当前城市
        });
        // 以下获取当前位置
        // map.plugin('AMap.Geolocation', function () {
        //   var geolocation = new AMap.Geolocation({
        //       enableHighAccuracy: true,//是否使用高精度定位，默认:true
        //       timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        //       maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        //       convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        //       showButton: true,        //显示定位按钮，默认：true
        //       buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        //       buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        //       showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        //       showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        //       panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        //       zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        //   });
        //   geolocation.getCurrentPosition();
        //   AMap.event.addListener(geolocation, 'complete', onComplete);
        //   AMap.event.addListener(geolocation, 'error', onError);
        //   // 定位完成时
        //   function onComplete(data) {
        //     resolve(data);
        //     alert("data成功====="+JSON.stringify(data))
        //     toast.close()
        //   };
        //   // 定位出错时
        //   function onError(data) {
        //     alert("data错误1====="+JSON.stringify(data))
        //     reject(data)
        //     toast.close()
        //     // Toast({ message:'当前位置无法获取，已为您定位至南宁市人民政府' , duration: 3000});
        //   }
        // });
        map.plugin("AMap.Geolocation", () => {
            var geolocation = new AMap.Geolocation({
                // 是否使用高精度定位，默认：true
                enableHighAccuracy: true,
                //是否使用安卓定位sdk用来进行定位，需要安卓端sdk配合
                useNative: true,
                // 设置定位超时时间，默认：无穷大
                timeout: 10000,
            });
            // 获取用户当前的精确位置
            geolocation.getCurrentPosition((status, res1) => {
                if (status == "complete") {
                    resolve(res1)
                } else {
                    // 如果当前不能获取当前精确定位，则获取当前用户所在城市和城市的经纬度
                    geolocation.getCityInfo((status, res2) => {
                        if (status == "complete") {
                            resolve(res2)
                        } else {
                            let toastFail = Toast.fail({ message: "未获取到定位" })
                            reject(toastFail)
                        }
                    })
                }
                toast.close()
            })
        })
    })
    return result;
}


export {
    compressBase64Img,
    FaceRecognition,
    getCurrentAddress
}