<template>
  <div>
    <div v-show="!show" class="hidenbox">
      <div class="cha" @click="cha">×</div>
    </div>
    <div v-show="!show" class="hidenimg">
      <img :src="show_img">
    </div>
    <el-dialog :title="'详情单打印'" :close-on-click-modal="false" :visible.sync="visible" width="530px">
      <el-button type="primary" style="float: left;" @click="toggle()">两联/三联详情单</el-button>
      <!-- <el-button v-show="isMultiple" type="primary" @click="toggleDirectionFunc()">正单/返单</el-button> -->

      <el-checkbox-group v-model="directionGroup" style="float: left;margin-left: 30px;" @change="directionGroupChange()">
        <el-checkbox-button label="正单" />
        <el-checkbox-button label="返单" />
      </el-checkbox-group>

      <br><br>

      <!-- ===============================两联详情单============================= -->

      <div v-show="visible2" id="all2" style="width:474px;height:711px;">
        <div id="row1" :style="{backgroundImage:`url(${img})`}" class="container">
          <!--第一行-->
          <div id="" class="row" style="height: 110px;">
            <div class="col-md-5" style="padding-left: 7%;">
              <div class="row" style="height: 30px;">&nbsp;</div>
              <div class="row">
                <div class="col" style="font-size: 24px;font-weight: 900;">{{ isReturn }}
                </div>
              </div>
              <div class="row">
                <div class="col" style="font-size: 5px;">时间：{{ currentTime }}
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <div class="row" style="margin-top: 20px;">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option" width="248px" tag="svg" />
                </div>
              </div>
              <div class="row" style="text-align: center;">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
          </div>
          <!--第二行-->
          <!--          <div class="row">
            <div class="col" style="text-align: center;font-weight: bold;">
              02-津-***
            </div>
          </div> -->
          <!--第三行-->
          <div class="row" style="height: 70px;">
            <div class="col">
              <div class="row">
                <div class="col">收：<span id="2applyName1">{{ dataForm.name }}：{{ dataForm.phone }}</span></div>
              </div>
              <div class="row">
                <div class="col"><span id="2applyAddr1">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
          </div>
          <!--第四行-->
          <div class="row" style="height: 55px;">
            <div class="col">
              <div class="row">
                <div class="col">寄：<span id="2centerName1">{{ handleArea }}不动产登记中心 电话：022-12342345</span></div>
              </div>
              <div class="row">
                <div class="col"><span id="2centerAddr1">天津市{{ handleAddress }}</span></div>
              </div>
            </div>
          </div>
          <div class="row" style="line-height: 15px;">
            <div class="col-md-6" style="font-size: 13px;">
              <div class="row">
                <div class="col">付款方式：</div>
              </div>
              <div class="row">
                <div class="col">计费重量（KG）：0.5</div>
              </div>
              <div class="row">
                <div class="col">保价金额（元）：1</div>
              </div>
            </div>
            <div class="col-md-6" style="font-size: 12px;line-height: 15px;">
              <div class="row">
                <div class="col">收件人/代收人：</div>
              </div>
              <div class="row">
                <div class="col">签收时间：</div>
              </div>
              <div class="row" style="font-size: 7px;">
                <div class="col">快件送达收货人地址，经收件人或收件人允许的代收人签字，视为送达</div>
              </div>
            </div>
          </div>
          <div class="row" style="height: 105px;padding-top: 10px;">
            <div class="col">
              <div class="row">
                <div class="col-md-7">订单号:
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
                <div class="col-md-5">件数： 重量： KG</div>
              </div>
              <div class="row">
                <div class="col-md-10">
                  <div class="row">
                    <div class="col">配货信息：{{ postType }}-{{ dataForm.idCard }}-{{ dataForm.applyName }}</div>
                  </div>
                  <div class="row" />
                </div>
                <div class="col-md-2" />
              </div>
            </div>
          </div>
          <div class="row" style="height:20px;" />
          <div class="row" style="height: 70px;">
            <div class="col-md-6" style="text-align: center;">
              <div class="row">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
              </div>
              <div class="row">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
            <div class="col-md-6" />
          </div>
          <div class="row" style="font-size: 14px;line-height: 15px;height: 80px;">
            <div class="col-md-7">
              <div class="col">
                <div class="row">收：<span id="2applyName2">{{ dataForm.name }} {{ dataForm.phone }}</span></div>
                <div class="row"><span id="2applyAddr2">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
            <div class="col-md-5">
              <div class="col">
                <div class="row">寄：<span id="2centerName2">{{ handleArea }}不动产登记中心 138XXXXXXXX</span></div>
                <div class="row"><span id="2centerAddr2">天津市{{ handleAddress }}</span></div>
              </div>
            </div>
          </div>
          <div class="row" style="height: 112px;">
            <div class="col-md-8">
              <div class="row" style="height: 80px;">
                <div class="col">备注：{{ remarkContent }}</div>
              </div>
              <div class="row">
                <div class="col">车管、居住、身份证办理，请扫码</div>
              </div>
            </div>
            <div class="col-md-4" style="text-align: center;"><img src="@/printDetails/img/qrCode.jpg" height="110" alt="">
            </div>
          </div>
        </div>
      </div>

      <!-- ===============================两联详情单  反向============================= -->
      <div v-show="visible2Reverse" id="all2Reverse" style="width:474px;height:711px;">
        <div id="row1" :style="{backgroundImage:`url(${img})`}" class="container">
          <!--第一行-->
          <div id="" class="row" style="height: 110px;">
            <div class="col-md-5" style="padding-left: 7%;">
              <div class="row" style="height: 30px;">&nbsp;</div>
              <div class="row">
                <div class="col" style="font-size: 24px;font-weight: 900;">实物返单
                </div>
              </div>
              <div class="row">
                <div class="col" style="font-size: 5px;">时间：{{ currentTime }}
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <div class="row" style="margin-top: 20px;">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option" width="248px" tag="svg" />
                </div>
              </div>
              <div class="row" style="text-align: center;">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
          </div>
          <!--第二行-->
          <!--          <div class="row">
            <div class="col" style="text-align: center;font-weight: bold;">
              02-津-***
            </div>
          </div> -->
          <!--第三行-->
          <div class="row" style="height: 55px;">
            <div class="col">
              <div class="row">
                <div class="col">收：<span id="">{{ handleArea }}不动产登记中心 电话：022-12342345</span></div>
              </div>
              <div class="row">
                <div class="col"><span id="">天津市{{ handleAddress }}</span></div>
              </div>
            </div>
          </div>
          <!--第四行-->
          <div class="row" style="height: 70px;">
            <div class="col">
              <div class="row">
                <div class="col">寄：<span id="">{{ dataForm.name }}：{{ dataForm.phone }}</span></div>
              </div>
              <div class="row">
                <div class="col"><span id="">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
          </div>
          <div class="row" style="line-height: 15px;">
            <div class="col-md-6" style="font-size: 13px;">
              <div class="row">
                <div class="col">付款方式：</div>
              </div>
              <div class="row">
                <div class="col">计费重量（KG）：0.5</div>
              </div>
              <div class="row">
                <div class="col">保价金额（元）：1</div>
              </div>
            </div>
            <div class="col-md-6" style="font-size: 12px;line-height: 15px;">
              <div class="row">
                <div class="col">收件人/代收人：</div>
              </div>
              <div class="row">
                <div class="col">签收时间：</div>
              </div>
              <div class="row" style="font-size: 7px;">
                <div class="col">快件送达收货人地址，经收件人或收件人允许的代收人签字，视为送达</div>
              </div>
            </div>
          </div>
          <div class="row" style="height: 105px;padding-top: 10px;">
            <div class="col">
              <div class="row">
                <div class="col-md-7">订单号:
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
                <div class="col-md-5">件数： 重量： KG</div>
              </div>
              <div class="row">
                <div class="col-md-10">
                  <div class="row">
                    <div class="col">配货信息：{{ postType }}-{{ dataForm.idCard }}-{{ dataForm.applyName }}</div>
                  </div>
                  <div class="row" />
                </div>
                <div class="col-md-2" />
              </div>
            </div>
          </div>
          <div class="row" style="height:20px;" />
          <div class="row" style="height: 70px;">
            <div class="col-md-6" style="text-align: center;">
              <div class="row">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
              </div>
              <div class="row">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
            <div class="col-md-6" />
          </div>
          <div class="row" style="font-size: 14px;line-height: 15px;height: 80px;">
            <div class="col-md-7">
              <div class="col">
                <div class="row">收：<span id="2applyName2">{{ handleArea }}不动产登记中心 138XXXXXXXX</span></div>
                <div class="row"><span id="2applyAddr2">天津市{{ handleAddress }}</span></div>
              </div>
            </div>
            <div class="col-md-5">
              <div class="col">
                <div class="row">寄：<span id="2centerName2">{{ dataForm.name }} {{ dataForm.phone }}</span></div>
                <div class="row"><span id="2centerAddr2">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
          </div>
          <div class="row" style="height: 112px;">
            <div class="col-md-8">
              <div class="row" style="height: 80px;">
                <div class="col">备注：{{ remarkContent }}</div>
              </div>
              <div class="row">
                <div class="col">车管、居住、身份证办理，请扫码</div>
              </div>
            </div>
            <div class="col-md-4" style="text-align: center;"><img src="@/printDetails/img/qrCode.jpg" height="110" alt="">
            </div>
          </div>
        </div>
      </div>

      <!-- ===============================三联详情单============================= -->

      <div v-show="visible3" id="all3" style="width:474px;height:993px;">
        <div id="" :style="{backgroundImage:`url(${img})`}" class="container">
          <!--第一行-->
          <div class="row" style="height: 110px;">
            <div class="col-md-5" style="padding-left: 7%;">
              <div class="row" style="height: 30px;">
                <div class="col" />
              </div>
              <div class="row">
                <div class="col" style="font-size: 24px;font-weight: 900;">{{ isReturn }}
                </div>
              </div>
              <div class="row">
                <div class="col" style="font-size: 5px;">时间：{{ currentTime }}
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <div class="row" style="margin-top: 20px;">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option" width="248px" tag="svg" />
                </div>
              </div>
              <div class="row" style="text-align: center;">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
          </div>
          <!--第二行-->
          <!--          <div class="row">
            <div class="col" style="text-align: center;font-weight: bold;">
              02-津-***
            </div>
          </div> -->
          <!--第三行-->
          <div class="row" style="height: 78px;">
            <div class="col">
              <div class="row">
                <div class="col">收：<span id="3applyName1">{{ dataForm.name }}：{{ dataForm.phone }}</span></div>
              </div>
              <div class="row">
                <div class="col"><span id="3applyAddr1">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
          </div>
          <!--第四行-->
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col">寄：<span id="3centerName1">{{ handleArea }}不动产登记中心 电话：022-12342345</span></div>
              </div>
              <div class="row">
                <div class="col"><span id="3centerAddr1">{{ handleAddress }}</span></div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6" style="font-size: 13px;line-height: 20px;">
              <div class="row">
                <div class="col">付款方式：</div>
              </div>
              <div class="row">
                <div class="col">计费重量（KG）：0.5</div>
              </div>
              <div class="row">
                <div class="col">保价金额（元）：1</div>
              </div>
            </div>
            <div class="col-md-6" style="font-size: 12px;line-height: 12px;">
              <div class="row">
                <div class="col">收件人/代收人：</div>
              </div>
              <div class="row" style="font-size: 12px;">
                <div class="col">签收时间：</div>
              </div>
              <div class="row" style="font-size: 7px;">
                <div class="col">快件送达收货人地址，经收件人或收件人允许的代收人签字，视为送达</div>
              </div>
            </div>
          </div>
          <div class="row" style="height: 95px;padding-top: 10px;">
            <div class="col">
              <div class="row">
                <div class="col-md-7">订单号:
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
                <div class="col-md-5">件数： 重量： KG</div>
              </div>
              <div class="row">
                <div class="col-md-10">
                  <div class="row">
                    <div class="col">配货信息：{{ postType }}-{{ dataForm.idCard }}-{{ dataForm.applyName }}</div>
                  </div>
                  <div class="row" />
                </div>
                <div class="col-md-2" />
              </div>
            </div>
          </div>
          <div class="row" style="height:20px;" />
          <div class="row" style="height: 70px;">
            <div class="col-md-6" style="text-align: center;padding-top: 9px;">
              <div class="row">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
              </div>
              <div class="row">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
            <div class="col-md-6" />
          </div>
          <div class="row" style="font-size: 14px;line-height: 15px; height:85px;padding-top: 4px;">
            <div class="col-md-7">
              <div class="col">
                <div class="row">收：<span id="3applyName2">{{ dataForm.name }} {{ dataForm.phone }}</span></div>
                <div class="row"><span id="3applyAddr2">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
            <div class="col-md-5" style="padding-left: 0;">
              <div class="col">
                <div class="row">寄：<span id="3centerName2">{{ handleArea }}不动产登记中心 138XXXXXXXX</span></div>
                <div class="row"><span id="3centerAddr2">{{ handleAddress }}</span></div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="row" style="height:110px;">
                <div class="col">备注：{{ remarkContent }}</div>
              </div>
            </div>
          </div>
          <div class="row" style="height:20px;font-size: 12px;text-align: center;">
            <div class="col-md-5">
              网址：ems.tjeasytech.cn
            </div>
            <div class="col-md-5">
              客服电话：022-XXXXXXXX
            </div>
          </div>
          <div class="row" style="height: 70px;">
            <div class="col-md-6" style="text-align: center;padding-top: 9px;">
              <div class="row">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
              </div>
              <div class="row">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
            <div class="col-md-6" />
          </div>
          <div class="row" style="font-size: 14px;line-height: 15px;height: 83px;padding-top: 4px;">
            <div class="col-md-7">
              <div class="col">
                <div class="row">收：<span id="3applyName3">{{ dataForm.name }} {{ dataForm.phone }}</span></div>
                <div class="row"><span id="3applyAddr3">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
            <div class="col-md-5" style="padding-left: 0;">
              <div class="col">
                <div class="row">寄：<span id="3centerName3">{{ handleArea }}不动产登记中心 138XXXXXXXX</span></div>
                <div class="row"><span id="3centerAddr3">{{ handleAddress }}</span></div>
              </div>
            </div>
          </div>
          <div class="row" style="height: 50px;height: 125px;">
            <div class="col">
              <div class="row">
                <div class="col-md-7">订单号:
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
                <div class="col-md-5">件数： 重量： KG</div>
              </div>
              <div class="row">
                <div class="col-md-10">
                  <div class="row">
                    <div class="col">配货信息：{{ postType }}-{{ dataForm.idCard }}-{{ dataForm.applyName }}</div>
                  </div>
                  <div class="row" />
                </div>
                <div class="col-md-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===============================三联详情单   反向============================= -->

      <div v-show="visible3Reverse" id="all3Reverse" style="width:474px;height:993px;">
        <div id="" :style="{backgroundImage:`url(${img})`}" class="container">
          <!--第一行-->
          <div class="row" style="height: 110px;">
            <div class="col-md-5" style="padding-left: 7%;">
              <div class="row" style="height: 30px;">
                <div class="col" />
              </div>
              <div class="row">
                <div class="col" style="font-size: 24px;font-weight: 900;">实物返单
                </div>
              </div>
              <div class="row">
                <div class="col" style="font-size: 5px;">时间：{{ currentTime }}
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <div class="row" style="margin-top: 20px;">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option" width="248px" tag="svg" />
                </div>
              </div>
              <div class="row" style="text-align: center;">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
          </div>
          <!--第二行-->
          <!--          <div class="row">
            <div class="col" style="text-align: center;font-weight: bold;">
              02-津-***
            </div>
          </div> -->
          <!--第三行-->
          <div class="row" style="height: 78px;">
            <div class="col">
              <div class="row">
                <div class="col">收：<span id="">{{ handleArea }}不动产登记中心 电话：022-12342345</span></div>
              </div>
              <div class="row">
                <div class="col"><span id="">{{ handleAddress }}</span></div>
              </div>
            </div>
          </div>
          <!--第四行-->
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col">寄：<span id="">{{ dataForm.name }}：{{ dataForm.phone }}</span></div>
              </div>
              <div class="row">
                <div class="col"><span id="">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6" style="font-size: 13px;line-height: 20px;">
              <div class="row">
                <div class="col">付款方式：</div>
              </div>
              <div class="row">
                <div class="col">计费重量（KG）：0.5</div>
              </div>
              <div class="row">
                <div class="col">保价金额（元）：1</div>
              </div>
            </div>
            <div class="col-md-6" style="font-size: 12px;line-height: 12px;">
              <div class="row">
                <div class="col">收件人/代收人：</div>
              </div>
              <div class="row" style="font-size: 12px;">
                <div class="col">签收时间：</div>
              </div>
              <div class="row" style="font-size: 7px;">
                <div class="col">快件送达收货人地址，经收件人或收件人允许的代收人签字，视为送达</div>
              </div>
            </div>
          </div>
          <div class="row" style="height: 95px;padding-top: 10px;">
            <div class="col">
              <div class="row">
                <div class="col-md-7">订单号:
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
                <div class="col-md-5">件数： 重量： KG</div>
              </div>
              <div class="row">
                <div class="col-md-10">
                  <div class="row">
                    <div class="col">配货信息：{{ postType }}-{{ dataForm.idCard }}-{{ dataForm.applyName }}</div>
                  </div>
                  <div class="row" />
                </div>
                <div class="col-md-2" />
              </div>
            </div>
          </div>
          <div class="row" style="height:20px;" />
          <div class="row" style="height: 70px;">
            <div class="col-md-6" style="text-align: center;padding-top: 9px;">
              <div class="row">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
              </div>
              <div class="row">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
            <div class="col-md-6" />
          </div>
          <div class="row" style="font-size: 14px;line-height: 15px; height:85px;padding-top: 4px;">
            <div class="col-md-7">
              <div class="col">
                <div class="row">收：<span id="">{{ handleArea }}不动产登记中心 138XXXXXXXX</span></div>
                <div class="row"><span id="">{{ handleAddress }}</span></div>
              </div>
            </div>
            <div class="col-md-5" style="padding-left: 0;">
              <div class="col">
                <div class="row">寄：<span id="">{{ dataForm.name }} {{ dataForm.phone }}</span></div>
                <div class="row"><span id="">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="row" style="height:110px;">
                <div class="col">备注：{{ remarkContent }}</div>
              </div>
            </div>
          </div>
          <div class="row" style="height:20px;font-size: 12px;text-align: center;">
            <div class="col-md-5">
              网址：ems.tjeasytech.cn
            </div>
            <div class="col-md-5">
              客服电话：022-XXXXXXXX
            </div>
          </div>
          <div class="row" style="height: 70px;">
            <div class="col-md-6" style="text-align: center;padding-top: 9px;">
              <div class="row">
                <div class="col">
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
              </div>
              <div class="row">
                <div class="col">{{ dataForm.mailNum }}</div>
              </div>
            </div>
            <div class="col-md-6" />
          </div>
          <div class="row" style="font-size: 14px;line-height: 15px;height: 83px;padding-top: 4px;">
            <div class="col-md-7">
              <div class="col">
                <div class="row">收：<span id="">{{ handleArea }}不动产登记中心 138XXXXXXXX</span></div>
                <div class="row"><span id="">{{ handleAddress }}</span></div>
              </div>
            </div>
            <div class="col-md-5" style="padding-left: 0;">
              <div class="col">
                <div class="row">寄：<span id="">{{ dataForm.name }} {{ dataForm.phone }}</span></div>
                <div class="row"><span id="">{{ dataForm.postProvinceName }}{{ dataForm.postCityName }}{{ dataForm.postCountyName }}{{ dataForm.street }}</span></div>
              </div>
            </div>
          </div>
          <div class="row" style="height: 50px;height: 125px;">
            <div class="col">
              <div class="row">
                <div class="col-md-7">订单号:
                  <barcode :value="dataForm.mailNum" :options="barcode_option_small" tag="svg" />
                </div>
                <div class="col-md-5">件数： 重量： KG</div>
              </div>
              <div class="row">
                <div class="col-md-10">
                  <div class="row">
                    <div class="col">配货信息：{{ postType }}-{{ dataForm.idCard }}-{{ dataForm.applyName }}</div>
                  </div>
                  <div class="row" />
                </div>
                <div class="col-md-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="imgPrint" />
      <span slot="footer" class="dialog-footer">
        <el-input v-show="remarkVisible" v-model="remarkContent" :rows="5" type="textarea">{{ remarkContent }}</el-input>
        <br><br>
        <el-button @click="cancel">取消</el-button>
        <!-- <el-button v-show="visible3" type="primary" @click="clickPrint(3)">打印</el-button> -->
        <el-button id="printBtn" type="primary" @click="clickPrint()">打印</el-button>
        <el-button type="primary" @click="remarkVisible=!remarkVisible">添加备注信息</el-button>
        </el-input>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import '@/printDetails/css/bootstrap.min.css'
