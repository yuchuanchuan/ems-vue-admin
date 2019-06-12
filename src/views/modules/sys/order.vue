<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="全部订单" name="first">
      <AllOrder/>
    </el-tab-pane>
    <el-tab-pane label="待发货" name="second">
      <ShipOrder/>
    </el-tab-pane>
    <el-tab-pane label="待收货" name="third">
      <ReceiptOrder/>
    </el-tab-pane>
    <el-tab-pane label="已收货" name="fourth">
      <RewardOrder />
    </el-tab-pane>
    <!--<el-tab-pane label="已取消" name="fifth">-->
      <!--<CancelOrder />-->
    <!--</el-tab-pane>-->
  </el-tabs>
</template>

<script>
  import AllOrder from './all-order.vue'
  import ShipOrder from './ship-order.vue'
  import ReceiptOrder from './receipt-order.vue'
  import RewardOrder from './reward-order.vue'
  import CancelOrder from './cancel-order.vue'
  export default {
    data(){
      return{
        activeName: 'first',
      }
    },
    components:{
      AllOrder,
      ShipOrder,
      ReceiptOrder,
      RewardOrder,
      CancelOrder
    }
  }
</script>

<style scoped>

</style>
