<template>
  <div class="all-order">
    <el-form :inline="true" :model="dataAllForm">
      <el-form-item>
        <el-input v-model="dataAllForm.orderNumber" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataAllForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="type == 1">
        <el-select v-model="dataAllForm.areaId" placeholder="办理地区" width="100%" clearable>
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataAllForm.status" placeholder="状态" width="100%" clearable>
          <el-option
            v-for="item in statusList"
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
        <el-button @click="getAllDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:order:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!--<el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataAllListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportExcel">导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          :action="importExcel"
          :show-file-list="false"
          :before-upload="beforeImport"
          :on-success="handleExcel">
          <el-button type="primary">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
      <el-table
      :data="dataAllList"
      border
      v-loading="dataAllListLoading"
      @selection-change="selectionAllChangeHandle"
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
        prop="name"
        header-align="center"
        align="center"
        label="收货人">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="电话">
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
          <!--<img :src="scope.row.housingAuthority" alt="" width="100" height="100" class="fdimg" @click="fangda(scope.row.housingAuthority)">-->
        <!--</template>-->
      </el-table-column>
        <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="订单状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" size="small" type="danger">待支付</el-tag>
            <el-tag v-else-if="scope.row.status === 2" size="small" type="warning">待发货</el-tag>
            <el-tag v-else-if="scope.row.status === 3" size="small" type="info">已发货</el-tag>
            <el-tag v-else-if="scope.row.status === 4" size="small" type="success">妥投</el-tag>
            <el-tag v-else-if="scope.row.status === 11" size="small" type="success">他人代签</el-tag>
            <el-tag v-else-if="scope.row.status === 10" size="small" type="success">其他</el-tag>
            <el-tag v-else-if="scope.row.status === 12" size="small" type="danger">未妥投</el-tag>
            <el-tag v-else-if="scope.row.status === 5" size="small">已取消</el-tag>
          </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:order:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.orderId)" :disabled="scope.row.status !== 1">修改</el-button>
          <el-button v-if="isAuth('sys:order:info')" type="text" size="small" @click="viewOrder(scope.row.orderId)">查看</el-button>
          <!--<el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.orderId)" :disabled="scope.row.status !== 1">取消订单</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageAllIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageAllSize"
      :total="totalAllPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getAllDataList"></add-or-update>

    <!-- 查看 -->
    <view-order v-if="viewOrderVisible" ref="viewOrder"></view-order>
  </div>
</template>

<script>
  import AddOrUpdate from './order-add-or-update.vue'
  import ViewOrder from './view-order.vue'
  import $ from 'jquery'
  export default {
    data(){
      return{
        importExcel: process.env.BASE_API + '/sys/order/import',
				// url:'ems.jujinkeji.net/',
				show_img:'',
        activeName: 'first',
        show:true,
        statusList:[
          {id:1,name:'待支付'},
          {id:2,name:'待发货'},
          {id:3,name:'已发货'},
          {id:4,name:'妥投'},
          {id:11,name:'代签'},
          {id:12,name:'未妥投'},
          {id:5,name:'已取消'},
          {id:10,name:'其他'}
        ],
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
        dataAllForm:{
          orderNumber: '',
          phone: '',
          startOrderTime: '',
          endOrderTime: '',
          status: '',
          areaId: ''
        },
        dataAllList: [],
        pageAllIndex: 1,
        pageAllSize: 10,
        totalAllPage: 0,
        dataAllListLoading: false,
        dataAllListSelections: [],
        addOrUpdateVisible: false,
        viewOrderVisible: false
      }
    },
    activated () {
      this.getAllDataList()
      this.getAreaInfo()
    },
    methods: {
      beforeImport(file){
        // console.log(file)
        // const isJPG = file.type === '.xls' || file.type === '.xlsx';
        // const isLt2M = file.size / 1024 / 1024 < 10;
        //
        // if (!isJPG) {
        //   this.$message.error('导入的格式只能是xls或xlsx格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('导入文件大小不能超过 10MB!');
        // }
        // return isJPG && isLt2M;
      },
      handleExcel(res, file){
        if(res.code === 0) {
          this.$message({
            message: '导入成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getAllDataList()
            }
          })
        }
      },
      // cha (){
      //   this.show=true
      //   $("body").css("overflow","auto");
      // },
      // fangda (imgSrc){
			// 	// this.show_img = this.dataAllList[e].housingAuthority
			// 	this.show_img = imgSrc
      //   this.show=false
      //   $("body").css("overflow","hidden");
      // },

      // 获取数据列表
      getAllDataList () {
        console.log("创建订单日期----------");
        if(this.createOrderTime && this.createOrderTime.length > 0){
          this.dataAllForm.startOrderTime = this.createOrderTime[0]
          this.dataAllForm.endOrderTime = this.createOrderTime[1]
        }else{
          this.dataAllForm.startOrderTime = ""
          this.dataAllForm.endOrderTime = ""
        }

        this.dataAllListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/order/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageAllIndex,
            'limit': this.pageAllSize,
            'orderNumber': this.dataAllForm.orderNumber,
            'phone': this.dataAllForm.phone,
            'startOrderTime': this.dataAllForm.startOrderTime,
            'endOrderTime': this.dataAllForm.endOrderTime,
            'status': this.dataAllForm.status,
            'areaId': this.dataAllForm.areaId
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataAllList = data.page.list
            console.log(this.dataAllList)
            this.totalAllPage = data.page.totalCount
          } else {
            this.dataAllList = []
            this.totalAllPage = 0
          }
          this.dataAllListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageAllSize = val
        this.pageAllIndex = 1
        this.getAllDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageAllIndex = val
        this.getAllDataList()
      },
      // 多选
      selectionAllChangeHandle (val) {
        this.dataAllListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 取消订单
      // deleteHandle (id) {
      //   var userIds = id ? [id] : this.dataAllListSelections.map(item => {
      //     return item.userId
      //   })
      //   this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$http({
      //       url: this.$http.adornUrl('/sys/order/delete'),
      //       method: 'post',
      //       data: this.$http.adornData(userIds, false)
      //     }).then(({ data }) => {
      //       if (data && data.code === 0) {
      //         this.$message({
      //           message: '操作成功',
      //           type: 'success',
      //           duration: 1500,
      //           onClose: () => {
      //             this.getAllDataList()
      //           }
      //         })
      //       } else {
      //         this.$message.error(data.msg)
      //       }
      //     })
      //   }).catch(() => {})
      // },

      // 查看订单
      viewOrder(id){
        this.viewOrderVisible = true
        this.$nextTick(() => {
          this.$refs.viewOrder.init(id)
        })
      },
      exportExcel(){
        if(this.createOrderTime && this.createOrderTime.length > 0){
          this.dataAllForm.startOrderTime = this.createOrderTime[0]
          this.dataAllForm.endOrderTime = this.createOrderTime[1]
        }else {
          this.dataAllForm.startOrderTime = ""
          this.dataAllForm.endOrderTime = ""
        }
        this.$http({
          url: this.$http.adornUrl('/sys/order/exportInfo'),
          method: 'get',
          params: this.$http.adornParams({
            'startOrderTime': this.dataAllForm.startOrderTime,
            'endOrderTime': this.dataAllForm.endOrderTime,
            'status': this.dataAllForm.status
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            window.location.href = this.$http.adornUrl('/sys/order/exportOrder') + "?startOrderTime="
              + this.dataAllForm.startOrderTime + "&endOrderTime=" + this.dataAllForm.endOrderTime
              + "&status=" + this.dataAllForm.status
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
      AddOrUpdate,
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
