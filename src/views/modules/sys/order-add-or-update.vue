<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="135px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="dataForm.idCard" placeholder="身份证号"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="mobileCode">
        <el-input v-model="dataForm.mobileCode" placeholder="手机验证码"></el-input>
        <el-button type="primary" style="margin-top:20px;" @click="sendMsg">获取手机验证码</el-button>
      </el-form-item>
      <el-form-item label="产权人身份证正面" prop="ownerPositive">
        <Uploader v-model="dataForm.ownerPositive" :imgUrl="dataForm.ownerPositive?dataForm.ownerPositive:''"></Uploader>
      </el-form-item>
      <el-form-item label="产权人身份证反面" prop="ownerNegative">
        <!--<el-input v-model="dataForm.ownerNegative" placeholder="产权人身份证反面"></el-input>-->
        <Uploader v-model="dataForm.ownerNegative" :imgUrl="dataForm.ownerNegative?dataForm.ownerNegative:''"></Uploader>
      </el-form-item>
      <el-form-item label="房管局受理凭证" prop="housingAuthority">
        <!--<el-input v-model="dataForm.housingAuthority" placeholder="房管局受理凭证"></el-input>-->
        <Uploader v-model="dataForm.housingAuthority" :imgUrl="dataForm.housingAuthority?dataForm.housingAuthority:''"></Uploader>
      </el-form-item>
      <el-form-item label="邮寄类型" prop="postType">
        <el-select v-model="dataForm.postType" placeholder="请选择" width="100%">
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
        <el-radio-group v-model="dataForm.postRisk">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="投递费用" size="mini" prop="postRiskId" v-if="dataForm.postRisk === 1">
        <el-radio-group v-model="dataForm.postRiskId">
          <el-radio v-for="(item,index) in postRiskList" :key="index" :label="item.insuredId" border size="medium">{{item.insuredComment}}</el-radio>
        </el-radio-group>
      </el-form-item>



      <el-form-item label="收件地址" prop="addressList">
        <!--<el-input v-model="dataForm.postRisk" placeholder="是否投递保险"></el-input>-->
        <el-cascader
          v-model="dataForm.addressList"
          :options="options"
          @active-item-change="handleItemChange"
          :props="props"
          clearable
        ></el-cascader>
      </el-form-item>

      <el-form-item label="详细地址" prop="postAddress">
        <el-input v-model="dataForm.postAddress" placeholder="详细地址"></el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Uploader from '../../../components/Uploader/uploader'
  import { isIdCard, isMobile } from '@/utils/validate'
  export default {
    data(){
      var validateComfirmIdCard = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('身份证号码不能为空'))
        } else if (!isIdCard(value)) {
          callback(new Error('身份证号码格式不正确'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('手机号不能为空'))
        } else if (!isMobile(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
      return{
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
        postTypeList:[
          {id:1, name:'房本'},
          {id:2, name:'证书'},
          {id:3, name:'其他'}
        ],
        dataForm:{
          id: 0,
          name: '',
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
        dataRule: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          idCard: [
            { required: true, validator: validateComfirmIdCard, trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: validateMobile, trigger: 'blur' }
          ],
          mobileCode: [
            { required: true, message: '手机验证码不能为空', trigger: 'blur' }
          ],
          ownerPositive: [
            { required: true, message: '请上传产权人身份证正面', trigger: 'blur'}
          ],
          ownerNegative: [
            { required: true, message: '请上传产权人身份证反面', trigger: 'blur'}
          ],
          housingAuthority: [
            { required: true, message: '请上传房管局受理凭证', trigger: 'blur'}
          ],
          postType: [
            { required: true, message: '请选择邮寄类型', trigger: 'change'}
          ],
          postAddress: [
            { required: true, message: '详细地址不能为空', trigger: 'blur'}
          ],
          addressList: [
            { required: true, message: '收件地址不能为空', trigger: 'change', type:'array'}
          ]
        }
      }
    },
    methods:{
      init (id) {
        this.dataForm.id = id || 0
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
                  this.postRiskList.push(item)
                })
                this.dataForm.postRiskId = data.list[0].insuredId
              }
            }).then(()=>{
              this.visible = true
              this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
              })
            })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/order/info/${this.dataForm.id}`),
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
      dataFormSubmit(){
        console.log(this.dataForm.addressList)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.postProvinceId = this.dataForm.addressList[0]
            this.dataForm.postCityId = this.dataForm.addressList[1]
            this.dataForm.postCountyId = this.dataForm.addressList[2]

            this.$http({
              url: this.$http.adornUrl(`/sys/order/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      handleItemChange(val){

      },

      sendMsg(){
        console.log("-----------------" + this.dataForm.phone)
        this.$http({
          url: this.$http.adornUrl('/sendMsg'),
          method: 'get',
          params: this.$http.adornParams({
            'phone': this.dataForm.phone
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('验证码发送成功')
          } else {
            this.$message.error(data.msg)
          }
        })
      },
    },
    components:{
      Uploader
    }
  }
</script>

<style>

</style>
