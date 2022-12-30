<template>
  <div class="tags_warp">
    <div class="toolbar-box-1">
      <div class="cancel-box" @click="cancelArea">取消</div>
      <div class="title-box">活动范围设置</div>
      <div class="confirm-box" @click="saveArea('确定')">确认</div>
    </div>
    <div class="toolbar-box-2">
      <div>省份</div>
      <div>城市</div>
      <div>地区</div>
    </div>
    <div class="cascade-box">
      <div class="provice-box">
        <div class="item" v-for="(proviceItem,proviceIndex) in option.proviceArr" :key="proviceIndex+'proviceIndex'" 
          :class="[proviceIndex==proviceKey?'chooseItem':'']" @click="clickProviceItem(proviceIndex)">
            {{proviceItem.text}}
          <span class="itemNum" v-if="proviceItem.cityNum>0">{{proviceItem.cityNum}}</span>
        </div>
      </div>
      <div class="city-box">
        <div class="item" v-for="(citychildItem,citychildIndex) in option.proviceArr[proviceKey].children" :key="citychildIndex+'citychildIndex'" 
          :class="[citychildIndex==cityKey?'chooseItem':'']" @click="chooseCityBox(citychildItem,citychildIndex)">
            {{citychildItem.text}}
          <span class="itemNum" v-if="citychildItem.areaNum>0">{{citychildItem.areaNum}}</span>
        </div>
      </div>
      <div class="area-box">
        <div v-for="(areachildItem,areachildIndex) in option.proviceArr[proviceKey].children[cityKey].children" :key="areachildIndex+'areachildIndex'" 
          :class="['item',option.areaIds.includes(areachildItem.value)?'chooseItem':'']" @click="chooseAreaBox(areachildItem,cityKey)">
            {{areachildItem.text}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    props: {
      //接收父组件传递的数据
      option:{
        type:Object,
        default:() => {
          return { }
        }
      }
    },
    data() {
      return {
        proviceKey: 0, //默认展示为最顶层数据（点击时切换proviceKey）
        cityKey: 0, //默认展示为最顶层数据（点击时切换cityKey）
        paoviceData: [], // 省份数据，做临时变量
        cityData: [], // 城市数据，做临时变量
      };
    },
    created() {
      this.initArea()
      this.collectData()
      console.log('option',this.option.proviceArr);
    },
    methods: {
      //保存
      saveArea(type){
        if(type == '重置'){
          this.option.chooseItem = [],
          this.option.cityIds = []
          this.initArea()
        } else {
          //点击确定时传回数据
          this.$emit('saveArea',this.option.cityIds,this.option.chooseItem)
        }
      },
      //取消事件
      cancelArea(){
        this.$emit('cancelArea')
      },
      //选中取消选中事件
      chooseCityBox(item,index){
        // 点击二级城市时取下标 展示三级地区
        this.cityKey = index
      },
      // 选中取消选中事件
      chooseAreaBox(item,index) {
        console.log('item--',item);
        // value唯一标识存在找到对应下标删除
        if(this.option.areaIds.includes(item.value)){
            let findIndex = this.option.areaIds.findIndex((ele)=>{
              return ele == item.value
            })
            console.log('findIndex',findIndex);
            this.option.areaIds.splice(findIndex,1)
            this.option.chooseItem.splice(findIndex,1)
        }else{
          // value不存在则添加
          this.option.areaIds.push(item.value)
          // 查找当前所选地区所属城市
          let tempCityArr = []
          this.cityData.forEach(el => {
            el.children.forEach(ele => {
              if(ele.value == item.value){
                tempCityArr.push(el)
              }
            })
          })
          // 查找当前所选地区所属省份
          let tempProviceArr = []
          this.paoviceData.forEach(el => {
            el.children.forEach(ele => {
              if(ele.value == tempCityArr[0].value){
                tempProviceArr.push(el)
              }
            })
          })
          // 拼接省份、城市、地区
          this.option.chooseItem.push({
            areaText: item.text,
            areaValue: item.value,
            cityText: tempCityArr[0].text,
            cityValue: tempCityArr[0].value,
            proviceText: tempProviceArr[0].text,
            proviceValue: tempProviceArr[0].value,
          })
          console.log('this.option.chooseItem',this.option.chooseItem);
        }
        this.initArea()
      },
      //全选取消全选事件
      chooseAll(index){
        let arrid = []
        let arrItem = []
        //取消全选
        if(this.option.proviceArr[index].children.length==this.option.proviceArr[index].cityNum){
          this.option.cityIds.forEach((element)=>{
            let flag = true
             //如果选中下标下二级城市有对应的则不往数组中添加
            this.option.proviceArr[index].children.forEach((ele)=>{
              if(element == ele.value){
                flag = false
              }           
            })
            if(flag){
              arrid.push(element)
            }
          })
          this.option.chooseItem.forEach((element)=>{
            let flag = true
             //如果选中下标下二级城市有对应的则不往数组中添加
            this.option.proviceArr[index].children.forEach((ele)=>{
              if(element.value == ele.value){
                flag = false
              }           
            })
            if(flag){
              arrItem.push(element)
            }
            this.option.cityIds = arrid
            this.option.chooseItem = arrItem
          })
        }else{
          //value不存在时添加
          this.option.proviceArr[index].children.forEach((ele)=>{ 
            if(!this.option.cityIds.includes(ele.value)){
              this.option.cityIds.push(ele.value)
              this.option.chooseItem.push(ele)
            }
          })
        }
        this.initArea()
      },
      //初始化展示num 每个二级标签中选中了几个 num>0时展示
      initArea(){
        console.log('this.option.areaIds==',this.option.areaIds);
        this.option.proviceArr.forEach(element => {
          // 遍历得到城市
          element.children.forEach(ele => {
            let num = 0
            ele.children.forEach(el => {
              if(this.option.areaIds.includes(el.value)){
                num++
              }
            })
            ele.areaNum = num  // 记录省份显示的地区选择数量
          })
        });
      },
      // 点击一级省份时取下标 展示二级城市
      clickProviceItem(index){
        this.proviceKey = index
        this.cityKey = 0  // 防止点击城市大的索引后再点击回小的省份索引会报错
      },
      // 收集省份、城市
      collectData(){
        this.paoviceData = []
        this.cityData = []
        this.option.proviceArr.forEach(element => {
          this.paoviceData.push(element)
          element.children.forEach(ele => {
            this.cityData.push(ele)
          })
        })
      },
      
    },
  };
