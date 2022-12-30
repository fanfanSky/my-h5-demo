import axios from 'axios';
import { DeCrypt, EnCrypt } from '../assets/js/Crypto';

/**
 * 执行ajax
 * @param {Object} options - 选项
 * @param {String} options.urlSrc - 接口类型
 * @param {String} options.url - 接口
 * @param {String} options.method - 请求方式
 * @param {Object} options.params - 请求URL参数
 * @param {Object} options.data - 接口参数\
 * @param {Boolean} options.withCredentials - 跨域
 * @param {Number} options.timeout - 超时
 * @param {Function} options.resultFilter - 结果过滤
 * @param {Boolean} options.noToken - 不携带token     true: "" /  false/不传: store.state.token
 * @param {Boolean} options.noType - Content-type 方式   true:application/json  /  false/不传:application/x-www-form-urlencoded
 * @param {Boolean} options.noSysCode
 * @param {Boolean} options.noClientID
 * @param {Boolean} options.noIPAddress
 * @param {Boolean} options.isCrypt
 * @param ajaxConfig
 */
function interfaceAjax(options, isCrypt) {
    options.isCrypt = (isCrypt || isCrypt != undefined) ? isCrypt : false;
    // 默认配置
    let ajaxConfig = {
        // 默认处理成功
        callback: (data) => {
            //console.log("interfaceAjax.ajaxConfig.data=" + JSON.stringify(data) );
        },
        // 默认处理失败
        errorCallback: () => { },
        // 默认处理完成
        complete: () => { }
    };
    var agent = {};
    agent.then = (callback) => {
        if (callback) {
            ajaxConfig.callback = (data) => {
                callback(data);
            }
        }
        return agent;
    };
    agent.catch = (errorCallback) => {
        if (errorCallback) {
            ajaxConfig.errorCallback = (err, code) => {
                errorCallback(err, code);
            }
        }
        return agent;
    };
    agent.finally = (complete) => {
        if (complete) {
            ajaxConfig.complete = () => {
                complete();
            }
        }
        return {};
    };
    setTimeout(() => {
        doAjax(options, ajaxConfig);
    }, 1);
    return agent;
}
function doAjax(options, ajaxConfig) {
    var apiUrl = "https://h5.gaj.nanning.gov.cn/ZAFKApi";  
    if (options.urlSrc == 'fileApi') {
        apiUrl = "https://h5.gaj.nanning.gov.cn/ZAFKApi";
    }
    else if (options.urlSrc == 'H5') {
        apiUrl = "https://h5.gaj.nanning.gov.cn/";
    }
    else if (options.urlSrc == "OutFileApi") {//外网用做调用文件服务器的中转接口
        apiUrl = "https://h5.gaj.nanning.gov.cn/CoreOutApi/";
    }
  //console.log("urlSrc::",options.urlSrc,"data::",options.data)
    //console.log(apiUrl + options.url);
    axios({
        url: apiUrl + options.url,
        method: options.method || 'post',
        headers: {
            'Access-Control-Allow-Origin': '*', //解决cors头问题
            'X-Requested-With': 'XMLHttpRequest',
            "Content-Type": options.noType ? "application/json;charset=utf-8" : "application/x-www-form-urlencoded;charset=utf-8",
            "token": "",
            "SysCode": "",
            "ClientID": ""
            //"IPAddress": options.noIPAddress ? WebConfigs.IPAddress : "",
        },
        params: options.params, //get 参数
        data: options.urlSrc!='H5'&&options.urlSrc != 'OutFileApi'? paramsFilter(options.data, options.isCrypt) : options.data, //post 对象
        responseType: "json", // default,json,text
        changeOrigin: true //允许跨域
    }).then(res => {       
        if (res.status == 200) {           
            if (options.isCrypt == undefined || options.isCrypt) {
                //console.log(res.data);
                res.data = options.urlSrc == 'OutFileApi'?JSON.parse(res.data):JSON.parse(DeCrypt(res.data));// 返回数据解密    
                //alert(JSON.stringify(res.data));
            }
            //console.log("doAjax.axios.isCrypt=", options.isCrypt, JSON.stringify(res.data));
            if (res.data) {
                ajaxConfig.callback && ajaxConfig.callback(options.resultFilter ? options.resultFilter(res.data) : res.data);
            } else {
                ajaxConfig.errorCallback(res.data.Message, res.data.State);
            }
        } else {
            ajaxConfig.errorCallback && ajaxConfig.errorCallback(res.message, res.code);
        }
        ajaxConfig.complete && ajaxConfig.complete();
    }).catch(error => {
        ajaxConfig.errorCallback && ajaxConfig.errorCallback(JSON.stringify(error), JSON.stringify(error.code));
        ajaxConfig.loadingSwitch && ajaxConfig.loadingSwitch(false);
        ajaxConfig.complete && ajaxConfig.complete();
    });
}

// 参数过滤
function paramsFilter(params, isCrypt) {
    if (!params) return null;
    let res = {};
    Object.entries(params).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
            res[k] = v;
        }
    });
    // 判断是否需要加解密，默认加解密
    if (isCrypt == true) {
        return EnCrypt(JSON.stringify(res));
    } else {
        return JSON.stringify(res);
    }
}

export default interfaceAjax;
