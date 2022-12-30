<template>
  <div class="root-div">
    <div class="content-box">
      <div class="banner-box">
        <img src="../../assets/images/volunteer-banner.png" alt="">
        <div class="propaganda-box">
          <div class="text-box l4px">我自愿加入</div>
          <div class="text-box">【防走失志愿者联盟】</div>
          <div class="create-box">爱心助力</div>
        </div>
      </div>
      <div class="volunteer-counts">您只会收到活动范围内的走失信息</div>
      <div class="title-text">活动范围设置</div>
      <div class="list-box">
        <div class="range-list" v-for="(item,index) in paramsData" :key="index">
          <img class="location-icon" src="../../assets/images/location-icon.png" alt="">
          <div class="address-box">
            <span>{{item.proviceText}}</span>
            <span>{{item.cityText}}</span>
            <span>{{item.areaText}}</span>
          </div>
          <img class="delete-icon" src="../../assets/images/delete-icon.png" alt="" @click="Delete(item,index)">
        </div>
      </div>
      <div class="btn-box">
        <van-button block class="submit-box" @click="chooseArea">添加活动范围</van-button>
      </div>
      <!-- 底部弹窗 -->
      <van-popup class="popup-box" v-model="chooseshowArea" round position="bottom">
        <area-tags v-if="chooseshowArea" :option="selectInfo" @cancelArea="cancelArea" @saveArea="saveArea"></area-tags>
      </van-popup>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import areaTags from "./areaTags.vue";
export default {
  components: { areaTags },
  data() {
    return {
      paramsData: [
        { proviceValue:'13', proviceText:'河北省', cityValue:'1302', cityText:'唐山市', areaValue: '130202', areaText: '路南区' },
        { proviceValue:'13', proviceText:'河北省', cityValue:'1303', cityText:'秦皇岛市', areaValue: '130302', areaText: '海港区' },
        { proviceValue:'13', proviceText:'河北省', cityValue:'1303', cityText:'秦皇岛市', areaValue: '130303', areaText: '山海关区' },
      ],
      selectInfo: {
        type:'checkbox',
        areaIds:[],
        cityIds:[],
        proviceArr:[],
        chooseItem:[]
      },
      chooseshowArea: false,
    }
  },
  created(){
    this.getFourthCascade()
  },
  methods: {
    // 加载四级联动数据
    getFourthCascade() {
      let that = this
      axios.get("./cascade/third-cascade-code.json", {}).then(res => {
        that.selectInfo.proviceArr = res.data
        that.init()
      })
    },
    // 添加活动范围
    chooseArea() {
      this.init() 
      this.chooseshowArea = true 
    },
    //初始化数据
    init(){
      let areaIds = [];
      let cityIds = [];
      let proviceItem = [];
      this.paramsData.forEach((ele)=>{
        areaIds.push(ele.areaValue);
        cityIds.push(ele.cityValue);
        proviceItem.push(ele);
      });
      this.selectInfo.areaIds = JSON.parse(JSON.stringify(areaIds));
      this.selectInfo.cityIds = JSON.parse(JSON.stringify(cityIds));
      this.selectInfo.chooseItem = JSON.parse(JSON.stringify(proviceItem));
    },
    //子组件传回的确定事件
    saveArea(ids,chooseItem){
      this.paramsData = JSON.parse(JSON.stringify(chooseItem))
      this.chooseshowArea = false
      console.log('this.paramsData111',this.paramsData);
      this.paramsData.map(el => {
        if(el.proviceText.includes("自治区")){
          if(el.proviceText.includes("内蒙古")){
            el.proviceText = el.proviceText.substr(0,3)
          } else {
            el.proviceText = el.proviceText.substr(0,2)
          }
        } else if(el.proviceText.includes("省") || el.proviceText.includes("市")){
          el.proviceText = el.proviceText.substr(0, el.proviceText.length - 1);
        }
      })
    },
    //子组件传回的取消展示选择框事件
    cancelArea(){
      this.chooseshowArea = false
    },
    // 删除
    Delete(item,index) {
      this.paramsData.splice(index, 1);
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/style/list.scss";
.root-div { background: #FFF; }
.banner-box { width: 100%; height: 170px; position: relative;
  img { width: 100%; height: 100%; }
  .propaganda-box { position: absolute; top: 40px; right: 35px;
    .text-box { font-size: 18px; color: #4E628A;font-weight: 600;font-style:italic; }
    .l4px { padding-left: 12px; }
    .create-box { width: 68px; font-size: 14px; padding: 1px 5px;text-align: center; background: #45C689; border-radius: 10px; color: #FFF; margin: 5px 0 0 12px; }
  }
}
.volunteer-counts { width: 100%; height: 32px; background: #70A0F4; line-height: 32px; text-align: center; color: #FFF; font-size: 16px; font-weight: 500; }
.title-text { padding: 16px 16px 8px; background: #F5F7FA; }
.list-box { max-height: calc(100vh - 355px); overflow-y: auto;
  .range-list { padding: 12px 16px; border-bottom: 1px solid #EAEAEC; display: flex; justify-content: space-between; align-items: center;
    .location-icon { width: 12px; height: 17px; }
    .address-box { width: 94%; padding: 0 16px; font-size: 16px;
      span:nth-child(2), span:last-child {
        margin-left: 20px;
      }
    }
    .delete-icon { width: 16px; height: 16px; }
  }
}
.btn-box { width: 100%; height: 48px; margin-top: 6px;
  .submit-box { width: 94%; height: 48px; background: #296ef0; border-radius: 6px; color: #fff; font-size: 16px; text-align: center; line-height: 48px; margin: 0 auto; }
}
</style>