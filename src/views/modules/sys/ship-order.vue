<template>
  <div class="ship-order">
    <el-form :inline="true" :model="dataShipForm">
      <el-form-item>
        <el-input v-model="dataShipForm.orderNumber" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataShipForm.idCard" placeholder="受理凭证号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataShipForm.applyName" placeholder="申请人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataShipForm.applyPhone" placeholder="申请人手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataShipForm.name" placeholder="收货人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataShipForm.phone" placeholder="收货人手机号" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="type == 1">
        <el-select v-model="dataShipForm.areaId" placeholder="办理地区" width="100%" clearable>
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataShipForm.postType" placeholder="邮寄类型" width="100%" clearable>
          <el-option
            v-for="item in postTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataShipForm.postRisk" placeholder="是否保价客户" width="100%" clearable>
          <el-option
            v-for="item in postRiskList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="createOrderTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="订单开始日期"
          end-placeholder="订单结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getShipDataList(1)">查询</el-button>
        <!--<el-button v-if="isAuth('sys:order:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataReceiptListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportExcel">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataShipList"
      border
      v-loading="dataShipListLoading"
      @selection-change="selectionShipChangeHandle"
      style="width: 100%;">
      <!--<el-table-column-->
      <!--type="selection"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--width="50">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="orderNumber"
        header-align="center"
        align="center"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="mailNum"
        header-align="center"
        align="center"
        label="快递单号">
      </el-table-column>
      <el-table-column
        prop="applyName"
        header-align="center"
        align="center"
        label="申请人">
      </el-table-column>
      <el-table-column
        prop="applyPhone"
        header-align="center"
        align="center"
        label="申请人电话">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="收货人">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="收货人电话">
      </el-table-column>
      <el-table-column
        prop="postAddress"
        header-align="center"
        align="center"
        label="收货地址">
      </el-table-column>
      <el-table-column
        prop="areaName"
        header-align="center"
        align="center"
        label="办理地区">
      </el-table-column>
      <el-table-column
        prop="createOrderTime"
        header-align="center"
        align="center"
        label="下单时间">
      </el-table-column>
      <el-table-column
        prop="idCard"
        header-align="center"
        align="center"
        width="180"
        label="凭证编号">
        <!--<template slot-scope="scope">-->
          <!--<img :src="scope.row.housingAuthority" alt="" width="100" height="100">-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        prop="postType"
        header-align="center"
        align="center"
        label="邮寄类型">
        <template slot-scope="scope">
          <span v-for="(item,index) in postTypeList" :key="index" v-if="item.id == scope.row.postType">{{item.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="postRisk"
        header-align="center"
        align="center"
        label="保价客户">
        <template slot-scope="scope">
          <span v-if="scope.row.postRisk === 1">是</span>
          <span v-if="scope.row.postRisk === 2">否</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="操作"
      >
        <template slot-scope="scope">
          <!-- 查看 -->
          <el-button v-if="isAuth('sys:order:info')" type="text" size="small" @click="viewOrder(scope.row.orderId)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageShipIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageShipSize"
      :total="totalShipPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 查看 -->
    <view-order v-if="viewOrderVisible" ref="viewOrder"></view-order>
  </div>
</template>

<script>
  import ViewOrder from './view-order.vue'
  export default {
    data(){
      return{
        activeName: 'third',
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                // start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
              }
            },{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一年',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                picker.$emit('pick', [start, end]);
              }
            }]
        },
        createOrderTime: [],
        areaList: [],
        postTypeList: [],
        postRiskList: [{
          id: 1,
          name: '是'
        },{
          id: 2,
          name: '否'
        }],
        dataShipForm:{
          orderNumber: '',
          idCard: '',
          applyName: '',
          applyPhone: '',
          name: '',
          phone: '',
          status: '2,6,7',
          startOrderTime: '',
          endOrderTime: '',
          areaId: '',
          postType: '',
          postRisk: ''
        },
        dataShipList: [],
        pageShipIndex: 1,
        pageShipSize: 10,
        totalShipPage: 0,
        dataShipListLoading: false,
        dataReceiptListSelections: [],
        addOrUpdateVisible: false,
        viewOrderVisible: false
      }
    },
    activated () {
      this.getPostTypeList()
      this.getAreaInfo()
      this.getShipDataList(1)
    },
    methods: {
      // 邮寄类型
      getPostTypeList(){
        this.$http({
          url: this.$http.adornUrl('/sys/bussiness/allList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.postTypeList = []
          if(data && data.code === 0){
            data.list.forEach((item) => {
              this.postTypeList.push({
                id: item.id,
                name: item.bussinessName
              })
            })
          }
        })
      },
      // 获取数据列表
      getShipDataList (page) {
        if(this.createOrderTime && this.createOrderTime.length > 0){
          this.dataShipForm.startOrderTime = this.createOrderTime[0]
          this.dataShipForm.endOrderTime = this.createOrderTime[1]
        }else{
          this.dataShipForm.startOrderTime = ""
          this.dataShipForm.endOrderTime = ""
        }

        this.dataShipListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/order/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'limit': this.pageShipSize,
            'orderNumber': this.dataShipForm.orderNumber,
            'idCard': this.dataShipForm.idCard,
            'applyName': this.dataShipForm.applyName,
            'applyPhone': this.dataShipForm.applyPhone,
            'name': this.dataShipForm.name,
            'phone': this.dataShipForm.phone,
            'status': this.dataShipForm.status,
            'startOrderTime': this.dataShipForm.startOrderTime,
            'endOrderTime': this.dataShipForm.endOrderTime,
            'areaId': this.dataShipForm.areaId,
            'postType': this.dataShipForm.postType,
            'postRisk': this.dataShipForm.postRisk
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataShipList = data.page.list
            this.totalShipPage = data.page.totalCount
          } else {
            this.dataShipList = []
            this.totalShipPage = 0
          }
          this.dataShipListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageShipSize = val
        this.pageShipIndex = 1
        this.getShipDataList(this.pageShipIndex)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageShipIndex = val
        this.getShipDataList(this.pageShipIndex)
      },
      // 多选
      selectionShipChangeHandle (val) {
        this.dataReceiptListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataReceiptListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/order/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getShipDataList(1)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      exportExcel(){
        if(this.createOrderTime && this.createOrderTime.length > 0){
          this.dataShipForm.startOrderTime = this.createOrderTime[0]
          this.dataShipForm.endOrderTime = this.createOrderTime[1]
        }else {
          this.dataShipForm.startOrderTime = ""
          this.dataShipForm.endOrderTime = ""
        }
        let orderIdList = []
        let orderIdStr = ""
        this.dataReceiptListSelections.forEach((item) => {
          orderIdList.push(item.orderId)
        })
        orderIdStr = orderIdList.join(',')

        this.$http({
          url: this.$http.adornUrl('/sys/order/exportInfo'),
          method: 'get',
          params: this.$http.adornParams({
            'startOrderTime': this.dataShipForm.startOrderTime,
            'endOrderTime': this.dataShipForm.endOrderTime,
            'status': this.dataShipForm.status
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$confirm(`是否打包下载证照图片?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {

              this.downloadFile(this.$http.adornUrl('/sys/order/exportOrder') + "?startOrderTime="
                + this.dataShipForm.startOrderTime + "&endOrderTime=" + this.dataShipForm.endOrderTime
                + "&status=" + this.dataShipForm.status + "&orderIdStr=" + orderIdStr)

              this.downloadFile(this.$http.adornUrl('/sys/order/downFileZip') + "?startOrderTime="
                + this.dataShipForm.startOrderTime + "&endOrderTime=" + this.dataShipForm.endOrderTime
                + "&status=" + this.dataShipForm.status + "&orderIdStr=" + orderIdStr)

            }).catch(()=>{
              window.location.href = this.$http.adornUrl('/sys/order/exportOrder') + "?startOrderTime="
                + this.dataShipForm.startOrderTime + "&endOrderTime=" + this.dataShipForm.endOrderTime
                + "&status=" + this.dataShipForm.status + "&orderIdStr=" + orderIdStr
              // + "&downZip=2"
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      getAreaInfo(){
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
      },
      // 查看订单
      viewOrder(id){
        this.viewOrderVisible = true
        this.$nextTick(() => {
          this.$refs.viewOrder.init(id)
        })
      }
    },
    components: {
      ViewOrder
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
