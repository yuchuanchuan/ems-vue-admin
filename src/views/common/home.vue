<template>
  <div class="mod-home">
    <el-form :inline="true">
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
      <el-form-item v-if="type == 1">
        <el-select v-model="bigAreaId" multiple placeholder="办理大区" width="100%" clearable @change="getAreaInfo">
          <el-option
            v-for="item in bigAreaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="(type == 1  && bigAreaId != '') || type == 2">
        <el-select v-model="areaId" multiple placeholder="办理网点" width="100%" clearable>
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getOrderCount()" v-if="type != 1">查询</el-button>
        <el-button @click="getDataList()" v-if="type === 1">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card class="box-card" v-if="type != 1">
      <div slot="header" class="clearfix">
        <span>订单数据统计</span>
      </div>
      <el-row>
        <el-col :span="12">
          <div style="text-align: center">
            <schart canvasId="canvas1"
                    :style="{height:'450px'}"
                    :data="data"
                    :options="options"
            ></schart>
          </div>
        </el-col>

        <el-col :span="10" :offset="2">
          <schart canvasId="canvas2"
                  :style="{height:'400px'}"
                  :data="data"
                  :options="options1"
          ></schart>
        </el-col>
      </el-row>
    </el-card>

    <div v-if="type == 1">
      <el-table
        show-summary
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <!--<el-table-column-->
        <!--type="selection"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="50">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="areaName"
          header-align="center"
          align="center"
          label="办理地区">
        </el-table-column>
        <el-table-column
          prop="address"
          header-align="center"
          align="center"
          label="办理地点">
        </el-table-column>
        <el-table-column
          prop="noRisk"
          header-align="center"
          align="center"
          label="未投递保险单数">
        </el-table-column>
        <el-table-column
          prop="hasRisk"
          header-align="center"
          align="center"
          label="已投递保险单数">
        </el-table-column>
        <el-table-column
          prop="reviceRate"
          header-align="center"
          align="center"
          label="妥投率">
        </el-table-column>
        <el-table-column
          prop="countOrder"
          header-align="center"
          align="center"
          label="总单数">
        </el-table-column>
      </el-table>
      <!--<el-pagination-->
        <!--@size-change="sizeChangeHandle"-->
        <!--@current-change="currentChangeHandle"-->
        <!--:current-page="pageIndex"-->
        <!--:page-sizes="[10, 20, 50, 100]"-->
        <!--:page-size="pageSize"-->
        <!--:total="totalPage"-->
        <!--layout="total, sizes, prev, pager, next, jumper">-->
      <!--</el-pagination>-->
    </div>
    <!--<h3>项目介绍</h3>-->
    <!--<ul>-->
      <!--<li>基于 Spring Boot 2.0 + Shiro + Mybatis + Vue2.0 + Element 实现的权限系统</li>-->
    <!--</ul>-->
  </div>
</template>

<script>
  import Schart from 'vue-schart';
  export default {
    data() {
      return {
        createOrderTime: [],
        startOrderTime: '',
        endOrderTime: '',
        areaId: [],
        bigAreaId: [],
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
        areaList: [],
        bigAreaList: [],
        options: {
          title: 'EMS邮寄系统柱状图单数统计',
          fillColor: '#17B3A3',
          autoWidth: true,           // 设置宽高自适应
          showValue: true,               // 是否在图表中显示数值
          topPadding: 50,                 // canvas 上边距
          bottomPadding: 50,              // canvas 下边距
          leftPadding: 50,                // canvas 左边距
          rightPadding: 0,                // canvas 右边距
          yEqual: 5,                      // y轴分成5等分
        },
        options1: {
          type: 'pie',
          title: 'EMS邮寄系统饼图单数统计',
          fillColor: '#17B3A3',
          autoWidth: true,                // 设置宽高自适应
          showValue: true,               // 是否在图表中显示数值
          topPadding: 50,                 // canvas 上边距
          bottomPadding: 50,              // canvas 下边距
          leftPadding: 50,                // canvas 左边距
          rightPadding: 0,                // canvas 右边距
        },
        data:[],

        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    created(){
      if(this.$store.state.user.type != 1){
        this.getOrderCount()
      }
      if(this.$store.state.user.type == 1){
        this.getBigAreaInfo()
        this.getDataList()
      }
      this.getAreaInfo()
    },
    methods: {
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      getDataList () {
        if (this.createOrderTime && this.createOrderTime.length > 0) {
          this.startOrderTime = this.createOrderTime[0]
          this.endOrderTime = this.createOrderTime[1]
        } else {
          this.startOrderTime = ""
          this.endOrderTime = ""
        }

        // 数据转换 areaId
        let multiAreaId = ''
        if(this.areaId && this.areaId.length > 0){
          multiAreaId = this.areaId.join(',')
        }
        // 数据转换，大区bigAreaId
        let multiBigAreaId = ''
        if(this.bigAreaId && this.bigAreaId.length > 0){
          multiBigAreaId = this.bigAreaId.join(',')
        }

        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/order/orderDataCount'),
          method: 'get',
          params: this.$http.adornParams({
            'startOrderTime': this.startOrderTime,
            'endOrderTime': this.endOrderTime,
            'areaId': multiBigAreaId,  // 大区
            'handleAreaId': multiAreaId // 网点
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.countOrderList
            // this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.$message.error(data.msg)
            // this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },

      getOrderCount() {
        if (this.createOrderTime && this.createOrderTime.length > 0) {
          this.startOrderTime = this.createOrderTime[0]
          this.endOrderTime = this.createOrderTime[1]
        } else {
          this.startOrderTime = ""
          this.endOrderTime = ""
        }

        // 数据转换 areaId
        let multiAreaId = ''
        if(this.areaId && this.areaId.length > 0){
          multiAreaId = this.areaId.join(',')
        }

        this.$http({
          url: this.$http.adornUrl('/sys/order/dataCount'),
          method: 'get',
          params: this.$http.adornParams({
            'startOrderTime': this.startOrderTime,
            'endOrderTime': this.endOrderTime,
            'handleAreaId': multiAreaId // 网点
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.data = []
            data.list.forEach((item) => {
              this.data.push({
                name: item.name,
                value: item.value
              })
            })
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
      getAreaInfo() {
        let url = ""
        if(this.type === 1){
          if(this.bigAreaId.length === 0){
            this.areaId = []
          }
          url = this.$http.adornUrl('/sys/handlerArea/areaNames')
        }else{
          url = this.$http.adornUrl('/sys/handlerArea/areaNameList')
        }
        this.$http({
          url: url,
          method: 'get',
          params: this.$http.adornParams({
            'areaId': this.type === 1 ? this.bigAreaId.join(',') : ''
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
      },
    },
    components: {
      Schart
    },
    computed: {
      type: {
        get () { return this.$store.state.user.type }
      }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>

