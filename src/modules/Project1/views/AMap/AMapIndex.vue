<template>
  <div class="root-div">
    <van-field v-model="address" name="Address" is-link readonly input-align="right" label="地址" @click="isShow_Map = true" />
    <van-popup v-model="isShow_Map" position="right" :style="{ width: '100%', height: '100%' }">
      <Map @Back="toBack" @DeatilData="getDeatilData"></Map>
    </van-popup>
  </div>
</template>
<script>
import { Uploader, Toast } from "vant";
import Map from "./Map.vue";
import { getCurrentAddress } from "../../utils/index"
export default {
  components: { "van-uploader": Uploader, Map },
  data(){
    return {
      address: "",
      Longitude: "",  // 经度
      Latitude: "",  // 纬度
      isShow_Map: false,
    }
  },
  mounted(){
    this.getMyLocation()
  },
  methods: {
    // 地图返回
    toBack(val){
      this.isShow_Map = val
    },
    // 获取到详细地址
    getDeatilData(obj, boolean){
      this.isShow_Map = boolean
      this.address = obj.name + obj.address
      console.log('Mapobj==',obj);
    },
    // 获取当前位置信息
    getMyLocation(){
      let that = this;
      getCurrentAddress().then(value => {
        // 判断是否是精确定位,如果不是，则使用粗略城市定位
        let isTrue = value.addressComponent ? true : false;
        if(isTrue) {
          that.address = value.formattedAddress
          that.Longitude = value.position.lng
          that.Latitude = value.position.lat
        } else {
          that.address = value.province + value.city
          that.Longitude = value.center[0]
          that.Latitude = value.center[1]
        }
      }, reason => {
        Toast.fail({ message: reason+"" })
      });
    },
  }
}
</script>
<style lang="less" scoped>
.root-div {
  width: 100vw;
  height: 100vh;
  background: #eee;
}
</style>