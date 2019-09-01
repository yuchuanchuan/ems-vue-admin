<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="用户名" :disabled="dataForm.id !== 0"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <!--<el-form-item label="用户类型" size="mini">-->
        <!--<el-radio-group v-model="roleId">-->
          <!--<el-radio v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-radio>-->
        <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item label="所属区域" prop="areaId" v-if="type == 1">
        <el-select v-model="dataForm.areaId" placeholder="请选择" width="100%">
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (value && !isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (value && !isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        areaList: [],
        // roleId: 1,
        // type: '',
        dataForm: {
          id: 0,
          userName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          phone: '',
          areaId: '',
          type: '',
          roleIdList: [],
          status: 1
        },
        dataRule: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' }
          ],
          phone: [
            { validator: validateMobile, trigger: 'blur' }
          ],
          areaId: [
            { required: true, message: '请选择地区', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (type,id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
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
        }).then(()=>{
          if(type === 1){
            this.dataForm.type = 2  //  2代表区管理员
          }
          if(type === 2){
            this.dataForm.type = 3   // 3代表区域信息管理员
          }
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.userName
                this.dataForm.salt = data.user.salt
                this.dataForm.email = data.user.email
                this.dataForm.phone = data.user.phone
                this.dataForm.areaId = data.user.areaId
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.status = data.user.status
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.roleIdList = []
            this.dataForm.roleIdList.push(this.dataForm.type)
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'userName': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'phone': this.dataForm.phone,
                'areaId': this.dataForm.areaId,
                'type': this.dataForm.type,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList
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
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    },
    computed: {
      type: {
        get () { return this.$store.state.user.type }
      }
    }
  }
</script>
