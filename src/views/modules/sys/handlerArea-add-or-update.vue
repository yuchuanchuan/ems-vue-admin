<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
      <el-form-item label="办理大区" prop="areaId" v-if="type == 1">
        <!--<el-input v-model="dataForm.areaId" placeholder="受理地点名称"></el-input>-->
        <el-select v-model="dataForm.areaId" placeholder="请选择" width="100%" clearable>
          <el-option
            v-for="item in areaType"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="办理网点" prop="handleArea">
        <el-input v-model="dataForm.handleArea" placeholder="受理地区名称"></el-input>
      </el-form-item>
      <el-form-item label="网点地址" prop="handleAddress">
        <el-input v-model="dataForm.handleAddress" placeholder="受理地点名称"></el-input>
      </el-form-item>
      <el-form-item label="不动产登记系统地区代号" prop="systemNo">
        <el-input v-model="dataForm.systemNo" placeholder="不动产登记系统地区代号"></el-input>
      </el-form-item>
      <el-form-item label="是否收取邮寄费用" size="mini">
        <el-radio-group v-model="dataForm.hasFree">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
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
  export default {
    data(){
      return{
        visible: false,
        areaType:[],
        areaList: [],
        dataForm: {
          id: 0,
          areaId: '',
          handleAddress: '',
          systemNo: '',
          handleArea: '',
          hasFree: 1,
        },
        dataRule: {
          areaId: [
            { required: true, message: '请选择受理大区', trigger: 'change' }
          ],
          handleArea: [
            { required: true, message: '受理地区不能为空', trigger: 'blur' }
          ],
          handleAddress: [
            { required: true, message: '受理地点名称不能为空', trigger: 'blur' }
          ],
          systemNo: [
            { required: true, message: '不动产登记系统地区代号不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    methods:{
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/bigarea/allList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.areaType = []
          if(data && data.code === 0 && data.list && data.list.length > 0){
            data.list.forEach((item) => {
              this.areaType.push({
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
                this.dataForm.systemNo = data.handleAreaEntity.systemNo
                this.dataForm.handleArea = data.handleAreaEntity.handleArea,
                this.dataForm.hasFree = data.handleAreaEntity.hasFree
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
                'handleAddress': this.dataForm.handleAddress,
                'systemNo': this.dataForm.systemNo,
                'handleArea': this.dataForm.handleArea,
                'hasFree': this.dataForm.hasFree
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

<style scoped>

</style>
