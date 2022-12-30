import interfaceAjax from '../api/index';

export default {
    // ===================文件==============================
    // 上传Base64编码文件
    UploadBase64File(imgUrl) {
        return interfaceAjax({
            urlSrc: "fileApi",
            url: 'api/FileAccess/UploadBase64File',
            data: {
                FileUrl: imgUrl
            }
        }, false);
    },
    // 获取Base64编码图片文件
    GetImage(imgUrl) {
        return interfaceAjax({
            urlSrc: "fileApi",
            url: 'api/FileAccess/GetImageBase64',
            data: {
                FileUrl: imgUrl
            }
        }, false);
    },
// 获取外网Base64编码图片文件
    GetOutFile(Data) {
        return interfaceAjax({
            urlSrc: "OutFileApi",
            url: 'api/FileAccess/getOutFileBase64ByUrl',
            data: Data
        }, false);
    },
    // 保存文件
    SaveBase64File(optData) {
        return interfaceAjax({
            urlSrc: "fileApi",
            url: '/api/FileAccess/SaveFile',
            data: optData
        }, false);
    },
    //获取微信jssdk签名
    GetWxJsSdkConfig(data) {    
        return interfaceAjax({
            urlSrc: "yjzcWebApi",
            url: '/api/WX/GetWxJsSdkConfig',
            data,
            method: 'POST',
            noType: true
        }, true);
    },

}