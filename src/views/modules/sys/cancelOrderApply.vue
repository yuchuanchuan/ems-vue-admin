<template>
  <el-dialog
    :title="申请理由"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="退款理由" prop="cancelReason">
        <el-input v-model="dataForm.cancelReason" placeholder="退款理由" :maxlength="50" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          cancelReason: ''
        },
        dataRule: {
          cancelReason: [
            { required: true, message: '申请理由不能为空!', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/order/cancelOrderApply`),
              method: 'post',
              data: this.$http.adornData({
                'orderId': this.dataForm.id || undefined,
                'cancelReason': this.dataForm.cancelReason
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '退款申请中,请等待管理员审核！',
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
