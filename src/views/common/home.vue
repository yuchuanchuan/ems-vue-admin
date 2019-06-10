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
        <el-select v-model="areaId" placeholder="请选择" width="100%" clearable>
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getOrderCount()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card class="box-card">
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
        areaId: '',
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
        data:[]
      }
    },
    created(){
      this.getAreaList()
      this.getOrderCount()
    },
    methods: {
      getOrderCount() {
        if (this.createOrderTime && this.createOrderTime.length > 0) {
          this.startOrderTime = this.createOrderTime[0]
          this.endOrderTime = this.createOrderTime[1]
        } else {
          this.startOrderTime = ""
          this.endOrderTime = ""
        }

        this.$http({
          url: this.$http.adornUrl('/sys/order/dataCount'),
          method: 'get',
          params: this.$http.adornParams({
            'startOrderTime': this.startOrderTime,
            'endOrderTime': this.endOrderTime,
            'areaId': this.areaId
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

      getAreaList() {
        this.$http({
          url: this.$http.adornUrl('/sys/area/region'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.areaList = []
          if (data && data.code === 0 && data.regionList && data.regionList.length > 0) {
            data.regionList[0].childList.forEach((item) => {
              this.areaList.push({
                id: item.id,
                name: item.name
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

