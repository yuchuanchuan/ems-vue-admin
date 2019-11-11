<template>
  <div class="ship-order">
    <el-form :inline="true" :model="dataShipForm">
      <el-form-item>
        <el-input v-model="dataShipForm.orderNumber" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataShipForm.mailNum" placeholder="快递单号" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="type == 1">
        <el-select v-model="dataShipForm.bigAreaId" multiple placeholder="办理大区" width="100%" clearable @change="getAreaInfo">
          <el-option
            v-for="item in bigAreaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="(type == 1  && dataShipForm.bigAreaId != '') || type == 2">
        <el-select v-model="dataShipForm.areaId" multiple placeholder="办理网点" width="100%" clearable>
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
          start-placeholder="付款开始日期"
          end-placeholder="付款结束日期"
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
      show-summary
      :summary-method="getSummaries"
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
        prop="payOrderId"
        header-align="center"
        align="center"
        label="支付单号">
      </el-table-column>
      <el-table-column
        prop="fundyPayId"
        header-align="center"
        align="center"
        label="退款单号">
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
        prop="bigAreaName"
        header-align="center"
        align="center"
        label="办理大区">
      </el-table-column>
      <el-table-column
        prop="areaName"
        header-align="center"
        align="center"
        label="办理网点">
      </el-table-column>
      <el-table-column
        prop="payType"
        header-align="center"
        align="center"
        label="交易类型">
        <template slot-scope="scope">
          <span v-if="scope.row.payType == 1">收入</span>
          <span v-if="scope.row.payType == 2">支出</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createPayTime"
        header-align="center"
        align="center"
        label="付款时间">
      </el-table-column>
      <el-table-column
        prop="fundyPayTime"
        header-align="center"
        align="center"
        label="退款时间">
      </el-table-column>
      <el-table-column
        prop="totalFee"
        header-align="center"
        align="center"
        label="支付金额">
        <template slot-scope="scope">
          <span>{{scope.row.totalFee / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fundyFee"
        header-align="center"
        align="center"
        label="退款金额">
        <template slot-scope="scope">
          <span>{{scope.row.fundyFee / 100}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="insuredAmount"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="运费金额">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.insuredAmount / 100}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="insuredRated"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="保费金额">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.insuredRated / 100}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="insuredTotal"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="邮寄总金额">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{(scope.row.insuredAmount + scope.row.insuredRated) / 100}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
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
        bigAreaList: [],
        dataShipForm:{
          orderNumber: '',
          phone: '',
          status: 2,
          startOrderTime: '',
          endOrderTime: '',
          areaId: [],
          bigAreaId: [],
          mailNum: ''
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
      this.getShipDataList(1)
      this.getBigAreaInfo()
      this.getAreaInfo()
    },
    methods: {
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        let insuredAmount = []
        let insuredRated = []
        let total = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          //this.closeList等等是后台返回的总的数据，然后取值到这里
          switch(column.property) {
            case "totalFee":
              insuredAmount = data.map(item => Number(item.totalFee / 100.00))
              sums[index] = insuredAmount.reduce((prev, curr) => {
                const value = Number(curr)
                if(!isNaN(value)){
                  return (parseInt(prev * 100) + parseInt(curr * 100)) / 100
                }else{
                  return prev
                }
              }, 0)
              break;
            case "fundyFee":
              insuredRated = data.map(item => Number(item.fundyFee / 100))
              sums[index] = insuredRated.reduce((prev, curr) => {
                const value = Number(curr)
                if(!isNaN(value)){
                  return (parseInt(prev * 100) + parseInt(curr * 100)) / 100
                }else{
                  return prev
                }
              }, 0)
              break;

            default:
              break;
          }


        });
        return sums;
      },
      // 获取数据列表
      getShipDataList (page) {
        if(this.createPayTime && this.createPayTime.length > 0){
          this.dataShipForm.startOrderTime = this.createPayTime[0]
          this.dataShipForm.endOrderTime = this.createPayTime[1]
        }else{
          this.dataShipForm.startOrderTime = ""
          this.dataShipForm.endOrderTime = ""
        }
        // 数据转换 areaId
        let multiAreaId = ''
        if(this.dataShipForm.areaId && this.dataShipForm.areaId.length > 0){
          multiAreaId = this.dataShipForm.areaId.join(',')
        }
        // 数据转换，大区bigAreaId
        let multiBigAreaId = ''
        if(this.dataShipForm.bigAreaId && this.dataShipForm.bigAreaId.length > 0){
          multiBigAreaId = this.dataShipForm.bigAreaId.join(',')
        }

        this.dataShipListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/order/financeList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': page,
            'limit': this.pageShipSize,
            'orderNumber': this.dataShipForm.orderNumber,
            'phone': this.dataShipForm.phone,
            'status': this.dataShipForm.status,
            'startOrderTime': this.dataShipForm.startOrderTime,
            'endOrderTime': this.dataShipForm.endOrderTime,
            'areaId': multiBigAreaId,  // 大区
            'handleAreaId': multiAreaId, // 网点
            'mailNum': this.dataShipForm.mailNum
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

      exportExcel(){
        if(this.createPayTime && this.createPayTime.length > 0){
          this.dataShipForm.startOrderTime = this.createPayTime[0]
          this.dataShipForm.endOrderTime = this.createPayTime[1]
        }else {
          this.dataShipForm.startOrderTime = ""
          this.dataShipForm.endOrderTime = ""
        }
        // 数据转换 areaId
        let multiAreaId = ''
        if(this.dataShipForm.areaId && this.dataShipForm.areaId.length > 0){
          multiAreaId = this.dataShipForm.areaId.join(',')
        }
        // 数据转换，大区bigAreaId
        let multiBigAreaId = ''
        if(this.dataShipForm.bigAreaId && this.dataShipForm.bigAreaId.length > 0){
          multiBigAreaId = this.dataShipForm.bigAreaId.join(',')
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
            window.location.href = this.$http.adornUrl('/sys/order/exportOrderFinance') + "?orderNumber="
              + this.dataShipForm.orderNumber + "&mailNum="
              + this.dataShipForm.mailNum + "&startOrderTime="
              + this.dataShipForm.startOrderTime + "&endOrderTime="
              + this.dataShipForm.endOrderTime + "&areaId="
              + multiBigAreaId + "&handleAreaId=" + multiAreaId
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      getBigAreaInfo(){
        this.$http({
          url: this.$http.adornUrl('/sys/bigarea/allList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.bigAreaList = []
          if(data && data.code === 0 && data.list && data.list.length > 0){
            data.list.forEach((item) => {
              this.bigAreaList.push({
                id: item.id,
                name: item.name
              })
            })
          }
        })
      },
      getAreaInfo(){
        // this.$http({
        //   url: this.$http.adornUrl('/sys/handlerArea/areaNameList'),
        //   method: 'get',
        //   params: this.$http.adornParams()
        // }).then(({ data }) => {
        //   this.areaList = []
        //   if(data && data.code === 0){
        //     data.regionList.forEach((item) => {
        //       this.areaList.push({
        //         id: item.id,
        //         name: item.handleArea
        //       })
        //     })
        //   }
        // })
        let url = ""
        if(this.type === 1){
          url = this.$http.adornUrl('/sys/handlerArea/areaNames')
          if(this.dataShipForm.bigAreaId.length === 0){
            this.dataShipForm.areaId = []
          }
        }else{
          url = this.$http.adornUrl('/sys/handlerArea/areaNameList')
        }
        this.$http({
          url: url,
          method: 'get',
          params: this.$http.adornParams({
            'areaId': this.type === 1 ? this.dataShipForm.bigAreaId.join(',') : ''
          })
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
