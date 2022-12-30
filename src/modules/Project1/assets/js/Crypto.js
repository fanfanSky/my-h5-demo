import CryptoJS from 'crypto-js';
let DESCryptKey = "ilXg5ZR72a4fbV20p5821PIUcJZEeyZN";
let ZAFKDESCryptKey = "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4";
//加密
export function FileEnCrypt(params) {
    try {
        if (params == null || params == '') {
            return "";
        }
        var keyHex = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(ZAFKDESCryptKey).toString().toUpperCase().substring(0, 8));
        var encrypted = CryptoJS.DES.encrypt(params, keyHex,
            {
                iv: keyHex,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        return encrypted.ciphertext.toString().toUpperCase();
    } catch (ex) {
        console.log('加密异常：', ex.Error);
        return null;
    }
}
//加密
export function EnCrypt(params) {
    try {
        if (params == null || params == '') {
            return "";
        }
        var keyHex = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(DESCryptKey).toString().toUpperCase().substring(0, 8));
        var encrypted = CryptoJS.DES.encrypt(params, keyHex,
            {
                iv: keyHex,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        return encrypted.ciphertext.toString().toUpperCase();
    } catch (ex) {
        console.log('加密异常：', ex.Error);
        return null;
    }
}

//解密
export function DeCrypt(params) {
    try {
        if (params == null || params == '') {
            return "";
        }
        var keyHex = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(DESCryptKey).toString().toUpperCase().substring(0, 8));
        var encrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Hex.parse(params.toLowerCase())
        }, keyHex, {
            iv: keyHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString(CryptoJS.enc.Utf8);
    } catch (ex) {
        console.log('解密异常：', ex);
        return null;
    }
}