</script>
<style lang="less" scoped>
.toolbar-box-1 { width: 100%; height: 40px; background: #fff; display: flex; justify-content: space-between; align-items: center; font-size: 16px;
  .cancel-box, .confirm-box, .title-box { display: flex; justify-content: center; align-items: center; }
  .cancel-box { width: 20%; color: #9FA3B9; }
  .confirm-box { width: 20%; color: #4C82FF; }
  .title-box { width: 60%; font-size: 18px; }
}
.toolbar-box-2 { width: 100%; height: 40px; background: #fff; display: flex; justify-content: space-between; align-items: center; color: #9FA3B9; font-size: 16px; border-top: 1px solid #E5E5E5; border-bottom: 1px solid #E5E5E5;
  div { width: 33.33%; display: flex; justify-content: center; align-items: center; }
}
.cascade-box { width: 100%; height: 600px; display: flex; justify-content: space-between; align-items: center; text-align: center;
  div { width: 33.33%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; }
  .provice-box, .city-box, .area-box { width: 33.33%; height: 600px; overflow-y: scroll;
    div { width: 100%; padding: 10px 0; }
  }
  .provice-box { background: #F5F7FA; }
  .city-box, .area-box { border-left: 1px solid #E5E5E5; }
  .provice-box::-webkit-scrollbar, .city-box::-webkit-scrollbar, .area-box::-webkit-scrollbar { width: 0 !important }
  .active_1, .active_2, .active_3 { color: #4C82FF; }
  
  .chooseItem { color: #3370FF; }
  .item { margin:1px 0px; position: relative; }
  .item .itemNum { position: absolute; top: 12px; right:10px; font-size: 10px; color: #3370FF; }
}

</style>