<template>
  <el-dialog
    :title="!dataForm.orderId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="135px">
      <el-form-item label="产权人姓名" prop="applyName">
        <el-input v-model="dataForm.applyName" placeholder="产权人姓名"></el-input>
      </el-form-item>
      <el-form-item label="产权人手机号" prop="applyPhone">
        <el-input v-model="dataForm.applyPhone" placeholder="产权人手机号"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="propertyNo">
        <el-input v-model="dataForm.propertyNo" placeholder="身份证号"></el-input>
      </el-form-item>
      <el-form-item label="凭证编号" prop="idCard">
        <el-input v-model="dataForm.idCard" placeholder="凭证编号"></el-input>
      </el-form-item>

      <el-form-item label="产权人身份证正面" prop="ownerPositive">
        <Uploader ref="uploadPositive" v-model="dataForm.ownerPositive" :imgUrl="idCardImg1" :applyName="dataForm.applyName" :fileType="1"></Uploader>
      </el-form-item>
      <el-form-item label="产权人身份证反面" prop="ownerNegative">
        <!--<el-input v-model="dataForm.ownerNegative" placeholder="产权人身份证反面"></el-input>-->
        <Uploader ref="uploadNegative" v-model="dataForm.ownerNegative" :imgUrl="idCardImg2" :fileType="1" :applyName="dataForm.applyName"></Uploader>
      </el-form-item>
      <el-form-item label="房管局受理凭证" prop="housingAuthority">
        <!--<el-input v-model="dataForm.housingAuthority" placeholder="房管局受理凭证"></el-input>-->
        <Uploader ref="uploadAuthority" v-model="dataForm.housingAuthority" :imgUrl="houseImg" :fileType="2" :applyName="dataForm.applyName"></Uploader>
      </el-form-item>

      <el-form-item label="收货人姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="收货人姓名"></el-input>
      </el-form-item>
      <el-form-item label="收货人手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="收货人手机号"></el-input>
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

      <!--<el-form-item label="详细地址" prop="postAddress">-->
      <!--<el-input v-model="dataForm.postAddress" placeholder="详细地址"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="街道/路" prop="street">
        <el-input v-model="dataForm.street" placeholder="街道/路"></el-input>
      </el-form-item>
      <el-form-item label="门牌号" prop="houseNum">
        <el-input v-model="dataForm.houseNum" placeholder="门牌号"></el-input>
      </el-form-item>
      <!---->
      <!--<el-form-item label="验证码" prop="mobileCode">-->
        <!--<el-input v-model="dataForm.mobileCode" placeholder="手机验证码"></el-input>-->
        <!--<el-button type="primary" style="margin-top:20px;" @click="sendMsg">获取手机验证码</el-button>-->
      <!--</el-form-item>-->

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

      <el-form-item label="投递费用" size="mini" prop="postRiskId">
        <el-radio-group v-model="dataForm.postRiskId">
          <el-radio v-for="(item,index) in postRiskList" :key="index" :label="item.id" border size="medium">{{item.text}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--<el-form-item label="办理地区" v-if="type == 1" size="mini" prop="areaId">-->
        <!--<el-select v-model="dataForm.handleAreaId" placeholder="办理地区" width="100%" clearable>-->
          <!--<el-option-->
            <!--v-for="item in areaList"-->
            <!--:key="item.id"-->
            <!--:label="item.name"-->
            <!--:value="item.id">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item label="所属区域" prop="areaId" v-if="type == 1">
        <el-select v-model="dataForm.areaId" clearable placeholder="请选择" width="100%" @change="selectAreaList">
          <el-option
            v-for="item in bigAreaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属网点" prop="handleAreaId" v-if="(type == 1 && dataForm.areaId) || type == 2">
        <el-select v-model="dataForm.handleAreaId" clearable placeholder="请选择" width="100%">
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
      var validateApplyMobile = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('产权人手机号不能为空'))
        } else if (!isMobile(value)) {
          callback(new Error('产权人手机号码格式不正确'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!/\S/.test(value)) {
          callback(new Error('收货人手机号不能为空'))
        } else if (!isMobile(value)) {
          callback(new Error('收货人手机号码格式不正确'))
        } else {
          callback()
        }
      }
      return{
        idCardImg1: '',
        idCardImg2: '',
        houseImg: '',
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
        areaList: [],
        bigAreaList: [],
        postTypeList:[],
        dataForm:{
          orderId: 0,
          name: '',
          propertyNo: '', // 身份证号
          idCard: '',
          phone: '',
          // mobileCode: '',
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
          addressList: [],
          street: '',
          houseNum: '',
          areaId: '',
          handleAreaId: '',
          applyName: '',
          applyPhone: ''
        },
        dataRule: {
          name: [
            { required: true, message: '收货人姓名不能为空', trigger: 'blur' }
          ],
          propertyNo:[
            { required: true, validator: validateComfirmIdCard, trigger: 'blur' }
          ],
          idCard: [
            { required: true, message: '凭证编号不能为空', trigger: 'blur'  }
          ],
          phone: [
            { required: true, validator: validateMobile, trigger: 'blur' }
          ],
          // mobileCode: [
          //   { required: true, message: '手机验证码不能为空', trigger: 'blur' }
          // ],
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
          // postAddress: [
          //   { required: true, message: '详细地址不能为空', trigger: 'blur'}
          // ],
          street: [
            { required: true, message: '街道/路不能为空', trigger: 'blur'}
          ],
          houseNum: [
            { required: true, message: '门牌号不能为空', trigger: 'blur'}
          ],
          addressList: [
            { required: true, message: '收件地址不能为空', trigger: 'change', type:'array'}
          ],
          applyName: [
            { required: true, message: '产权人信息不能为空', trigger: 'blur'}
          ],
          applyPhone: [
            { required: true, validator: validateApplyMobile, trigger: 'blur' }
          ],
          areaId: [
            { required: true, message: '请选择办理地区', trigger: 'change'}
          ],
          handleAreaId: [
            { required: true, message: '请选择办理网点', trigger: 'change'}
          ]
        }
      }
    },
    methods:{
      selectAreaList(){
        this.$http({
          url: this.$http.adornUrl('/sys/handlerArea/areaNameList'),
          method: 'get',
          params: this.$http.adornParams({
            'areaId': this.dataForm.areaId
          })
        }).then(({ data }) => {
          this.dataForm.handleAreaId = ''
          this.areaList = []
          if(data && data.code === 0 && data.regionList && data.regionList.length > 0){
            data.regionList.forEach((item) => {
              this.areaList.push({
                id: item.id,
                name: item.handleArea
              })
            })
          }
        })
      },
      // listAll(){
      //   this.$http({
      //     url: this.$http.adornUrl('/sys/insured/listAll'),
      //     method: 'get',
      //     params: this.$http.adornParams()
      //   }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       console.log(data)
      //       this.postRiskList = []
      //       data.list.forEach((item) => {
      //         this.postRiskList.push({
      //           id: item.insuredId,
      //           text: item.insuredComment + '￥' + item.insuredAmount
      //         })
      //       })
      //       this.dataForm.postRiskId = data.list[0].insuredId
      //     }
      //   })
      // },
      // allList(){
      //   this.$http({
      //     url: this.$http.adornUrl('/sys/bussiness/allList'),
      //     method: 'get',
      //     params: this.$http.adornParams()
      //   }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       this.postTypeList = []
      //       data.list.forEach((item) => {
      //         this.postTypeList.push({
      //           id: item.id,
      //           name: item.bussinessName
      //         })
      //       })
      //     }
      //   })
      // },
      init (orderId) {
        this.dataForm.orderId = orderId || 0
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
          })
        }).then(()=>{
          if(this.type === 1){
            this.$http({
              url: this.$http.adornUrl('/sys/bigarea/allList'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              this.bigAreaList = []
              if(data && data.code === 0 && data.list && data.list.length > 0){
                data.list.forEach((item) => {
                  this.bigAreaList.push({
                    id: item.id,
                    name: item.name
                  })
                })
              }
            })
          }
          if(this.type === 2){
            this.$http({
              url: this.$http.adornUrl('/sys/handlerArea/areaNameList'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              this.areaList = []
              if(data && data.code === 0){
                data.regionList.forEach((item) => {
                  this.areaList.push({
                    id: item.id,
                    name: item.handleArea
                  })
                })
              }
            })
          }
        }).then(()=>{
          this.visible = true
          this.$nextTick(() => {
            this.$refs.uploadPositive.imageUrl = ''
            this.$refs.uploadNegative.imageUrl = ''
            this.$refs.uploadAuthority.imageUrl = ''
            this.idCardImg1 = ''
            this.idCardImg2 = ''
            this.houseImg = ''
            this.$refs['dataForm'].resetFields()
          })
        }).then(()=>{
          if (this.dataForm.orderId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/order/info/${this.dataForm.orderId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm = data.order
                this.idCardImg1 = decodeURIComponent("http://ems.tjeasytech.cn/" + data.order.ownerPositive)
                this.idCardImg2 = decodeURIComponent("http://ems.tjeasytech.cn/" + data.order.ownerNegative)
                this.houseImg = decodeURIComponent("http://ems.tjeasytech.cn/zip/受理凭证/" + data.order.housingAuthority)
                this.dataForm.addressList = [data.order.postProvinceId, data.order.postCityId, data.order.postCountyId]
              }
            })
          }
        })


        // this.$http({
        //   url: this.$http.adornUrl('/sys/area/list'),
        //   method: 'get',
        //   params: this.$http.adornParams()
        // }).then(({ data }) => {
        //   if (data && data.code === 0) {
        //     console.log(data)
        //     this.options = []
        //     data.areaList.forEach((item) => {
        //       if (item.childList) {
        //         this.options.push(item)
        //       }
        //     })
        //   }
        // }).then(() => {
        //   this.visible = true
        //   this.$nextTick(() => {
        //     this.$refs.uploadPositive.imageUrl = ''
        //     this.$refs.uploadNegative.imageUrl = ''
        //     this.$refs.uploadAuthority.imageUrl = ''
        //     this.idCardImg1 = ''
        //     this.idCardImg2 = ''
        //     this.houseImg = ''
        //     this.$refs['dataForm'].resetFields()
        //   })
        // }).then(() => {
        //   if (this.dataForm.orderId) {
        //     this.$http({
        //       url: this.$http.adornUrl(`/sys/order/info/${this.dataForm.orderId}`),
        //       method: 'get',
        //       params: this.$http.adornParams()
        //     }).then(({ data }) => {
        //       if (data && data.code === 0) {
        //         this.dataForm = data.order
        //         this.idCardImg1 = decodeURIComponent("http://ems.tjeasytech.cn/" + data.order.ownerPositive)
        //         this.idCardImg2 = decodeURIComponent("http://ems.tjeasytech.cn/" + data.order.ownerNegative)
        //         this.houseImg = decodeURIComponent("http://ems.tjeasytech.cn/zip/受理凭证/" + data.order.housingAuthority)
        //         this.dataForm.addressList = [data.order.postProvinceId, data.order.postCityId, data.order.postCountyId]
        //       }
        //     })
        //   }
        // })
      },
      //
      //   console.log('orderid==========' + orderId)
      //   this.dataForm.orderId = orderId || 0
      //   console.log('--------' + this.dataForm.orderId)
      //   this.$http({
      //     url: this.$http.adornUrl('/sys/area/list'),
      //     method: 'get',
      //     params: this.$http.adornParams()
      //   }).then(({ data }) => {
      //     if(data && data.code === 0){
      //       console.log(data)
      //       this.options = []
      //       data.areaList.forEach((item) => {
      //         if(item.childList){
      //           this.options.push(item)
      //         }
      //       })
      //     }
      //   }).then(()=>{
      //
      //   }).then(()=>{
      //
      //
      //   }).then(()=>{
      //
      //         })
      //       })
      //   }).then(() => {
      //     if (this.dataForm.orderId) {
      //       console.log('放奇怪  111')
      //       this.$http({
      //         url: this.$http.adornUrl(`/sys/order/info/${this.dataForm.orderId}`),
      //         method: 'get',
      //         params: this.$http.adornParams()
      //       }).then(({ data }) => {
      //         if (data && data.code === 0) {
      //           // this.dataForm = data.order
      //           this.dataForm.orderId = data.order.orderId
      //           this.dataForm.name = data.order.name
      //           this.dataForm.propertyNo = data.order.propertyNo
      //
      //             // propertyNo: '', // 身份证号
      //             // idCard: '',
      //             // phone: '',
      //             // mobileCode: '',
      //             // ownerPositive: '',
      //             // ownerNegative: '',
      //             // housingAuthority: '',
      //             // postType: '',
      //             // postRisk: 1,
      //             // postRiskId: '',
      //             // postProvinceId: '',
      //             // postCityId: '',
      //             // postCountyId: '',
      //             // postAddress: '',
      //
      //           this.idCardImg1 = decodeURIComponent("http://ems.tjeasytech.cn/" + data.order.ownerPositive)
      //           this.idCardImg2 = decodeURIComponent("http://ems.tjeasytech.cn/" + data.order.ownerNegative)
      //           this.houseImg = decodeURIComponent("http://ems.tjeasytech.cn/zip/受理凭证/" + data.order.housingAuthority)
      //           this.dataForm.addressList = [data.order.postProvinceId, data.order.postCityId, data.order.postCountyId]
      //         }
      //       })
      //     }
      //   })
      // },
      dataFormSubmit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.postProvinceId = this.dataForm.addressList[0]
            this.dataForm.postCityId = this.dataForm.addressList[1]
            this.dataForm.postCountyId = this.dataForm.addressList[2]

            // if(this.dataForm.postRisk === 2){
            //   this.dataForm.postRiskId = 0
            // }

            this.$http({
              url: this.$http.adornUrl(`/sys/order/${!this.dataForm.orderId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                if(this.dataForm.orderId == '' || this.dataForm.status === 1){
                  let title = ''
                  if(data.totalRate == ''){
                    title = "您的订单已创建成功，请在柜台前支付运费共计" + data.totalAmount + "元"
                  }else{
                    title = "您的订单已创建成功，请在柜台前支付费用共计" + (data.totalAmount + data.totalRate) + "元," +
                      "其中包含运费" + data.totalAmount +"元和保险费用" + data.totalRate +"元"
                  }
                  this.$confirm(title, '提示', {
                    confirmButtonText: '支付完成',
                    // cancelButtonText: '取消',
                    type: 'info'
                  }).then(() => {
                    this.$http({
                      url: this.$http.adornUrl('/sys/order/updateOrderState'),
                      method: 'get',
                      params: this.$http.adornParams({
                        'orderId': data.orderId
                      })
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
                      }
                    })
                  }).catch(()=>{
                    this.visible = false
                    this.$emit('refreshDataList')
                  })
                }else{
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                    }
                  })
                }
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
            this.$message.error(data.msg)
          }
        })
      },
    },
    computed: {
      type: {
        get () { return this.$store.state.user.type }
      }
    },
    components:{
      Uploader
    }
  }
</script>

<style>

</style>
