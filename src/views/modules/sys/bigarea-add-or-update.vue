<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="150px">
      <el-form-item label="大区名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="大区名称"></el-input>
      </el-form-item>
      <el-form-item label="大区代号">
        <el-input v-model="dataForm.code" placeholder="大区代号"></el-input>
      </el-form-item>
      <el-form-item label="大区地点">
        <el-input v-model="dataForm.address" placeholder="大区地点"></el-input>
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
          name: '',
          code: '',
          address: ''
        },
        dataRule: {
          name: [
            { required: true, message: '大区名称不能为空', trigger: 'blur' }
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
          this.dataForm.name =''
          this.dataForm.code = ''
          this.dataForm.address = ''
        })
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/bigarea/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.bigAreaEntity.name
              this.dataForm.code = data.bigAreaEntity.code
              this.dataForm.address = data.bigAreaEntity.address
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/bigarea/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'code': this.dataForm.code,
                'address': this.dataForm.address
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
    }
  }
</script>

<style scoped>

</style>
