<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 邮寄介绍</span>
        <el-form :model="dataForm" status-icon label-width="100px" class="dataForm" ref="dataForm">
          <el-form-item label="邮寄介绍" prop="postComment">
            <div id="editor" class="editor">
              <!--<wangeditor :catchData="catchData"></wangeditor>-->
            </div>
            <!--<el-input v-model="dataForm.postComment" placeholder="邮寄介绍" :maxlength="500" type="textarea" ></el-input>-->
          </el-form-item>
          <el-form-item>
            <el-button v-if="isAuth('sys:post:update') && type == 1" type="primary" @click="submitForm()">保存</el-button>
            <el-button v-if="type == 1" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import E from 'wangeditor'
  var editor = new E('#editor')
  export default {
    data(){
      return{
        dataForm:{
          postId: '',
          postComment: ''
        }
      }
    },
    methods:{
      submitForm(){
        this.$http({
          url: this.$http.adornUrl(`/sys/post/${!this.dataForm.postId ? 'save' : 'update'}`),
          method: 'post',
          data: this.$http.adornData({
            'postId': this.dataForm.postId || undefined,
            'postComment': this.dataForm.postComment
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.getPostInfo()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      resetForm(){
        this.dataForm.postComment = ''
      },
      getPostInfo(){
        this.$http({
          url: this.$http.adornUrl(`/sys/post/list`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if(data && data.code === 0){
            if(data.postEntity){
              this.dataForm.postId = data.postEntity.postId
              this.dataForm.postComment = data.postEntity.postComment
              console.log("999999999999")
              console.log(this.dataForm.postComment)
              if(this.dataForm.postId){
                editor.txt.html(this.dataForm.postComment)
              }
            }
          }
        })
      }
    },
    activated () {
      this.getPostInfo()

      // this.$nextTick(()=>{
      //   if(this.dataForm.postId){
      //     editor.txt.html("01212.lklk")
      //   }
      // })
    },
    computed: {
      type: {
        get () { return this.$store.state.user.type }
      }
    },

    mounted () {
      editor.customConfig.onchange = (html) => {
        this.dataForm.postComment = html
      }
      editor.create()
      // editor.txt.html('<p>用 JS 设置的内容</p>')
    }
  }
</script>

<style scoped>

</style>
