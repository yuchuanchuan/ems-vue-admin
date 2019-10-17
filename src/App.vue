<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  created(){
    this.getOrderListCancel()
  },
  methods:{
    getOrderListCancel(){
      this.$http({
        url: this.$http.adornUrl('/sys/order/allList'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {

      })
    },
  }
}
</script>
