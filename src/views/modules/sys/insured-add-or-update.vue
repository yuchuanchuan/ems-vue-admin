<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="投保金额" prop="insuredAmount">
        <el-input v-model="dataForm.insuredAmount" :disabled="type != 1"></el-input>
      </el-form-item>
      <el-form-item label="投保金额">
        <el-input v-model="dataForm.insuredRate" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="保单介绍">
        <el-input v-model="dataForm.insuredComment" placeholder="保单介绍" :maxlength="500" type="textarea" :disabled="type != 1"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isNum2 } from '@/utils/validate'
  export default {
    data () {
      const validateAmount = (rule, value, callback) => {
        if (value && !isNum2(value)) {
          callback(new Error('运费为大于0且最多保留两位小数'))
        } else {
          this.dataForm.insuredAmount = this.dataForm.insuredAmount * 100 / 100
          this.dataForm.insuredAmount = this.dataForm.insuredAmount.toFixed(2)
          let rate = this.dataForm.insuredAmount * 0.005
          if(rate >= 1){
            this.dataForm.insuredRate = rate
          }else{
            this.dataForm.insuredRate = 1
          }
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: 0,
          insuredAmount: '',
          insuredRate: '',
          insuredComment: ''
        },
        dataRule: {
          insuredAmount: [
            { required: true, message: '运费不能为空', trigger: 'blur' },
            { validator: validateAmount, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.dataForm.insuredRate = ''
          this.dataForm.insuredComment = ''
          this.$refs['dataForm'].resetFields()
        })
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/insured/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.insuredAmount = data.insuredEntity.insuredAmount / 100
              this.dataForm.insuredRate = data.insuredEntity.insuredRate / 100
              this.dataForm.insuredComment = data.insuredEntity.insuredComment
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          console.log(this.dataForm.insuredRate.toFixed(2))
          let insuredRateNum = this.dataForm.insuredRate.toFixed(2) * 100
          let insuredAmountNum = this.dataForm.insuredAmount * 100
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/insured/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'insuredId': this.dataForm.id || undefined,
                'insuredAmount': insuredAmountNum,
                'insuredRate': insuredRateNum,
                'insuredComment': this.dataForm.insuredComment
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
