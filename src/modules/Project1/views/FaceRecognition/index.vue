<template>
  <div class="FaceBox">
    <van-field class="screenshot-pad" name="fileList" label="" :rules="[{ required: true, message: '请至少上传一张截图' }]" >
      <template #input>
        <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="afterRead" @delete="deleteImg" multiple :max-count="99"/>
      </template>
    </van-field>
  </div>
</template>
<script>
import { compressBase64Img, FaceRecognition } from "../../utils/index";
import ComApi from "../../api/Common";
import { Uploader, Toast } from "vant";
export default {
  components: { "van-uploader": Uploader },
  data() {
    return {
      fileList: [], // 上传头像列表
      fileStrArr: [],
      fileString: "",
    };
  },
  created(){
    
  },
  methods: {
    // 文件上传 start
    // 上传图片之前
    beforeRead(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        Toast.fail("只能上传图片!");
      }
      return isJPG;
    },
    // 上传图片之后
    afterRead(file, detail) {
      var that = this;
      //调用压缩方法
      compressBase64Img(file.content, 500, 0.6, (newStr) => {
        var fileType = file.file.type.split("/")[1];
        let toast = Toast.loading({ message: "正在上传图片…" });

        // 调用人脸识别方法
        FaceRecognition(newStr).then(value => {
          console.log("value",value)
          if(value) {
            // Toast.success({ message: '人脸图片'})
            var ParaData = {
              Base64Str: newStr.replace(/data.+?;base64,/, ""),
              Module: "FZS_YZS",
              FileExt: "." + fileType,
            };
            ComApi.SaveBase64File(ParaData).then((res) => {
              toast.clear();
              //console.log("res=>",res)
              if (res.State == 1) {
                Toast.success({ message:"上传成功" });
                that.fileStrArr.push(res.Content);
                // 把数组变成字符串
                that.fileString = that.fileStrArr + "";
              } else {
                Toast.fail({ message:"上传失败" });
                that.fileList.splice(detail.index, 1);
                that.fileStrArr.splice(detail.index, 1);
              }
            }).catch((res) => {
              Toast.fail({ message: "上传图片异常，请稍后重试！" });
              //关闭loading
              toast.clear();
              that.fileList.splice(detail.index, 1);
              that.fileStrArr.splice(detail.index, 1);
            });
          } else {
            Toast.fail({ message: '未检测到人脸'})
            // 移除不符合条件的图片
            that.fileList.splice(detail.index, 1);
            that.fileStrArr.splice(detail.index, 1);
          }
        }, reason => {
          Toast.fail({ message: reason+"" })
        });
      });
    },
    //图片删除触发
    deleteImg(elIndex, detail) {
      this.fileStrArr.splice(detail.index, 1);
      // 把数组变成字符串
      this.fileString = this.fileStrArr + "";
    },
    
  },
};
</script>

<style lang="less" scoped>
</style>