import $ from 'jquery'
import domtoimage from 'dom-to-image'
import printJS from 'print-js'

export default {
  data() {
    return {
      directionGroup: ['正单'],
      barcode_option: {
        displayValue: false, // 是否默认显示条形码数据
        // textPosition  :'top', //条形码数据显示的位置
        height: 35,
        width: 2
      },
      barcode_option_small: {
        displayValue: false, // 是否默认显示条形码数据
        // textPosition  :'top', //条形码数据显示的位置
        height: 20,
        width: 1
      },
      img: require('@/printDetails/img/bgThree.png'),
      show_img: '',
      show: true,
      visible: false,
      visible3: false,
      visible2: true,
      visible3Reverse: false,
      visible2Reverse: false,
      currentTime: null,
      isReturn: '标准快递',
      remarkVisible: false,
      remarkContent: '',
      handleAddress: '',
      handleArea: '',
      postType: '',
      dataUrlList: [],
      orderIdStr: [],
      dataUrlForward: '',
      dataUrlReverse: '',
      forward: true,
      reverse: false,
      toggleDirection: true,
      isMultiple: true,
      isType2: true,
      dataForm: {
        orderId: 0,
        applyName: '',
        applyPhone: '',
        name: '',
        propertyNo: '', // 身份证号
        idCard: '',
        phone: '',
        mobileCode: '',
        ownerPositive: '',
        ownerNegative: '',
        housingAuthority: '',
        postType: '',
        postRisk: 1,
        postRiskId: '',
        postProvinceId: '',
        postProvinceName: '',
        postCityId: '',
        postCityName: '',
        postCountyId: '',
        postCountyName: '',
        postAddress: '',
        addressList: [],
        street: '',
        houseNum: '',
        areaId: '',
        handleAreaId: '',
        handleAddress: '',
        handleArea: '',
        mailNum: ''
      }
    }
  },
  methods: {
    // 用于切换正反单-----暂时不用了
    toggleDirectionFunc() {
      this.toggleDirection = !this.toggleDirection
      if (this.visible2) {
        this.reverseInfo(2)
      } else {
        this.reverseInfo(3)
      }
    },
    cancel() {
      this.visible = false
      this.resetViriable()
    },
    formatDate() {
      this.currentTime = // 修改数据date
          new Date().getFullYear() +
          '-' +
          (new Date().getMonth() + 1) +
          '-' +
          new Date().getDate() +
          ' ' +
          new Date().getHours() +
          ':' +
          new Date().getMinutes() +
          ': ' +
          new Date().getSeconds()
    },
    // 用于切换两联三联详情单,将反向单都置为隐藏，然后把正反向按钮置为正向
    toggle() {
      this.visible2 = !this.visible2
      this.visible2Reverse = false
      this.visible3 = !this.visible3
      this.visible3Reverse = false
      this.forward = true
      this.reverse = false
      this.isType2 = !this.isType2
    },
    // 复选切换
    directionGroupChange() {
      console.log(this.directionGroup.toString())
      $('#printBtn').removeAttr('disabled')
      // 如果未选择任意正反
      if (this.directionGroup.length < 1) { $('#printBtn').attr('disabled', 'disabled') }
      if (this.directionGroup.length > 1) {
        this.forward = true
        this.reverse = true
        if (this.isType2 === true) {
          this.visible2 = true
          this.visible2Reverse = true
        }
        if (!this.isType2 === true) {
          this.visible3 = true
          this.visible3Reverse = true
        }
      } else if (this.directionGroup[0] === '正单') {
        this.forward = true
        this.reverse = false
        if (this.isType2 === true) {
          this.visible2 = true
          this.visible2Reverse = false
        }
        if (!this.isType2 === true) {
          this.visible3 = true
          this.visible3Reverse = false
        }
      } else if (this.directionGroup[0] === '返单') {
        this.forward = false
        this.reverse = true
        if (this.isType2 === true) {
          this.visible2 = false
          this.visible2Reverse = true
        }
        if (!this.isType2 === true) {
          this.visible3 = false
          this.visible3Reverse = true
        }
      }
    },
    // 点击打印按钮
    clickPrint() {
      // 如果是批量，则循环toimg
      this.dataUrlList = []
      var type
      if (this.isType2) type = 2
      else type = 3

      console.log(type)
      // if (this.orderIdStr.length > 1) {
      console.log('我执行到这里1')
      const sleep = (timer) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, timer)
        })
      }
      const foo = async() => {
        for (let i = 0; i < this.orderIdStr.length; i++) {
          this.getOrder(this.orderIdStr[i])
          console.log(this.orderIdStr[i])
          await sleep(100)
          // 根据order数据生成img
          if (this.forward === true && this.reverse) {
            this.toImgMultiple(type, this.orderIdStr[i], 'forward')
            await sleep(100)
            this.toImgMultiple(type, this.orderIdStr[i], 'reverse')
          } else if (this.forward && !this.reverse) {
            this.toImgMultiple(type, this.orderIdStr[i], 'forward')
          } else if (!this.forward && this.reverse) {
            console.log('进入返单分支')
            this.toImgMultiple(type, this.orderIdStr[i], 'reverse')
          }
          await sleep(1000)
        }
        await sleep(100)
        this.print()
      }
      foo()
    },
    // 把html生成为img
    toImgMultiple(type, orderId, direction) {
      // 插入图片到html
      let node

      if (type === 3) {
        if (direction === 'forward') {
          node = document.getElementById('all3')
        }
        if (direction === 'reverse') {
          node = document.getElementById('all3Reverse')
        }
      } else {
        if (direction === 'forward') {
          node = document.getElementById('all2')
        }
        if (direction === 'reverse') {
          console.log('进入返单分支2222')
          node = document.getElementById('all2Reverse')
        }
      }
      const scale = 5
      domtoimage.toPng(node, {
        width: node.clientWidth * scale,
        height: node.clientHeight * scale,
        style: {
          transform: 'scale(' + scale + ')',
          transformOrigin: 'top left'
        }
      }).then((dataUrl) => {
        this.dataUrlList.push(dataUrl)
      })
    },
    reverseInfo(type) {
      if (this.isReturn === '标准快递') {
        this.isReturn = '实物返单'
      } else {
        this.isReturn = '标准快递'
      }
      var tempName = ''
      var tempAddr = ''
      if (type === 2) {
        for (let i = 1; i <= 2; i++) {
          tempName = $('#2applyName' + i).html()
          tempAddr = $('#2applyAddr' + i).html()
          $('#2applyName' + i).html($('#2centerName' + i).html())
          $('#2applyAddr' + i).html($('#2centerAddr' + i).html())
          $('#2centerName' + i).html(tempName)
          $('#2centerAddr' + i).html(tempAddr)
        }
      }
      if (type === 3) {
        for (let i = 1; i <= 3; i++) {
          tempName = $('#3applyName' + i).html()
          tempAddr = $('#3applyAddr' + i).html()
          $('#3applyName' + i).html($('#3centerName' + i).html())
          $('#3applyAddr' + i).html($('#3centerAddr' + i).html())
          $('#3centerName' + i).html(tempName)
          $('#3centerAddr' + i).html(tempAddr)
        }
      }
    },
    // toImgSingle(type, orderId, direction) {
    //   if (direction === 'reverse') {
    //     this.reverseInfo(type)
    //   }
    //   let node
    //   if (type === 3) {
    //     node = document.getElementById('all3')
    //   } else {
    //     node = document.getElementById('all2')
    //   }
    //   const scale = 5
    //   domtoimage.toPng(node, {
    //     width: node.clientWidth * scale,
    //     height: node.clientHeight * scale,
    //     style: {
    //       transform: 'scale(' + scale + ')',
    //       transformOrigin: 'top left'
    //     }
    //   }).then((dataUrl) => {
    //     if (direction === 'both') {
    //       let node1
    //       if (type === 3) {
    //         node1 = document.getElementById('all3')
    //         this.reverseInfo(type)
    //       } else {
    //         node1 = document.getElementById('all2')
    //         this.reverseInfo(type)
    //       }
    //       const scale1 = 5
    //       domtoimage.toPng(node1, {
    //         width: node1.clientWidth * scale1,
    //         height: node1.clientHeight * scale1,
    //         style: {
    //           transform: 'scale(' + scale1 + ')',
    //           transformOrigin: 'top left'
    //         }
    //       }).then(function(dataUrl1) {
    //         printJS({
    //           printable: [dataUrl, dataUrl1],
    //           type: 'image',
    //           honorMarginPadding: false
    //         })
    //       })
    //     } else {
    //       printJS({
    //         printable: dataUrl,
    //         type: 'image',
    //         honorMarginPadding: false
    //       })
    //     }
    //   })
    // },
    print() {
      // var base64Url = ''
      // this.orderIdStr.forEach((id) => {
      //   base64Url += ("'" + $('#' + id).attr('src') + "',")
      // })
      // console.log('这是64编码的值' + base64Url.substring(0, base64Url.length - 1))
      printJS({
        printable: this.dataUrlList,
        type: 'image',
        honorMarginPadding: false
      })
    },
    cha() {
      this.show = true
      $('body').css('overflow', 'auto')
    },
    resetViriable() {
      this.currentTime = ''
      this.isReturn = '标准快递'
      this.remarkVisible = false
      this.remarkContent = ''
      this.dataUrlList = []
    },
    getOrder(orderId) {
      this.$http({
        url: process.env.BASE_API + '/sys/order/info/' + orderId,
        method: 'get',
        params: this.$http.adornParams()
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.dataForm = data.order
          this.dataForm.addressList = [data.order.postProvinceId, data.order.postCityId, data.order.postCountyId]
        }
      }).then(() => {
        this.$http({
          url: process.env.BASE_API + '/sys/handlerArea/info/' + this.dataForm.handleAreaId,
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.handleAddress = data.handleAreaEntity.handleAddress
            this.handleArea = data.handleAreaEntity.handleArea
          }
        })
      }).then(() => {
        this.$http({
          url: process.env.BASE_API + '/sys/bussiness/info/' + this.dataForm.postType,
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.postType = data.bussiness.bussinessName
          }
        })
      })
    },
    init(orderIdStr, type) {
      this.resetViriable()
      this.formatDate()
      console.log(orderIdStr)
      // 如果是list，认为是批量
      if (orderIdStr !== undefined && orderIdStr !== null && type === 'multiple') {
        this.orderIdStr = Array.from(orderIdStr.split(','))
        console.log(this.orderIdStr.toString())
        // 只加载第一个order的数据
        this.getOrder(orderIdStr.split(',')[0])
        this.isMultiple = true
        this.visible = true
      } else {
        this.isMultiple = false
        this.orderIdStr[0] = orderIdStr
        this.dataForm.orderId = orderIdStr || 0
        this.getOrder(orderIdStr)
        this.visible = true
      }
    }
  }
}
/** 多选步骤：
          1.先把id list拿过来  orderIdList
          2.然后循环getOrder和toImg，toImg每次都保存一个dataUrl在数组dataUrlList:[]里
          3.然后拿到dataUrlList的数组，放入printJs方法中
          情况1：单个打印
          init
          1.先把id list拿过来  orderIdList  做一下判断，单个的
          2.getorder
          点击打印按钮
          4.toimg
          5.print  urlList
          情况2：批量打印
          init
          1.先把id list拿过来  orderIdList
          2.循环 getorder
          按钮
          3.循环 toimg  生成img标签并且显示在dialog中？
          4.print  urlList

          urllist  存放id
          **/
</script>

<style>
</style>
