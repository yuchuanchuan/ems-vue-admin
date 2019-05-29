<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 投保金额设置</span>
        <el-form :model="dataForm" status-icon label-width="100px" class="dataForm" ref="dataForm">
          <el-form-item label="投保金额" prop="insuredAmount">
            <el-input-number v-model="dataForm.insuredAmount" :step="1" :min="1" :disabled="type != 1"></el-input-number>
          </el-form-item>
          <el-form-item label="保单介绍" prop="insuredAmount">
            <el-input v-model="dataForm.insuredComment" placeholder="保单介绍" :maxlength="500" type="textarea" :disabled="type != 1"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('sys:insured:update') && type == 1" type="primary" @click="submitForm()">保存</el-button>
            <el-button v-if="type == 1" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
  export default {
    data(){
      return{
        dataForm:{
          insuredId: '',
          insuredAmount: '',
          insuredComment: ''
        }
      }
    },
    methods:{
      submitForm(){
        this.$http({
          url: this.$http.adornUrl(`/sys/insured/${!this.dataForm.insuredId ? 'save' : 'update'}`),
          method: 'post',
          data: this.$http.adornData({
            'insuredId': this.dataForm.insuredId || undefined,
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
                this.getInsuredInfo()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      resetForm(){
        this.dataForm.insuredAmount = ''
        this.dataForm.insuredComment = ''
      },
      getInsuredInfo(){
        this.$http({
          url: this.$http.adornUrl(`/sys/insured/list`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if(data && data.code === 0){
            if(data.insuredEntity){
              this.dataForm.insuredId = data.insuredEntity.insuredId
              this.dataForm.insuredAmount = data.insuredEntity.insuredAmount
              this.dataForm.insuredComment = data.insuredEntity.insuredComment
            }
          }
        })
      }
    },
    activated () {
      this.getInsuredInfo()
    },
    computed: {
      type: {
        get () { return this.$store.state.user.type }
      }
    },
  }
</script>

<style scoped>

</style>
