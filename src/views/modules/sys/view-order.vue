<template>
  <div>
    <div class="hidenbox" v-show="!show">
      <div class="cha" @click="cha">×</div>
    </div>
    <div class="hidenimg" v-show="!show">
      <img :src="show_img">
    </div>
    <el-dialog
      :title="'查看'"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-form :model="dataForm" ref="dataForm" label-width="135px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dataForm.name" placeholder="姓名" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="propertyNo">
          <el-input v-model="dataForm.propertyNo" placeholder="身份证号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="凭证编号" prop="idCard">
          <el-input v-model="dataForm.idCard" placeholder="凭证编号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="手机号" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="产权人身份证正面" prop="ownerPositive">
          <img :src="dataForm.ownerPositive" alt="" width="120" height="120" @click="fangda(dataForm.ownerPositive)">
        </el-form-item>
        <el-form-item label="产权人身份证反面" prop="ownerNegative">
          <img :src="dataForm.ownerNegative" alt="" width="120" height="120" @click="fangda(dataForm.ownerNegative)">
        </el-form-item>
        <el-form-item label="房管局受理凭证" prop="housingAuthority">
          <img :src="dataForm.housingAuthority" alt="" width="120" height="120" @click="fangda(dataForm.housingAuthority)">
        </el-form-item>
        <el-form-item label="邮寄类型" prop="postType">
          <el-select v-model="dataForm.postType" placeholder="请选择" width="100%" :disabled="true">
            <el-option
              v-for="item in postTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="是否投递保险" prop="postRisk">-->
        <!--<el-input v-model="dataForm.postRisk" placeholder="是否投递保险"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="是否投递保险" size="mini" prop="postRisk">
          <el-radio-group v-model="dataForm.postRisk" :disabled="true">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="投递费用" size="mini" prop="postRiskId">
          <el-radio-group v-model="dataForm.postRiskId" :disabled="true">
            <el-radio v-for="(item,index) in postRiskList" :key="index" :label="item.id" border size="medium">{{item.text}}</el-radio>
          </el-radio-group>
        </el-form-item>



        <el-form-item label="收件地址" prop="addressList">
          <!--<el-input v-model="dataForm.postRisk" placeholder="是否投递保险"></el-input>-->
          <el-cascader :disabled="true"
                       v-model="dataForm.addressList"
                       :options="options"
                       :props="props"
                       clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" prop="postAddress">
          <el-input v-model="dataForm.postAddress" placeholder="详细地址" :disabled="true"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import Uploader from '../../../components/Uploader/uploader'
  export default {
    data(){
      return{
        show_img:'',
        show:true,
        visible: false,
        imageUrl: '',
        options: [],
        postRiskList: [],
        props: {
          value: "id",
          label: "name",
          children: "childList"
        },
        childOptions: [],
        postTypeList:[],
        dataForm:{
          orderId: 0,
          name: '',
          propertyNo: '', // 身份证号
          idCard: '',
          phone: '',
          mobileCode: '',
          ownerPositive: '',
          ownerNegative: '',
          housingAuthority: '',
          postType: '',
          postRisk: 1,
          postRiskId: '',
          postProvinceId: '',
          postCityId: '',
          postCountyId: '',
          postAddress: '',
          addressList: []
        },
      }
    },
    methods:{
      cha (){
        this.show=true
        $("body").css("overflow","auto");
      },
      fangda (imgSrc){
      	// this.show_img = this.dataAllList[e].housingAuthority
      	this.show_img = imgSrc
        this.show=false
        $("body").css("overflow","hidden");
      },
      init (orderId) {
        console.log("--------------")
        console.log(orderId)

        this.dataForm.orderId = orderId || 0
        this.$http({
          url: this.$http.adornUrl('/sys/area/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if(data && data.code === 0){
            console.log(data)
            this.options = []
            data.areaList.forEach((item) => {
              if(item.childList){
                this.options.push(item)
              }
            })
          }
        }).then(()=>{
          this.$http({
            url: this.$http.adornUrl('/sys/insured/listAll'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              console.log(data)
              this.postRiskList = []
              data.list.forEach((item) => {
                this.postRiskList.push({
                  id: item.insuredId,
                  text: item.insuredComment + '￥' + item.insuredAmount
                })
              })
              this.dataForm.postRiskId = data.list[0].insuredId
            }
          }).then(()=>{
            this.$http({
              url: this.$http.adornUrl('/sys/bussiness/allList'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.postTypeList = []
                data.list.forEach((item) => {
                  this.postTypeList.push({
                    id: item.id,
                    name: item.bussinessName
                  })
                })
              }
            }).then(()=>{
              this.visible = true
              this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
              })
            })
          })
        }).then(() => {
          if (this.dataForm.orderId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/order/info/${this.dataForm.orderId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm = data.order
                this.dataForm.addressList = [data.order.postProvinceId, data.order.postCityId, data.order.postCountyId]
              }
            })
          }
        })
      },
    },
    components:{
      Uploader
    }
  }
</script>

<style scoped>
  .hidenbox{
    width:100%;
    height:100%;
    background:rgba(0,0,0,.5);
    position:fixed;
    top:0;
    left:0;
    z-index:3000;
  }
  .hidenimg{
    position:fixed;
    top:15%;
    left:15%;
    width:70%;
    height:70%;
    z-index:20;
    text-align: center;
    z-index:3000;
  }
  .hidenimg>img{
    height:100%;
    max-height:100%;
    max-width:100%;
  }
  .cha{
    columns: #333;
    position: fixed;
    top:15%;
    right:13%;
    font-size:30px;
    height:30px;
    width:30px;
    background:#fff;
    line-height: 30px;
    text-align: center;
    border-radius:50%;
    z-index:3000;
  }
</style>
