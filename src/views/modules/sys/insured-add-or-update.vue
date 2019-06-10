<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="投保金额" prop="insuredAmount">
        <el-input-number v-model="dataForm.insuredAmount" :step="1" :min="1" :disabled="type != 1"></el-input-number>
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
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          insuredAmount: '',
          insuredComment: ''
        },
        dataRule: {
          insuredAmount: [
            { required: true, message: '投保金额不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        console.log('--------------')
        console.log(id)
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/insured/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.insuredAmount = data.insuredEntity.insuredAmount
              this.dataForm.insuredComment = data.insuredEntity.insuredComment
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/insured/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'insuredId': this.dataForm.id || undefined,
                'insuredAmount': this.dataForm.insuredAmount,
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
