<template>
  <el-upload
    class="avatar-uploader"
    :action="uploadUrl"
    :data="otherParams"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <img v-else-if="!imageUrl && imgUrl" :src="imgUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
    export default {
        name: "uploader",
      data(){
        return {
          uploadUrl: process.env.BASE_API + '/sys/file/uploadImg',
          imageUrl: '',
          otherParams:{
            'type': this.fileType,
            'name': this.name
          }
        }
      },
      props:{
        url: {
          type: String,
        },
        imgUrl:{
          type: String
        },
        fileType:{
          type: Number
        },
        name:{
          type: String
        }
      },
      model: {
        prop: 'url',
        event: 'handle',
      },
      methods:{
        handleAvatarSuccess(res, file) {
          console.log("----调用====")
          console.log(file)
          console.log(res)
          this.imageUrl = URL.createObjectURL(file.raw);
          this.$emit('handle', res.fileName);
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < 10;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 10MB!');
          }
          return isJPG && isLt2M;
        },
      },
      created(){
          console.log("24454554''''''''");
          console.log(this.imageUrl+"----------------"+this.url)
      }
    }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
