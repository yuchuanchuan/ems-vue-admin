<template>
  <div class="ship-order">
    <el-form :inline="true" :model="dataShipForm">
      <el-form-item>
        <el-input v-model="dataShipForm.orderNumber" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-input v-model="dataShipForm.phone" placeholder="手机号" clearable></el-input>-->
      <!--</el-form-item>-->
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
        <el-date-picker
          v-model="createPayTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="付款开发日期"
          end-placeholder="付款结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getShipDataList()">查询</el-button>
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
        prop="orderNum"
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
        prop="areaName"
        header-align="center"
        align="center"
        label="办理地区">
      </el-table-column>
      <el-table-column
        prop="createPayTime"
        header-align="center"
        align="center"
        label="付款时间">
      </el-table-column>
      <el-table-column
        prop="insuredAmount"
        header-align="center"
        align="center"
        label="运费金额">
        <template slot-scope="scope">
          <span>{{scope.row.insuredAmount / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="insuredRated"
        header-align="center"
        align="center"
        label="保费金额">
        <template slot-scope="scope">
          <span>{{scope.row.insuredRated / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="insuredRated"
        header-align="center"
        align="center"
        label="邮寄总金额">
        <template slot-scope="scope">
          <span>{{(scope.row.insuredAmount + scope.row.insuredRated) / 100}}</span>
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
        createPayTime: [],
        areaList: [],
        dataShipForm:{
          orderNumber: '',
          phone: '',
          status: 2,
          startOrderTime: '',
          endOrderTime: '',
          areaId: ''
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
      this.getShipDataList()
      this.getAreaInfo()
    },
    methods: {
      // 获取数据列表
      getShipDataList () {
        if(this.createPayTime && this.createPayTime.length > 0){
          this.dataShipForm.startOrderTime = this.createPayTime[0]
          this.dataShipForm.endOrderTime = this.createPayTime[1]
        }else{
          this.dataShipForm.startOrderTime = ""
          this.dataShipForm.endOrderTime = ""
        }

        this.dataShipListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/order/financeList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageShipIndex,
            'limit': this.pageShipSize,
            'orderNumber': this.dataShipForm.orderNumber,
            'phone': this.dataShipForm.phone,
            'status': this.dataShipForm.status,
            'startOrderTime': this.dataShipForm.startOrderTime,
            'endOrderTime': this.dataShipForm.endOrderTime,
            'areaId': this.dataShipForm.areaId
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
        this.getShipDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageShipIndex = val
        this.getShipDataList()
      },
      // 多选
      selectionShipChangeHandle (val) {
        this.dataReceiptListSelections = val
      },

      exportExcel(){
        if(this.createPayTime && this.createPayTime.length > 0){
          this.dataShipForm.startOrderTime = this.createPayTime[0]
          this.dataShipForm.endOrderTime = this.createPayTime[1]
        }else {
          this.dataShipForm.startOrderTime = ""
          this.dataShipForm.endOrderTime = ""
        }
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
            window.location.href = this.$http.adornUrl('/sys/order/exportOrderFinance') + "?startOrderTime="
              + this.dataShipForm.startOrderTime + "&endOrderTime=" + this.dataShipForm.endOrderTime
              + "&status=" + this.dataShipForm.status
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
                id: item.areaId,
                name: item.areaName
              })
            })
          }
        })
      }
    },
    components: {

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
