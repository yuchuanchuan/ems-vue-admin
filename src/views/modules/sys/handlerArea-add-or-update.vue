<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="所属区域" prop="areaId">
        <el-select v-model="dataForm.areaId" placeholder="请选择" width="100%">
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="受理地点" prop="handleAddress">
        <el-input v-model="dataForm.handleAddress" placeholder="受理地点名称"></el-input>
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
    data(){
      return{
        visible: false,
        areaList: [],
        dataForm: {
          id: 0,
          areaId: '',
          handleAddress: ''
        },
        dataRule: {
          areaId: [
            { required: true, message: '受理地区不能为空', trigger: 'change' }
          ],
          handleAddress: [
            { required: true, message: '受理地点名称不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    methods:{
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/area/region'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.areaList = []
          if(data && data.code === 0 && data.regionList && data.regionList.length > 0){
            data.regionList[0].childList.forEach((item) => {
              this.areaList.push({
                id: item.id,
                name: item.name
              })
            })
          }
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/handlerArea/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.areaId = data.handleAreaEntity.areaId
                this.dataForm.handleAddress = data.handleAreaEntity.handleAddress
              }
            })
          }
        })
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/handlerArea/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'areaId': this.dataForm.areaId,
                'handleAddress': this.dataForm.handleAddress
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
