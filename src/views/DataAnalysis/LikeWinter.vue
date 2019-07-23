<template>
    <!--冬防战报页面-->
    <div class="Like-winter htt-winter">
        <div class="title htt-title">
            <div class="text_left">
                <div class="oline1">
                    <font>{{twotime}}</font> 我市实时AQI为 <span>{{LfAirWinterPre.aqi}}</span>，京津冀城市倒排 <span>{{LfAirWinterPre.jingJinJiRankHour}}</span>
                </div>
                <div class="oline1">
                    <font>截止{{onetime}}</font> 我市169城市年倒排<span>{{170 - LfAirWinterPre.yearrank_74}}</span>，月倒排 <span>{{170 - LfAirWinterPre.monthrank_74}}</span>
                </div>
            </div>
            <h1>今日战报</h1>
            <div class="txtshow">
                <div class="juli_one">距离年底还有<span>{{timeShow2}}</span>天</div>
                <div class="juli_two">距离冬防攻坚战开始还有<span>{{timeShow}}</span>天</div>
            </div>
        </div>
        <div class="warp_box htt-all">
            <div class="Window_one htt-one">
                <!--预警控制模块 -->
                <div class="tt-text">
                    <p>预警控制</p>
                </div>
                <!--保优保良菜单-->
                <div class="tt-tab" v-show="hengtab">
                    <div class="tt-tab-l">
                        今日控制目标:
                    </div>
                    <div class="tt-tab-r">
                        <el-tabs v-model="activeName_b" @tab-click="actvieChange">
                            <el-tab-pane v-for="(item,index) in SouDataList" :label="item"  :name="item"></el-tab-pane>
                            <!---->
                        </el-tabs>
                    </div>
                </div>
                <!--要保值选择器-->
                <div class="winter_one_top02"  v-show="selectrb" style="float: left;margin-left: 25px">
                        <span>选择要保值：</span>
                        <select id="selectrb" @change="TodayPacketValue">
                            <option v-for="item in qualitys" :value="item.QualityCode">{{item.Quality}}</option>
                            <option value="----">----</option>
                            <!---->
                        </select>
                    </div>
                <!--显示内容部分-->
                <div class="item_text4">
                    <!--选择控制指标时候启用-->
                    <div class="item-kz-class">
                        <!--控制目标-->
                        <div class="kz-class" v-show="activeName_jrkz">
                            <!---->
                            <div class="qxtable" style="margin-top: 5px;height:22px;margin-left: 0px">
                                <i></i> <span v-if="yujingData[0]">{{yujingData[0].Time}}时，我市累计AQI为{{yujingData[0].LfAccuAqi}}，首要污染物为{{yujingData[0].PrimaryPollution}}</span>
                            </div>
                            <!--控制值-->
                            <div class="detail">
                                <div style="float: left;margin-left: 3%" v-if="yujingData[0]">{{yujingData[0].ControlItem}}</div>
                                <winter-progress
                                style="margin-top: 40px;margin-left: 16%"
                                v-if="yujingData[0]"
                                :left="parseInt(yujingData[0].LfAccuValue/yujingData[0].LfAlarmValue*100) > 99?100 :parseInt(yujingData[0].LfAccuValue/yujingData[0].LfAlarmValue*100)"
                                :color="CoBackgroundsColor(yujingData[0].LfAlarmValue - yujingData[0].LfAccuValue)"
                                :width="parseInt(yujingData[0].LfAccuValue/yujingData[0].LfAlarmValue*100) > 99?100 :parseInt(yujingData[0].LfAccuValue/yujingData[0].LfAlarmValue*100)"
                                :CurrentCumulative="parseInt(yujingData[0].LfAccuValue)"
                                :WarningValue="yujingData[0].LfAlarmValue ? yujingData[0].LfAlarmValue : '--'"
                                ></winter-progress>
                            </div>
                            <!---->
                            <div class="qxtable_bottom" style="margin:20px 0 10px 0">
                                <div class="pp_tit" style="float: left;width: 100%">
                                    <i></i><a>站点累计</a>
                                </div>
                            </div>
                            <!--站点累计-->
                            <div class="winter_top_table" style="width: 100%;">
                                <table border="1" style="width: 100%;border-color: #1e68d1;"  v-if="yujingData[0]">
                                    <!--<caption>This is a table caption</caption>-->
                                    <tr>
                                        <td><span>站点</span></td>
                                        <td><span>累计值</span></td>
                                        <td><span>达标状态</span></td>
                                        <td><span>后续控制值</span></td>
                                        <td><span>实时浓度</span></td>
                                    </tr>
                                    <tr v-for="(item,index) in yujingData[0].GskAlarms">
                                        <td>
                                            <span>{{item.PointName}}</span>
                                        </td>
                                        <td>
                                            <span>{{item.AccuValue}}</span>
                                        </td>
                                        <td>
                                            <span v-if="item.StandardState < 0" style="color: #00B83F">↓{{item.StandardState}}</span>
                                            <span v-if="item.StandardState > 0" style="color: red">↑{{item.StandardState}}</span>
                                        </td>
                                        <td>
                                            <span v-if="item.FutureControlValue < 0" style="color: #00B83F">↓{{item.FutureControlValue}}</span>
                                            <span v-if="item.FutureControlValue > 0" style="color: red">↑{{item.FutureControlValue}}</span>
                                        </td>
                                        <td>
                                            <span>{{item.RealValue}}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <!--tuli-->
                            <img style="float: left;margin-top: 4px;margin-bottom: 50px" src="../../assets/img/dabiao1_03.jpg" alt="">
                            <!---->
                        </div>
                        <!--今日若保-->
                        <div class="rb-class" v-show="activeName_jrrb">
                            <!---->
                            <div class="qxtable" style="margin-top: 5px;height:22px;margin-left: 0px">
                                <i></i> <span v-if="yujingData[0]">{{yujingData[0].Time}}，我市累计AQI为{{yujingData[0].LfAccuAqi}}，首要污染物为{{yujingData[0].PrimaryPollution}}</span>
                            </div>
                            <!--站点控制-->
                            <div class="winter_bao_top">
                                <div class="bao_left" style="line-height: 30px">
                                    <dl>
                                        <dt><span style="display:inline-block;width: 60px;height: 14px"></span></dt>
                                        <dd><span style="width: 60px">当前累计</span></dd>
                                        <dd><span style="width: 60px">剩余控制</span></dd>
                                    </dl>
                                </div>
                                <div class="bao_right">
                                    <dl>
                                        <dt><span class="w_title">PM2.5</span></dt>
                                        <dd><span class="w_value" :style="AqiBackgroundsColor(iscallData.AccuPm25,'PM2.5')">{{iscallData.AccuPm25}}</span><i class="jb_dian" v-show="red_dian"></i></dd>
                                        <dd><span class="w_value" :style="backroundlicolor(iscallData.AccuPm25,iscallData.FutureControlPm25Value)">{{iscallData.FutureControlPm25Value}}</span><i class="jb_dian" v-show="red_dian"></i></dd>
                                    </dl>
                                    <dl>
                                        <dt><span class="w_title">PM10</span></dt>
                                        <dd><span class="w_value" :style="AqiBackgroundsColor(iscallData.AccuPm10,'PM10')">{{iscallData.AccuPm10}}</span><i class="jb_dian" v-show="red_dian"></i></dd>
                                        <dd><span class="w_value" :style="backroundlicolor(iscallData.AccuPm10,iscallData.FutureControlPm10Value)">{{iscallData.FutureControlPm10Value}}</span><i class="jb_dian" v-show="red_dian"></i></dd>
                                    </dl>
                                    <dl>
                                        <dt><span class="w_title">SO2</span></dt>
                                        <dd><span class="w_value" :style="AqiBackgroundsColor(iscallData.AccuSo2,'SO2')">{{iscallData.AccuSo2}}</span></dd>
                                        <dd><span class="w_value" :style="backroundlicolor(iscallData.AccuSo2,iscallData.FutureControlSo2Value)">{{iscallData.FutureControlSo2Value}}</span></dd>
                                    </dl>
                                    <dl>
                                        <dt><span class="w_title">NO2</span></dt>
                                        <dd><span class="w_value" :style="AqiBackgroundsColor(iscallData.AccuNo2,'NO2')">{{iscallData.AccuNo2}}</span></dd>
                                        <dd><span class="w_value" :style="backroundlicolor(iscallData.AccuNo2,iscallData.FutureControlNo2Value)">{{iscallData.FutureControlNo2Value}}</span></dd>
                                    </dl>
                                    <dl>
                                        <dt><span class="w_title">CO</span></dt>
                                        <dd><span class="w_value" :style="AqiBackgroundsColor(iscallData.AccuCo,'CO')">{{iscallData.AccuCo}}</span></dd>
                                        <dd><span class="w_value" :style="backroundlicolor(iscallData.AccuCo,iscallData.FutureControlCoValue)">{{iscallData.FutureControlCoValue}}</span></dd>
                                    </dl>
                                    <dl>
                                        <dt><span class="w_title">O3</span></dt>
                                        <dd><span class="w_value" :style="AqiBackgroundsColor(iscallData.AccuO3,'O3')">{{iscallData.AccuO3}}</span></dd>
                                        <dd><span class="w_value" :style="backroundlicolor(iscallData.AccuO3,iscallData.FutureControlO3Value)">{{iscallData.FutureControlO3Value}}</span></dd>
                                    </dl>
                                </div>
                            </div>
                            <!---->
                            <div class="qxtable_bottom">
                                <div class="pp_tit" style="float: left;width: 100%">
                                    <i></i><a>站点累计</a>
                                </div>
                                <!--选择器-->
                                <div class="pp_tab" style="float: left;margin:5px 0 8px 6px ;line-height: 20px">
                                    <ul class="tb_ul">
                                        <li v-for="(cell,index) in items" @click="selectStyle(cell,index)"
                                            :class="{'bottomColor': (index === selected)}">
                                            {{cell.select}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!--累计站点-->
                            <div class="winter_top_table" style="width: 100%;">
                                <table border="1" style="width: 100%;border-color: #1e68d1;">
                                    <!--<caption>This is a table caption</caption>-->
                                    <tr>
                                        <td><span>站点</span></td>
                                        <td><span>累计值</span></td>
                                        <td><span>达标状态</span></td>
                                        <td><span>后续控制值</span></td>
                                        <td><span>实时浓度</span></td>
                                    </tr>
                                    <tr v-for="(item,index) in xuanzeData">
                                        <td>
                                            <span>{{item.PointName}}</span>
                                        </td>
                                        <td>
                                            <span>{{item.AccuValue}}</span>
                                        </td>
                                        <td>
                                            <span v-if="item.StandardState < 0" style="color: #00B83F">↓{{item.StandardState}}</span>
                                            <span v-if="item.StandardState > 0" style="color: red">↑{{item.StandardState}}</span>
                                        </td>
                                        <td>
                                            <span v-if="item.FutureControlValue < 0" style="color: #00B83F">↓{{item.FutureControlValue}}</span>
                                            <span v-if="item.FutureControlValue > 0" style="color: red">↑{{item.FutureControlValue}}</span>
                                        </td>
                                        <td>
                                            <span>{{item.RealValue}}</span>
                                        </td>
                                    </tr>

                                </table>
                            </div>
                            <!--tuli-->
                            <img style="float: left;margin-top: 4px;margin-bottom:50px;" src="../../assets/img/dabiao1_03.jpg" alt="">
                            <!---->
                        </div>
                    </div>
                   <!---->
                </div>
            </div>
            <div class="Window_Two htt-two" style="margin-left: 20px;position: relative">
                <!--今日战报地图模块-->
                <div class="class-fx">
                  <weather></weather>
                </div>
                <router-link to="/">
                    <el-button class="qjmap"
                               style="position: absolute;top: 5px;right: 5px;z-index: 20;color: #fff;background: #2494F2;border: none">
                        全局地图
                    </el-button>
                </router-link>
                <battle-map style="width: 100%;height: 100%"></battle-map>
            </div>
            <div class="Window_Three htt-three" style="margin-left: 20px">
                <!--综合指数与优良天数同比排名/县市区月考核-->
                <el-tabs v-model="activeName_s" @tab-click="">
                    <el-tab-pane label="综合指数与优良天数同比排名" name="first_s">
                        <el-tabs v-model="activeName_a" @tab-click="">
                            <el-tab-pane label="月度累计" name="first_a">
                                <div class="qxtable" style="margin-top: 10px;height:22px">
                                	<i></i>
                                	<select id="MonthRangeSelect" @change="monthRangeChange">
                                		<option value="2016">2016年</option>
                                		<option value="2017">2017年</option>
                                		<option value="2018" selected>2018年</option>
                                	</select>
                                	综指与排名情况对比(169城市)
                                </div>
                                <div id="MonthRange" style="width:100%;height:370px;"></div>
                                <div class="qxtable" style="margin-top: 10px;height:22px">
                                	<div class="left">
	                                	<i></i>
	                                	<select id="MonthAirSelect" @change="monthAirChange ">
	                                		<option value="2016">2016年</option>
											<option value="2017" >2017年</option>
											<option value='2018' selected>2018年</option>
										</select>
	                                	空气质量天数等级分布
                                	</div>
                                	<ul class="right">
                                		<li class="selec FineDay" @click="MonthAir">优良天</li>
                                		<li class="BadDay" @click="MonthAirPollution">重污染</li>
                                	</ul>
                                </div>
                                <div id="monthAirQuality" style="width: 470px;height:370px;"></div>
                                <div class="right endTime">月(年)度截止日期：<span>3月7日</span></div>
                            </el-tab-pane>
                            <el-tab-pane label="年度累计" name="third_a">
                                <div class="qxtable" style="margin-top: 10px;height:22px">
                                	<i></i>
									<select id="YearRangeSelect" @change="YearRangeChange">
										<option value="2016">2016年</option>
										<option value="2017">2017年</option>
										<option value="2018" selected>2018年</option>
									</select>
                                	综指与排名情况对比(169城市)
                                </div>
                                <div id="maintubiao" style="width: 470px;height:370px;"></div>
                                <div class="qxtable" style="margin-top: 10px;height:22px">
                                	<div class="left">
	                                	<i></i>
	                                	<select id="YearAirSelect" @change="YearAirChange">
	                                		<option value="2016">2016年</option>
											<option value="2017">2017年</option>
											<option value='2018' selected>2018年</option>
										</select>
	                                	空气质量天数等级分布
                                	</div>
                                	<ul class="right">
                                		<li class="selec FineDay" @click="AirQuality">优良天</li>
                                		<li class="BadDay" @click="AirQualityPolltion">重污染</li>
                                	</ul>
                                </div>
                                <div id="airQuality" style="width: 470px;height:320px;"></div>
                                <div class="right endTime">月(年)度截止日期：<span>3月7日</span></div>
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                    <el-tab-pane label="县(市、区)月考核" name="second_s">
                        <el-tabs v-model="activeName_z" @tab-click="">
                            <div class="qxtable"><i></i>廊坊市市区组月考核({{month}}月1日-{{month}}月{{day}}日)</div>
                            <div class="table_container" style="padding: 0 10px;">
                                <table border='1' cellspacing="0" style="width: 100%;">
                            		<tr>
                            			<th>考核组</th>
                            			<th>县(市、区)</th>
                            			<th>月综合指数</th>
                            			<th>月倒排</th>
                            		</tr>
                            		<tr>
                            			<td rowspan="3">市区组</td>
                            			<td>{{shiQuData.length&&shiQuData[0].gridname}}</td>
                            			<td>{{shiQuData.length&&shiQuData[0].complexindex}}</td>
                            			<td>{{shiQuData.length&&shiQuData[0].rank_total}}</td>
                            		</tr>
                            		<tr>
                            			<td>{{shiQuData.length&&shiQuData[1].gridname}}</td>
                            			<td>{{shiQuData.length&&shiQuData[1].complexindex}}</td>
                            			<td>{{shiQuData.length&&shiQuData[1].rank_total}}</td>
                            		</tr>
                            		<tr>
                            			<td>{{shiQuData.length&&shiQuData[2].gridname}}</td>
                            			<td>{{shiQuData.length&&shiQuData[2].complexindex}}</td>
                            			<td>{{shiQuData.length&&shiQuData[2].rank_total}}</td>
                            		</tr>
                            	</table>
                            </div>
                            <div class="qxtable"><i></i>廊坊市环京县市组月考核({{month}}月1日-{{month}}月{{day}}日)</div>
                            <div class="table_container" style="padding: 0 10px;">
                                <table border='1' cellspacing="0" style="width: 100%;">
                            		<tr>
                            			<th>考核组</th>
                            			<th>县(市、区)</th>
                            			<th>月综合指数</th>
                            			<th>月倒排</th>
                            		</tr>
                            		<tr>
                            			<td rowspan="5">环京县市组</td>
                            			<td>{{huanJingData.length&&huanJingData[0].gridname}}</td>
                            			<td>{{huanJingData.length&&huanJingData[0].complexindex}}</td>
                            			<td>{{huanJingData.length&&huanJingData[0].rank_total}}</td>
                            		</tr>
                            		<tr>
                            			<td>{{huanJingData.length&&huanJingData[1].gridname}}</td>
                            			<td>{{huanJingData.length&&huanJingData[1].complexindex}}</td>
                            			<td>{{huanJingData.length&&huanJingData[1].rank_total}}</td>
                            		</tr>
                            		<tr>
                            			<td>{{huanJingData.length&&huanJingData[2].gridname}}</td>
                            			<td>{{huanJingData.length&&huanJingData[2].complexindex}}</td>
                            			<td>{{huanJingData.length&&huanJingData[2].rank_total}}</td>
                            		</tr>
                            		<tr>
                            			<td>{{huanJingData.length&&huanJingData[3].gridname}}</td>
                            			<td>{{huanJingData.length&&huanJingData[3].complexindex}}</td>
                            			<td>{{huanJingData.length&&huanJingData[3].rank_total}}</td>
                            		</tr>
                            		<tr>
                            			<td>{{huanJingData.length&&huanJingData[4].gridname}}</td>
                            			<td>{{huanJingData.length&&huanJingData[4].complexindex}}</td>
                            			<td>{{huanJingData.length&&huanJingData[4].rank_total}}</td>
                            		</tr>
                            	</table>
                            </div>
                            <div class="qxtable"><i></i>廊坊市南部县市组月考核({{month}}月1日-{{month}}月{{day}}日)</div>
                            <div class="table_container" style="padding: 0 10px;">
                                <table border='1' cellspacing="0" style="width: 100%;">
                            		<tr>
                            			<th>考核组</th>
                            			<th>县(市、区)</th>
                            			<th>月综合指数</th>
                            			<th>月倒排</th>
                            		</tr>
                            		<tr>
                            			<td rowspan="4">南部县市组</td>
                            			<td>{{nanBuData.length&&nanBuData[0].gridname}}</td>
                            			<td>{{nanBuData.length&&nanBuData[0].complexindex}}</td>
                            			<td>{{nanBuData.length&&nanBuData[0].rank_total}}</td>
                            		</tr>
                            		<tr>
                            			<td>{{nanBuData.length&&nanBuData[1].gridname}}</td>
                            			<td>{{nanBuData.length&&nanBuData[1].complexindex}}</td>
                            			<td>{{nanBuData.length&&nanBuData[1].rank_total}}</td>
                            		</tr>
                            		<tr>
                            			<td>{{nanBuData.length&&nanBuData[2].gridname}}</td>
                            			<td>{{nanBuData.length&&nanBuData[2].complexindex}}</td>
                            			<td>{{nanBuData.length&&nanBuData[2].rank_total}}</td>
                            		</tr>
                            	</table>
                            </div>
                        </el-tabs>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="Window_Four htt-four" style="margin-top: -54px">
                <!--大气污染、燃煤数据、用电量数据、经济数据-->
                <el-tabs v-model="activeName_t" @tab-click="">
                    <el-tab-pane label="大气污染改善" name="fourth_t">
                        <div class="daqititle">
                            <span>2014-2017年{{DaqiType}}年均浓度{{DaqiDanw}}</span>
                            <select id="selectID" @change="DaQiWuRanTuBiao">
                                <option value="PM2.5">PM2.5</option>
                                <option value="PM10">PM10</option>
                                <option value="SO2">SO2</option>
                                <option value="NO2">NO2</option>
                                <option value="CO">CO</option>
                                <option value="O3">O3</option>
                                <option value="综指">综指</option>
                            </select>
                        </div>
                        <div id="pmcodepc" style="width: 366px;height: 200px;color: #fff!important;"></div>
                    </el-tab-pane>
                    <el-tab-pane label="燃煤替代" name="first_t">
                        <div class="renwu-box">
                            <div class="e_users" style="border-right: solid 1px #ccc">
                                <p>810,<span>33</span></p>
                                <a>煤改电任务用户</a>
                            </div>
                            <div class="e_users">
                                <h5>100% </h5>
                                <a>煤改电进度</a><br/>
                                <font style="font-size: 12px;color:#BECBEC; ">固安尚未完成，进度94.6%</font>
                            </div>
                            <div class="e_users" style="border-right: solid 1px #ccc">
                                <p>611,<span>764</span></p>
                                <a>煤改气任务用户</a>
                            </div>
                            <div class="e_users">
                                <h5>100% </h5>
                                <a>煤改气进度</a>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="用电量数据" name="second_t">
                        <div class="" style="padding: 10px 0">区县{{DianTime}}用电量</div>
                        <div id="dian_type" style="width: 366px;height: 200px;"></div>
                    </el-tab-pane>
                    <el-tab-pane label="经济数据" name="third_t">
                        <el-tabs v-model="activeName_j" @tab-click="">
                            <el-tab-pane label="全市生产总值" name="first_j">
                                <table border="1" class="nytable">
                                    <tr>
                                        <th class="goLeft">指标名称</th>
                                        <th style="width:112px">前三季度（亿元）</th>
                                        <th style="width:112px">同比增速（%）</th>
                                    </tr>
                                    <tr class="lightColor">
                                        <td class="goLeft">全市生产总值</td>
                                        <td>2083.7</td>
                                        <td>7.2</td>
                                    </tr>
                                    <tr>
                                        <td class="goLeft">第一产业</td>
                                        <td>136.3</td>
                                        <td>0.1</td>
                                    </tr>
                                    <tr class="darkColor">
                                        <td class="goLeft">第二产业</td>
                                        <td>938.6</td>
                                        <td>2.9</td>
                                    </tr>
                                    <tr class="lightColor">
                                        <td class="goLeft">#工业</td>
                                        <td>779.1</td>
                                        <td>2.0</td>
                                    </tr>
                                    <tr class="lightColor">
                                        <td class="goLeft">建筑业</td>
                                        <td>159.6</td>
                                        <td>7.9</td>
                                    </tr>
                                    <tr>
                                        <td class="goLeft">第三产业</td>
                                        <td>1008.8</td>
                                        <td>12.8</td>
                                    </tr>
                                    <tr class="lightColor">
                                        <td class="goLeft">#交通运输、仓储和邮政业</td>
                                        <td>62.3</td>
                                        <td>6.1</td>
                                    </tr>
                                    <tr class="lightColor">
                                        <td class="goLeft">批发和零售业</td>
                                        <td>126.1</td>
                                        <td>7.6</td>
                                    </tr>
                                    <tr class="lightColor">
                                        <td class="goLeft">住宿和餐饮业</td>
                                        <td>32.1</td>
                                        <td>8.6</td>
                                    </tr>
                                    <tr class="lightColor">
                                        <td class="goLeft">金融业</td>
                                        <td>174.8</td>
                                        <td>13.5</td>
                                    </tr>
                                    <tr class="lightColor">
                                        <td class="goLeft">房地产业</td>
                                        <td>184.1</td>
                                        <td>16.8</td>
                                    </tr>
                                    <tr class="lightColor">
                                        <td class="goLeft">其他服务业</td>
                                        <td>426.8</td>
                                        <td>13.5</td>
                                    </tr>
                                </table>
                            </el-tab-pane>
                            <el-tab-pane label="能源消耗" name="second_j" class="allCity">
                                <div class="table_container">
                                    <el-table
                                            :data="nenyuanData"
                                            border
                                            stripe
                                            highlight-current-row
                                    >
                                        <el-table-column
                                                property="zhibiao"
                                                label="指标"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                property="danwei"
                                                label="单位"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                property="qiansan"
                                                label="前三季度"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                property="zensu"
                                                label="同比增速(%)"
                                        >
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="Window_Five htt-five" style="margin-left: 20px;margin-top: -54px">
                <!--空气质量、工地扬尘、企业在线监测、TOVC监测-->
                <el-tabs v-model="activeName_f" @tab-click="BusTableClick()">
                    <el-tab-pane label="空气质量监测" name="first_f">
                        <div class="table_container">
                            <el-tabs v-model="activeName_AQI" @tab-click="handleClickKKK">
                                <el-tab-pane label="AQI" name="aqi"></el-tab-pane>
                                <el-tab-pane label="PM2.5" name="pm25"></el-tab-pane>
                                <el-tab-pane label="PM10" name="pm10"></el-tab-pane>
                                <el-tab-pane label="SO2" name="so2"></el-tab-pane>
                                <el-tab-pane label="O3" name="o3"></el-tab-pane>
                                <el-tab-pane label="NO2" name="no2"></el-tab-pane>
                                <el-tab-pane label="CO" name="co"></el-tab-pane>
                            </el-tabs>
                            <el-table
                                    :data="kongqiData"
                                    border
                                    stripe
                                    highlight-current-row
                            >
                                <el-table-column
                                        property="xuhao"
                                        label="排名"
                                        width="80"
                                >
                                </el-table-column>
                                <el-table-column
                                        property="wlname"
                                        label="网格名称"
                                >
                                </el-table-column>
                                <el-table-column
                                        property="jiancedian"
                                        label="监测点"
                                >
                                </el-table-column>
                                <el-table-column
                                        property="chaowrw"
                                        :label="arAQI"
                                >
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="工地扬尘监测" name="second_f" @tab-click="BusTableClick(1)">
                        <el-tabs v-model="activeName_w">
                            <el-tab-pane label="PM2.5" name="first_w">
                                <div class="table_container">
                                    <el-table
                                            :data="PM25Data"
                                            border
                                            stripe
                                            highlight-current-row
                                    >
                                        <el-table-column
                                                property="ranking"
                                                label="排名"
                                                width="80"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                property="gridName"
                                                label="网格名称"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                property="stationname"
                                                label="工地"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                property="pm25"
                                                label="PM2.5"
                                        >
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="PM10" name="second_w">
                                <div class="table_container">
                                    <el-table
                                            :data="PM10Data"
                                            border
                                            stripe
                                            highlight-current-row
                                    >
                                        <el-table-column
                                                property="ranking"
                                                label="排名"
                                                width="80"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                property="gridName"
                                                label="网格名称"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                property="stationname"
                                                label="工地"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                                property="pm10"
                                                label="PM10"
                                        >
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                    <el-tab-pane label="企业在线监测" name="third_f" @tab-click="BusTableClick(2)">
                        <div class="table_container">
                            <el-table
                                    :data="EnterpriseData"
                                    border
                                    stripe
                                    highlight-current-row
                            >
                                <el-table-column
                                        property="SerialNumber"
                                        label="序号"
                                        width="80"
                                >
                                </el-table-column>
                                <el-table-column
                                        property="gridName"
                                        label="网格名称"
                                >
                                </el-table-column>
                                <el-table-column
                                        property="stationname"
                                        label="企业"
                                >
                                </el-table-column>
                                <el-table-column
                                        property="overItem"
                                        label="超标指标"
                                >
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="TVOC监测" name="fourth_f">
                        <div class="table_container">
                            <el-table
                                    :data="TvocData"
                                    border
                                    stripe
                                    highlight-current-row
                            >
                                <el-table-column
                                        property="SerialNumber"
                                        label="排名"
                                        width="80"
                                >
                                </el-table-column>
                                <el-table-column
                                        property="gridName"
                                        label="网格名称"
                                >
                                </el-table-column>
                                <el-table-column
                                        property="stationname"
                                        label="监测点"
                                >
                                </el-table-column>
                                <el-table-column
                                        property="overItem"
                                        label="TVOC"
                                >
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="Window_six htt-six" style="margin-left: 20px;margin-top: 20px">
                <!--空气质量预报模块-->
                <div class="tt-text">
                    <p>空气质量预报</p>
                </div>
                <!--aqiColor-->
                <div class="data_water1">
                    <p v-if="WeatherWinterPre[0].date">{{WeatherWinterPre[0].date}}</p>
                    <a>AQI日报范围<span>{{WeatherWinterPre[0].minaqi}}-{{WeatherWinterPre[0].maxaqi}}</span></a><br/>
                    <!---->
                    <a>级别 <span class="tian"></span><span v-show="onelan"><img
                            :src="'../../../static/imgs/mues/cainuan/'+this.getImagesTarget(WeatherWinterPre[0].minQuality)+'.png'"
                            alt=""><i>~</i></span><span><img
                            :src="'../../../static/imgs/mues/cainuan/'+this.getImagesTarget(WeatherWinterPre[0].maxQuality)+'.png'"
                            alt=""></span></a><br/>
                    <a>首要污染物<span>{{WeatherWinterPre[0].mainpoll}}</span></a>
                    <a>天气 <span style="font-size: 14px;padding-left: 20px">{{WeatherWinterPre[0].tq}}</span></a>
                    <a>{{WeatherWinterPre[0].temp_low}}-{{WeatherWinterPre[0].temp_high}}℃，{{WeatherWinterPre[0].wd}}，{{WeatherWinterPre[0].ws}}</a>
                </div>
                <div class="data_water2">
                    <p v-if="WeatherWinterPre[1].date">{{WeatherWinterPre[1].date}}</p>
                    <a>AQI日报范围<span>{{WeatherWinterPre[1].minaqi}}-{{WeatherWinterPre[1].maxaqi}}</span></a><br/>
                    <!---->
                    <a>级别 <span class="tian"></span><span v-show="twolan"><img
                            :src="'../../../static/imgs/mues/cainuan/'+this.getImagesTarget(WeatherWinterPre[1].minQuality)+'.png'"
                            alt=""><i>~</i></span><span><img
                            :src="'../../../static/imgs/mues/cainuan/'+this.getImagesTarget(WeatherWinterPre[1].maxQuality)+'.png'"
                            alt=""></span></a><br/>
                    <a>首要污染物<span>{{WeatherWinterPre[1].mainpoll}}</span></a>
                    <a>天气 <span style="font-size: 14px;padding-left: 20px">{{WeatherWinterPre[1].tq}}</span></a>
                    <a>{{WeatherWinterPre[1].temp_low}}-{{WeatherWinterPre[1].temp_high}}℃，{{WeatherWinterPre[1].wd}}，{{WeatherWinterPre[1].ws}}</a>
                </div>
                <div class="data_water3" v-if="WeatherWinterPre[2]">
                    <p v-if="WeatherWinterPre[2].date">{{WeatherWinterPre[2].date}}</p>
                    <a>AQI日报范围<span>{{WeatherWinterPre[2].minaqi}}-{{WeatherWinterPre[2].maxaqi}}</span></a><br/>
                    <!---->
                    <a>级别 <span class="tian"></span><span v-show="treelan"><img
                            :src="'../../../static/imgs/mues/cainuan/'+this.getImagesTarget(WeatherWinterPre[2].minQuality)+'.png'"
                            alt=""><i>~</i></span><span><img
                            :src="'../../../static/imgs/mues/cainuan/'+this.getImagesTarget(WeatherWinterPre[2].maxQuality)+'.png'"
                            alt=""></span></a><br/>
                    <a>首要污染物<span>{{WeatherWinterPre[2].mainpoll}}</span></a>
                    <a>天气 <span style="font-size: 14px;padding-left: 20px">{{WeatherWinterPre[2].tq}}</span></a>
                    <a>{{WeatherWinterPre[2].temp_low}}-{{WeatherWinterPre[2].temp_high}}℃，{{WeatherWinterPre[2].wd}}，{{WeatherWinterPre[2].ws}}</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {bus} from '@/js/bus.js'
    import api from '../../api/index'
    import BattleMap from '@/map/BattleMap'
    import WinterProgress from '@/components/WinterProgress'
    import Weather from '@/map/controls/WeatherCom'

    export default {
        name: 'likewinter',
        data() {
            return {
                //
                arAQI:'AQI',
                //
                activeName_AQI:'aqi',
                //下拉列表
                selectrb:true,
                //横类型tab
                hengtab:false,
                //今日控制值页面
                activeName_jrkz:false,
                //今日若保页面
                activeName_jrrb:true,
                //页面默认数据
                left: '',
                //记录当前页面宽度
                screenWidth: document.body.clientWidth,
                //今日控制目标默认展示
                activeName_b:'PM2.5',
                //默认选中模块三廊坊市秋冬季采暖期考核
                activeName_s: 'first_s',
                //默认选中模块四大气污染改善
                activeName_t: 'fourth_t',
                //默认选中模块五空气质量监测
                activeName_f: 'first_f',
                //默认选中模块三县市区周考核
                activeName_z: 'first_z',
                //默认选中模块三采暖考核全期
                activeName_a: 'first_a',
                //默认选中模块五中工地扬尘pm2.5
                activeName_w: 'first_w',
                //默认选中经济数据
                activeName_j: 'first_j',
                //天气预报板块01
                onelan: true,
                //天气预报板块02
                twolan: true,
                //天气预报板块03
                treelan: true,
                //暂时无用
                currentRow: null,
                //
                pagesize: 5,
                //
                currentPage: 1,
                //
                totalCount: 0,
                //我市74城市年倒排截止时间
                onetime: '',
                //我市实时AQI为截止时间
                twotime: '',
                //空气质量监测数据
                kongqiData: [],
                //pm2.5数据
                PM25Data: [],
                //pm10数据
                PM10Data: [],
                //企业数据
                EnterpriseData: [],
                //目标控制值
                SoutypeData: [],
                //
                LfAirWinterPre: {},
                //
                WeatherWinterPre: [],
                //市区组数据
                shiQuData:[],
                //环京县市组
                huanJingData:[],
                //南部县市组
                nanBuData:[],
                //大气污染改善pm2.5数据
                pm25: {ymin: 60, ymax: 105, vd: 15, data: [100, 85, 66, 61]},
                //大气污染改善pm10数据
                pm10: {ymin: 100, ymax: 160, vd: 20, data: [159, 137, 112, 108]},
                //大气污染改善so2数据
                so2: {ymin: 10, ymax: 40, vd: 10, data: [36, 24, 18, 13]},
                //大气污染改善no2数据
                no2: {ymin: 40, ymax: 55, vd: 5, data: [49, 47, 52, 47]},
                //大气污染改善co数据
                co: {ymin: 3.0, ymax: 3.9, vd: 0.3, data: [3.6, 3.4, 3.5, 3.1]},
                //大气污染改善o3数据
                o3: {ymin: 160, ymax: 220, vd: 20, data: [165, 171, 182, 217]},
                //大气污染改善综指数据
                zz: {ymin: 6, ymax: 9, vd: 1, data: [8.86, 7.89, 7.11, 6.82]},
                //用电量数据
                Diandata: {},
                //控制目标数据
                SouDataList: [],
                //预警数据
                yujingAallData: [],
                //市三区考核数据
                shisanquData: [
                    {
                        shiname: '广阳区',
                        pm25: '51',
                        bianhua: '-44.57%',
                        rink: '1'
                    },
                    {
                        shiname: '安次区',
                        pm25: '49',
                        bianhua: '-43.68%',
                        rink: '2'
                    },
                    {
                        shiname: '开发区',
                        pm25: '51',
                        bianhua: '-37.80%',
                        rink: '3'
                    }
                ],
                //南部县市考核数据
                nanbuData: [
                    {
                        shiname: '文安县',
                        pm25: '58',
                        bianhua: '-58.87%',
                        rink: '1'
                    },
                    {
                        shiname: '大城县',
                        pm25: '58',
                        bianhua: '-54.33%',
                        rink: '2'
                    },
                    {
                        shiname: '霸州市',
                        pm25: '65',
                        bianhua: '-48.41%',
                        rink: '3'
                    },

                ],
                //环京县市考核数据
                huanjingData: [
                    {
                        shiname: '大厂县',
                        pm25: '51',
                        bianhua: '-56.78%',
                        rink: '1'
                    },
                    {
                        shiname: '三河市',
                        pm25: '51',
                        bianhua: '-56.41%',
                        rink: '2'
                    },
                    {
                        shiname: '香河县',
                        pm25: '48',
                        bianhua: '-55.56%',
                        rink: '3'
                    },
                    {
                        shiname: '固安县',
                        pm25: '51',
                        bianhua: '-54.87%',
                        rink: '4'
                    },
                    {
                        shiname: '永清县',
                        pm25: '58',
                        bianhua: '-53.23%',
                        rink: '5'
                    }
                ],
                //能源消耗数据
                nenyuanData: [
                    {
                        zhibiao: '规模以上工业能耗',
                        danwei: '万吨标准煤',
                        qiansan: '504.23',
                        zensu: '-2.86'
                    },
                    {
                        zhibiao: '规模以上工业单位增加值能耗',
                        danwei: '吨标准煤/万元',
                        qiansan: '0.846',
                        zensu: '-5.32'
                    },
                    {
                        zhibiao: '全社会用电',
                        danwei: '亿千瓦时',
                        qiansan: '203.83',
                        zensu: '4.93'
                    },
                    {
                        zhibiao: '#工业用电量',
                        danwei: '亿千瓦时',
                        qiansan: '132.40',
                        zensu: '0.17'
                    }
                ],
                //区县用电量时间
                DianTime: '',
                //距离年底时间
                timeShow: '',
                //距离冬防时间
                timeShow2: '',
                //大气污染类型
                DaqiType: 'PM2.5',
                //大气污染单位
                DaqiDanw: '(微克/立方米)',
                //tvoc数据
                TvocData: [],
                //模块一控制目标数据
                //默认tab样式选择
                selected:0,
                //选择器元素
                items: [{select:'PM2.5'}, {select:'PM10'}, {select:'SO2'}, {select:'NO2'}, {select:'CO'}, {select:'O3'}],
                //提示点
                red_dian:true,
                //要保选项
                qualitys:[],
                //要保值所以数据
                iscallData:{},
                //保值列表
                listDataTable:[],
                //筛选后数据
                xuanzeData:[],
                //预警数据保存
                yujingData:{},
                //储存选中对象
                devcell:{},
				//月累计综指
				sevenMonthComplex:[],
				eightMonthComplex:[],
				//月累计排名
				sevenMonthRange:[],
				eightMonthRange:[],
				//月累计空气质量(优良)
				sevenFine:[],
				eightFine:[],
				//月累计空气质量(重污染)
				sevenBad:[],
				eightBad:[],
				//年累计综指
				sevenYearComplex:[],
				eightYearComplex:[],
				//年累计排名
				sevenYearRange:[],
				eightYearRange:[],
				//年累计空气质量(优良)
				sevenYearFine:[],
				eightYearFine:[],
				//年累计空气质量(重污染)
				sevenYearBad:[],
				eightYearBad:[],
				year:'2018',
				month:'',
				day:''
            };
        },
        created() {
            //created 创建完毕状态====
            //初始化页面所有数据
            this.getInitDataList();
            //更新时间
            this.OneTimesData(-1);
            //时间更新
            this.TwoTimesData();
            //默认选中优
            this.getbaoliangyouRes('0501');
			this.monthnow();//当前月
        },
        mounted() {
            let t = this;
            //mounted 挂载结束状态=====
            setTimeout(()=>{
                t.DataConsumption(this.pm25);
                t.YearRange();
                t.AirQuality();
                t.MonthAir();
                t.MonthRange();
                //初始化显示预警控制优
                this.selectStyle ({select:'PM2.5'},0);
                //初始化控制目标
                this.actvieChange({name:"PM2.5"})
            },900);
            //获取月考核数据
            this.GetMonthCheck();
            //获取月度累计综指排名
            this.GetWinterPreComIndexMonthPc();
            //获取月度累计空气质量
            this.GetWinterPrePollutionDaysMonthPc();
            //获取年度累计综指排名
            this.GetWinterPreComIndexYearPc();
            //获取年度累计空气质量
            this.GetWinterPrePollutionDaysYearPc();
            //冬防倒计时
            this.WinterCountDown();
            //
            this.intekqzlChange('aqi')
			//reisze事件
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth;
                    t.screenWidth = window.screenWidth;
                })()
            }
        },
        watch: {
            screenWidth (val) {
                if (!this.timer) {
                    this.screenWidth = val;
                    this.timer = true;
                    let that = this;
                    setTimeout(function () {
                        //监测屏幕大于1700重新运行图例
                        if(that.screenWidth > 1700){
//                          console.log('执行次参照')
                            //刷新页面
                            window.location.reload();
                        }
                        //监测屏幕小于1400重新运行图例
                        if(that.screenWidth < 1400){
//                          console.log('执行次参照')
                            //刷新页面
                            window.location.reload();
                        }
                        that.timer = false
                    }, 400)
                }
            }
        },
        methods: {
            //当前月
             monthnow(){
				 var now   = new Date();
				 this.month = new Date().getMonth()+1;
				 this.day = new Date().getDate();
			},
            backroundlicolor(shinum,shengnum){
                let kcolor = ''
                if(shinum > shengnum){
                    kcolor = 'background:rgb(255,0,0);color:#fff'
                }else if(shinum < shengnum){
                    kcolor = 'background:rgb(0,228,0);color:#fff'
                }else if(shinum = shengnum){
                    kcolor = 'background:rgb(225,126,0);color:#000'
                }
                //console.log(kcolor)
                return kcolor
            },
            //
            handleClickKKK(val){
                //
                console.log(val.label)
                this.arAQI = val.label;
                this.intekqzlChange(val.name);
            },
        	//月综指切换
        	monthRangeChange(){
        		this.year = $('#MonthRangeSelect').val();
        		this.GetWinterPreComIndexMonthPc();
        	},
        	//年综指切换
        	YearRangeChange(){
        		this.year = $('#YearRangeSelect').val();
        		this.GetWinterPreComIndexYearPc();
        	},
        	//月空气质量切换
        	monthAirChange(){
        		this.year = $('#MonthAirSelect').val();
        		this.GetWinterPrePollutionDaysMonthPc();
        	},
        	//年空气质量切换
        	YearAirChange(){
        		this.year = $('#YearAirSelect').val();
        		this.GetWinterPrePollutionDaysYearPc();
        	},
            //今日控制目标切换事件
            selectStyle (cell,index) {
                const _this = this;
                //选中数据
                let value = cell.select;
                //控制显示选中样式
                _this.selected = index;
                //存储当前选中对象
                _this.devcell = cell;
                //分类数据展示请求
                _this.xuanzeData = _this.getPointByType(value);
            },
            //今日控制目标选项
            actvieChange(value){
                const _this = this;
//              console.log(value.name);
                let data = value.name;
//              console.log(_this.getPointByTypekey(data));
                //保存预警数据
                _this.yujingData = _this.getPointByTypekey(data);
            },
            //今日若保选项
            TodayPacketValue(){
                const _this = this;
                let value = $("#selectrb").val();
//              console.log(value);
                switch (value){
                    case "----":
//                      console.log('今日控制');
                        _this.activeName_jrkz = true;
                        _this.activeName_jrrb = false;
                        _this.hengtab = true;
                        break;

                    default:
//                      console.log('今日若保');
                        _this.activeName_jrkz = false;
                        _this.activeName_jrrb = true;
                        _this.hengtab = false;
                        break;
                }
                //请求数据若保
                if(value != '----'){
                    //请求若保值更改项
                    this.getbaoliangyouRes(value);
                    //若保值改变站点累计更改
                    setTimeout(() =>{
                        this.selectStyle (this.devcell,this.selected)
                    },500)
                }
            },
            //跟新数据时间1
            OneTimesData(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                var y = dd.getFullYear();
                var m = dd.getMonth() + 1;//获取当前月份的日期
                var d = dd.getDate();
                this.onetime = m + '月' + d + '日';
            },
            //跟新数据时间2
            TwoTimesData() {
                var date = new Date(),
                    Y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate(),
                    H = date.getHours() - 1,
                    i = date.getMinutes(),
                    s = date.getSeconds();
                if (m < 10) {
                    m = '0' + m;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                if (H < 10) {
                    H = '0' + H;
                }
                if (i < 10) {
                    i = '0' + i;
                }
                if (s < 10) {
                    s = '0' + s;
                }
                var p = H + '时';
                this.twotime = p;
            },
            //冬防战报倒计时
            WinterCountDown() {
                let t = this;
                var times = new Date();
                //据冬防结束
                var timesout = new Date("2018/11/15 00:00:00");
                //据年底
                var timesout2 = new Date("2018/12/31 00:00:00");
                //现在时间
                var timesg = times.getTime();
                //结束时间1
                var timeoutg = timesout.getTime();
                //结束时间2
                var timeoutg2 = timesout2.getTime();
                //001
                var timescha = parseFloat(timeoutg) - parseFloat(timesg);
                var days = Math.floor(timescha / 1000 / 60 / 60 / 24);
                //002
                var timescha2 = parseFloat(timeoutg2) - parseFloat(timesg);
                var days2 = Math.floor(timescha2 / 1000 / 60 / 60 / 24);
                setTimeout(() => {
                    t.timeShow = days;
                    t.timeShow2 = days2;
                }, 100)

            },
            //冬防战报切换地图
            BusTableClick() {
                //0:空气  1:工地  2:企业 3:tvoc
                let typecode
                if (this.activeName_f == 'first_f') {
                    //0:空气
                    typecode = 0;
                } else if (this.activeName_f == 'second_f') {
                    //1:工地
                    typecode = 1;
                } else if (this.activeName_f == 'third_f') {
                    //2:企业
                    typecode = 2;
                } else if (this.activeName_f == 'fourth_f') {
                    //3:tvoc
                    typecode = 3;
                }

                bus.$emit('targetPollution', typecode);
            },
            //判断大气污染值类型
            DaQiWuRanTuBiao() {
                let indexcode = $("#selectID").val();
                // console.log(indexcode);
                switch (indexcode) {
                    case 'PM2.5':
                        this.DaqiType = 'PM2.5';
                        this.DaqiDanw = '(微克/立方米)';
                        this.DataConsumption(this.pm25);
                        break;
                    case 'PM10':
                        this.DaqiType = 'PM10';
                        this.DaqiDanw = '(微克/立方米)';
                        this.DataConsumption(this.pm10);
                        break;
                    case 'SO2':
                        this.DaqiType = 'SO2';
                        this.DaqiDanw = '(微克/立方米)';
                        this.DataConsumption(this.so2);
                        break;
                    case 'NO2':
                        this.DaqiType = 'NO2';
                        this.DaqiDanw = '(微克/立方米)';
                        this.DataConsumption(this.no2);
                        break;
                    case 'CO':
                        this.DaqiType = 'CO';
                        this.DaqiDanw = '(毫克/立方米)';
                        this.DataConsumption(this.co);
                        break;
                    case 'O3':
                        this.DaqiType = 'O3';
                        this.DaqiDanw = '(微克/立方米)';
                        this.DataConsumption(this.o3);
                        break;
                    case '综指':
                        this.DaqiType = '综指';
                        this.DaqiDanw = '';
                        this.DataConsumption(this.zz);
                        break;
                    default:
                        this.DaqiType = 'PM2.5';
                        this.DaqiDanw = '(微克/立方米)';
                        this.DataConsumption(this.pm25);
                        break;
                }

            },
            //获取月累计综指
            GetWinterPreComIndexMonthPc(){
            	let year = this.year;
            	let t = this;
            	api.GetWinterPreComIndexMonthPc(year).then(res=>{
            		let MonthRange = res.data.Data;
//          		console.log(MonthRange);
            		MonthRange.forEach(item=>{
            			if(item.legend==year-1+'月综指'){
            				t.sevenMonthComplex = [];
            				item.series.forEach(item=>{
            					t.sevenMonthComplex.push(item.value);
            				})
            			}
            			if(item.legend==year-1+'月排名'){
            				t.sevenMonthRange = [];
            				item.series.forEach(item=>{
            					t.sevenMonthRange.push(item.value);
            				})
            			}
            			if(item.legend==year+'月综指'){
            				t.eightMonthComplex = [];
            				item.series.forEach(item=>{
            					t.eightMonthComplex.push(item.value);
            				})
            			}
            			if(item.legend==year+'月排名'){
            				t.eightMonthRange = [];
            				item.series.forEach(item=>{
            					t.eightMonthRange.push(item.value);
            				})
            			}
            		})
            		t.MonthRange();
            	});

            },
            //月累计空气质量
            GetWinterPrePollutionDaysMonthPc(){
            	let year = this.year;
            	let t = this;
            	api.GetWinterPrePollutionDaysMonthPc(year).then(res=>{
            		console.log(res.data.Data)
            		let data = res.data.Data;
            		data.forEach(item=>{
            			if(item.name=='优良天'&&item.legend==year-1){
            				t.sevenFine = [];
            				t.sevenFine = item.series;
            			}
            			if(item.name=='优良天'&&item.legend==year){
            				t.eightFine = [];
            				t.eightFine = item.series;
            			}
            			if(item.name=='重污染'&&item.legend==year-1){
            				t.sevenBad = [];
            				t.sevenBad = item.series;
            			}
            			if(item.name=='重污染'&&item.legend==year){
            				t.eightBad = [];
            				t.eightBad = item.series;
            			}
            		})
            		if($('.FineDay').hasClass('selec')){
            			t.MonthAir();//月度优良
            		}else{
            			t.MonthAirPollution();//月度重污染
            		}

            	})
            },
            //获取年度累计综指
            GetWinterPreComIndexYearPc(){
            	let year = this.year;
            	let t = this;
            	api.GetWinterPreComIndexYearPc(year).then(res=>{
            		let YearRange = res.data.Data;
//          		console.log(YearRange);
            		YearRange.forEach(item=>{
            			if(item.legend==year-1+'月综指'){
            				t.sevenYearComplex = [];
            				item.series.forEach(item=>{
            					t.sevenYearComplex.push(item.value);
            				})
            			}
            			if(item.legend==year-1+'月排名'){
            				t.sevenYearRange = [];
            				item.series.forEach(item=>{
            					t.sevenYearRange.push(item.value);
            				})
            			}
            			if(item.legend==year+'月综指'){
            				t.eightYearComplex = [];
            				item.series.forEach(item=>{
            					t.eightYearComplex.push(item.value);
            				})
            			}
            			if(item.legend==year+'月排名'){
            				t.eightYearRange = [];
            				item.series.forEach(item=>{
            					t.eightYearRange.push(item.value);
            				})
            			}
            		})
            		t.YearRange();
            	});
            },
            //获取年度空气质量数据
            GetWinterPrePollutionDaysYearPc(){
            	let year = this.year;
            	let t = this;
            	api.GetWinterPrePollutionDaysYearPc(year).then(res=>{
//          		console.log(res.data.Data)
            		let data = res.data.Data;
            		data.forEach(item=>{
            			if(item.name=='优良天'&&item.legend==year-1){
            				t.sevenYearFine = item.series;
            			}
            			if(item.name=='优良天'&&item.legend==year){
            				t.eightYearFine = item.series;
            			}
            			if(item.name=='重污染'&&item.legend==year-1){
            				t.sevenYearBad = item.series;
            			}
            			if(item.name=='重污染'&&item.legend==year){
            				t.eightYearBad = item.series;
            			}
            		})
            		if($('.FineDay').hasClass('selec')){
            			t.AirQuality();//年度优良
            		}else{
            			t.AirQualityPolltion();//年度污染
            		}
            	})
            },
            //年度累计综指排名图表
            YearRange(){
            	let year = this.year;
            	let t = this;
            	let myChart = echarts.init(document.getElementById('maintubiao'));
        		// 指定图表的配置项和数据

				let options = {
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            crossStyle: {
				                color: '#999'
				            }
				        }
				    },
				    toolbox: {
				        feature: {
				            dataView: {show: false, readOnly: false},
				            magicType: {show: false, type: ['line', 'bar']},
				            restore: {show: false},
				            saveAsImage: {show: false}
				        }
				    },
				    legend: {
				        data:[{name:'进入倒排前10'},{name:year-1+'年月倒排'},{name:year+'年月倒排'},{name:year-1+'年月综指',icon:''},{name:year+'年月综指',icon:''}],
				        x: 'left',
        				y: 'bottom',
        				width:'550',
        				itemGap:0,
        				itemWidth:16,
        				align:'left',
        				textStyle: {
            				color: '#eee', // 图例文字颜色
            				fontSize:'12'
        				}

				    },
				    grid: {
				        left: '5%',
				        right: '8%',
				        containLabel: false
				    },
				    xAxis: [
				        {
				            type: 'category',
				            data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				            axisPointer: {
				                type: ''
				            },
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			splitNumber:12,
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色
			                    }
			            	},
				        }
				    ],
				    yAxis: [
				        {
				            type: 'value',
//				            name: '水量',
				            min: 0,
				            max: 50,
				            interval: 5,
				            splitLine:{show: false},//去除网格线
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色
			                    }
			            	},
				        },
				        {
				            type: 'value',
//				            name: '温度',
				            min: 0,
				            max: 12,
				            interval: 2,
				            splitLine:{show: false},//去除网格线
				            axisLabel: {
				                formatter: '{value}.00',
				                textStyle: {
			                        color: '#eee',//坐标值得具体的颜色
			                    }
				            },
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},

				        }
				    ],
				    series: [
				        {
				            name:'进入倒排前10',
				            type:'bar',
//				            data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				        },
				        {
				            name:year-1+'年月倒排',
				            type:'bar',
				            data:this.sevenYearRange,
				            itemStyle: {
				                normal: {
				                    color: function(params) {
				                        //判断柱子颜色
				                        let colorList = [];
				                        t.sevenYearRange.forEach(item=>{
				                        	if(item<=10){
				                        		colorList.push('#e23e3f');
				                        	}else{
				                        		colorList.push('#027fd9');
				                        	}
				                        })
				                        return colorList[params.dataIndex]
				                    }
				                }
				            }
				        },
				         {
				            name:year+'年月倒排',
				            type:'bar',
				            data:this.eightYearRange,
				            itemStyle: {
				                normal: {
				                    color: function(params) {
				                        // build a color map as your need.
				                        let colorList = [];
				                        t.eightYearRange.forEach(item=>{
				                        	if(item<=10){
				                        		colorList.push('#e23e3f');
				                        	}else{
				                        		colorList.push('#2ec8ca');
				                        	}
				                        })
				                        return colorList[params.dataIndex]
				                    }
				                }
				            }
				        },
				        {
				            name:year-1+'年月综指',
				            type:'line',
				            yAxisIndex: 1,
				            data:this.sevenYearComplex,
				            itemStyle: {
				                normal: {
				                    color: '#e48d48',
				                    lineStyle:{
				                        width:1,
				                        type:'solid'
				                    }
				                }
				            }
				        },
				        {
				            name:year+'年月综指',
				            type:'line',
				            yAxisIndex: 1,
//				            data:[2.8, 2.9, 3.8, 4,'-','-','-','-','-','-','-','-'],
							data:this.eightYearComplex,
				            itemStyle:{
				                normal:{
				                	color:'#3ac141',
				                    lineStyle:{
				                        width:1,
				                        type:'dotted'  //'dotted'虚线 'solid'实线
				                    }
				                }
				            },
				        }
				    ]
				};
			        // 使用刚指定的配置项和数据显示图表。
			        myChart.setOption(options);
            },
            //年度空气质量等级分布优良图表
            AirQuality(){
            	let year = this.year;
            	$('.qxtable .right .BadDay').removeClass('selec');
            	$('.qxtable .right .FineDay').addClass('selec');
            	let myChart = echarts.init(document.getElementById('airQuality'));

				let option = {
				    tooltip : {
				        trigger: 'axis',

				    },
				    legend: {
				        data:[year-1+'年',year+'年'],
				        x: 'center',
        				y: 'bottom',
        				textStyle: {
            				color: '#eee'          // 图例文字颜色
        				}
				    },
				    grid: {
				        left: '7%',
				        right: '2%',
				        containLabel: false
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				            splitLine:{show: false},//去除网格线
				            axisPointer: {
				                type: ''
				            },
				            axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色

			                    }
			            	},
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            splitLine:{show: false},//去除网格线
				            min: 0,
				            max: 250,
				            interval: 50,
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色

			                    }
			            	},
				        }
				    ],
				    series : [
				        {
				            name:year-1+'年',
				            type:'bar',
				            data:this.sevenYearFine,
				            itemStyle:{
	                            normal:{
	                                color:'#2394f2'
	                            }
                        	},
				        },

				        {
				            name:year+'年',
				            type:'bar',
				            data:this.eightYearFine,
				           	itemStyle:{
	                            normal:{
	                                color:'#2dc7c9'
	                            }
                        	},
				        },

				    ]
				};
            	myChart.setOption(option);
            },
            //年度空气质量等级分布重污染
            AirQualityPolltion(){
            	let year = this.year;
				$('.qxtable .right .BadDay').addClass('selec');
            	$('.qxtable .right .FineDay').removeClass('selec');
            	let myChart = echarts.init(document.getElementById('airQuality'));

				let option = {
				    tooltip : {
				        trigger: 'axis',

				    },
				    legend: {
				        data:[year-1+'年',year+'年'],
				        x: 'center',
        				y: 'bottom',
        				textStyle: {
            				color: '#eee'          // 图例文字颜色
        				}
				    },
				    grid: {
				        left: '7%',
				        right: '2%',
				        containLabel: false
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				            splitLine:{show: false},//去除网格线
				            axisPointer: {
				                type: ''
				            },
				            axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色

			                    }
			            	},
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            splitLine:{show: false},//去除网格线
				            min: 0,
				            max: 25,
				            interval: 5,
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色

			                    }
			            	},
				        }
				    ],
				    series : [
				        {
				            name:year-1+'年',
				            type:'bar',
				            data:this.sevenYearBad,
				            itemStyle:{
	                            normal:{
	                                color:'#2394f2'
	                            }
                        	},
				        },

				        {
				            name:year+'年',
				            type:'bar',
				            data:this.eightYearBad,
				           	itemStyle:{
	                            normal:{
	                                color:'#2dc7c9'
	                            }
                        	},
				        },

				    ]
				};
            	myChart.setOption(option);
            },
            //月度空气质量等级优良天
            MonthAir(){
            	let year = this.year;
            	$('.qxtable .right .BadDay').removeClass('selec');
            	$('.qxtable .right .FineDay').addClass('selec');
            	let myChart = echarts.init(document.getElementById('monthAirQuality'));
				let option = {
				    tooltip : {
				        trigger: 'axis',

				    },
				    legend: {
				        data:[year-1+'年',year+'年'],
				        x: 'center',
        				y: 'bottom',
        				textStyle: {
            				color: '#eee'          // 图例文字颜色
        				}
				    },
				    grid: {
				        left: '7%',
				        right: '2%',
				        containLabel: false
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				            splitLine:{show: false},//去除网格线
				            axisPointer: {
				                type: ''
				            },
				            axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色

			                    }
			            	},
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            splitLine:{show: false},//去除网格线
				            min: 0,
				            max: 25,
				            interval: 5,
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色

			                    }
			            	},
				        }
				    ],
				    series : [
				        {
				            name:year-1+'年',
				            type:'bar',
				            data:this.sevenFine,
				            itemStyle:{
	                            normal:{
	                                color:'#2394f2'
	                            }
                        	},
				        },
				        {
				            name:year+'年',
				            type:'bar',
				            data:this.eightFine,
				           	itemStyle:{
	                            normal:{
	                                color:'#2dc7c9'
	                            }
                        	},
				        },

				    ]
				};
            	myChart.setOption(option);
            },
            //月度空气质量重污染
            MonthAirPollution(){
            	let year = this.year;
            	$('.qxtable .right .BadDay').addClass('selec');
            	$('.qxtable .right .FineDay').removeClass('selec');
            	let myChart = echarts.init(document.getElementById('monthAirQuality'));
				let option = {
				    tooltip : {
				        trigger: 'axis',

				    },
				    legend: {
				        data:[year-1+'年',year+'年'],
				        x: 'center',
        				y: 'bottom',
        				textStyle: {
            				color: '#eee'          // 图例文字颜色
        				}
				    },
				    grid: {
				        left: '7%',
				        right: '2%',
				        containLabel: false
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				            splitLine:{show: false},//去除网格线
				            axisPointer: {
				                type: ''
				            },
				            axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色

			                    }
			            	},
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            splitLine:{show: false},//去除网格线
				            min: 0,
				            max: 25,
				            interval: 5,
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色

			                    }
			            	},
				        }
				    ],
				    series : [
				        {
				            name:year-1+'年',
				            type:'bar',
				            data:this.sevenBad,
				            itemStyle:{
	                            normal:{
	                                color:'#2394f2'
	                            }
                        	},
				        },

				        {
				            name:year+'年',
				            type:'bar',
				            data:this.eightBad,
				           	itemStyle:{
	                            normal:{
	                                color:'#2dc7c9'
	                            }
                        	},
				        },

				    ]
				};
            	myChart.setOption(option);
            },
            //月度综指图表
            MonthRange(){
            	let year = this.year;
            	let t = this;
            	let myChart = echarts.init(document.getElementById('MonthRange'));
        		// 指定图表的配置项和数据
				let options = {
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            crossStyle: {
				                color: '#999'
				            }
				        }
				    },
				    toolbox: {
				        feature: {
				            dataView: {show: false, readOnly: false},
				            magicType: {show: false, type: ['line', 'bar']},
				            restore: {show: false},
				            saveAsImage: {show: false}
				        }
				    },
				    legend: {
				        data:[{name:'进入倒排前10'},{name:year-1+'年月倒排'},{name:year+'年月倒排'},{name:year-1+'年月综指',icon:''},{name:year+'年月综指',icon:''}],
				        x: 'left',
        				y: 'bottom',
        				width:'550',
        				itemGap:0,
        				itemWidth:18,
        				align:'left',
        				textStyle: {
            				color: '#eee', // 图例文字颜色
            				fontSize:'12'
        				}

				    },
				    grid: {
				        left: '5%',
				        right: '9%',
				        containLabel: false
				    },
				    xAxis: [
				        {
				            type: 'category',
				            data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],

				            axisPointer: {
				                type: ''
				            },
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			splitNumber:12,
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色
			                    }
			            	},
				        }
				    ],
				    yAxis: [
				        {
				            type: 'value',
//				            name: '水量',
				            min: 0,
				            max: 50,
				            interval: 5,
				            splitLine:{show: false},//去除网格线
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},
                			axisLabel: {
				                 textStyle: {
			                        color: '#eee',//坐标值得具体的颜色
			                    }
			            	},
				        },
				        {
				            type: 'value',
//				            name: '温度',
				            min: 0,
				            max: 12,
				            interval: 2,
				            splitLine:{show: false},//去除网格线
				            axisLabel: {
				                formatter: '{value}.00',
				                textStyle: {
			                        color: '#eee',//坐标值得具体的颜色
			                    }
				            },
				             axisLine:{
		                        lineStyle:{
		                            color:'#2394f2'
		                        }
                			},

				        }
				    ],
				    series: [
				        {
				            name:'进入倒排前10',
				            type:'bar',
//				            data:['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
				        },
				        {
				            name:year-1+'年月倒排',
				            type:'bar',
							data:this.sevenMonthRange,
							itemStyle: {
				                normal: {
				                    color: function(params) {
				                        // build a color map as your need.
				                        let colorList = [];
				                        t.sevenMonthRange.forEach(item=>{
//				                        	console.log(item)
				                        	if(item<=10){
				                        		colorList.push('#e23e3f');
				                        	}else{
				                        		colorList.push('#0080d9');
				                        	}
				                        })
				                        return colorList[params.dataIndex]
				                    }
				                }
				            }
				        },
				         {
				            name:year+'年月倒排',
				            type:'bar',
							data:this.eightMonthRange,
							itemStyle: {
				                normal: {
				                    color: function(params) {
				                        // build a color map as your need.
				                        let colorList = [];
				                        t.eightMonthRange.forEach(item=>{
//				                        	console.log(item)
				                        	if(item<=10){
				                        		colorList.push('#e23e3f');
				                        	}else{
				                        		colorList.push('#2ec8ca');
				                        	}
				                        })
				                        return colorList[params.dataIndex]
				                    }
				                }
				            }
				        },
				        {
				            name:year-1+'年月综指',
				            type:'line',
				            yAxisIndex: 1,
							data:this.sevenMonthComplex,
							itemStyle: {
				                normal: {
				                	lineStyle:{
				                        width:1,
				                        type:'solid'
				                    },
				                    color: '#f8984b'
				                }
				            }

				        },
				        {
				            name:year+'年月综指',
				            type:'line',
				            yAxisIndex: 1,
//				            data:[2.8, 2.9, 3.8, 4,'-','-','-','-','-','-','-','-'],
							data:this.eightMonthComplex,
				            itemStyle:{
				                normal:{
				                	color:'#40f842',
				                    lineStyle:{
				                        width:1,
				                        type:'dotted'  //'dotted'虚线 'solid'实线
				                    }
				                }
				            },
				        }
				    ]
				};
			        // 使用刚指定的配置项和数据显示图表。
			        myChart.setOption(options);
            },
            // 用电量
            ElectricityConsumption() {
                let seriesData = this.Diandata.seriesData;
                let xAxisData = this.Diandata.xAxisData;
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('dian_type'));
                // 指定图表的配置项和数据
                let option = {

                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        data: ['用电量', '增长率'],
                        left: 'left',
                        textStyle: {
                            color: '#fff'
                        },
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: [],//xAxisData,//['广阳区','安次区','开发区','香河县','大厂县','三河市','固安县','永清县','霸州市','文安县','大城县'],
                            axisPointer: {
                                type: 'shadow'
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '单位(万千瓦时)',
                            min: 0,
                            max: 800,
                            interval: 200,
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#fff',
                                }
                            },
                            nameTextStyle: {
                                color: '#fff'
                            },
                        },
                        {
                            type: 'value',
                            name: '单位（%）',
                            min: -10,
                            max: 10,
                            interval: 5,
                            axisLabel: {
                                formatter: '{value}',
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            nameTextStyle: {
                                color: '#fff'
                            },
                        }
                    ],
                    series: [
                        {
                            name: '用电量',
                            type: 'bar',
                            //data:[],//[200.6, 500.9, 239.0, 296.4, 699.7, 470.7, 175.6, 182.2, 648.7, 718.8, 360.0],
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#83bff6'},
                                            {offset: 0.5, color: '#188df0'},
                                            {offset: 1, color: '#188df0'}
                                        ]
                                    )
                                },
                                emphasis: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#2378f7'},
                                            {offset: 0.7, color: '#2378f7'},
                                            {offset: 1, color: '#83bff6'}
                                        ]
                                    )
                                }
                            },
                        },
                        {
                            name: '环比',
                            type: 'line',
                            yAxisIndex: 1
                            //
                            // data:[],//seriesData[1].data//[1.0, 2.2, 3.3, 4.5, 6.3, 8.2, 9, 9.4, 5.0, 6.5, 2.0]
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。

                myChart.setOption(option);

                myChart.setOption({        //加载数据图表
                    xAxis: {
                        data: xAxisData
                    },
                    series: seriesData
                })
                //动态设置参数
            },
            // 大气污染改善
            DataConsumption(data) {
                let value = data.data;
                let yvalue = data.ydata;
                let min = data.ymin;
                let max = data.ymax;
                let vd = data.vd;
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('pmcodepc'));
                // 指定图表的配置项和数据
                let option = {

                    tooltip: {
                        trigger: 'axis'
                    },
                    yAxis: {
                        type: 'value',
//                        min: 120,
//                        max: 180,
//                        interval: 20,
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['2014', '2015', '2016', '2017'],
                            axisLabel: {
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name: '浓度指标',
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    areaStyle: {
                                        color: '#188DF0',
                                        type: 'default'
                                    },
                                    lineStyle: {
                                        color: '#188DF0',
                                        type: 'solid'
                                    }
                                },
                            },
                            // data:[100,260, 830, 710]
                        },

                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                //动态设置参数
                myChart.setOption({
                    yAxis: {
                        min: min,
                        max: max,
                        interval: vd,
                    },
                    series: [{
                        data: value
                    }]
                })
            },
            //获取更改要保值
            getbaoliangyouRes(qualityCode){
                api.GetBaoYouLiangRes(qualityCode).then(res =>{
                    let data = res.data.Data;
                    //console.log(data);
                    //全补数据
                    this.iscallData = data;
                    //
                    this.listDataTable = data.GskAlarms;
                })
            },
            //数据筛选要保值
            getPointByType(type) {
                let rtValue = [];
                let dt = this.listDataTable;
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
                        if (item.ItemName === type) {
                            rtValue.push(dt[i]);
                        }
                    }
                }
                return rtValue;
            },
            //数据筛选要保值
            getPointByTypekey(type) {
                let rtValue = [];
                let dt = this.SoutypeData;
                if (dt) {
                    for (let i = 0, length = dt.length; i < length; i++) {
                        let item = dt[i];
                        if (item.ControlItem === type) {
                            rtValue.push(dt[i]);
                        }
                    }
                }
                return rtValue;
            },
            //排序
            compare(propertyName) {
                return function (object1, object2) {
                    let value1 = object1[propertyName];
                    let value2 = object2[propertyName];
                    return value2 - value1
                }
            },
            //
            intekqzlChange(val){
                let datakey = val;
                this.kongqiData = [];
                //空气检测列表
                api.GetkqWinterPreAirControl().then(res => {

                    let data1 = res.data.Data;
                    let i = 1;
                    let data2 = data1.sort(this.compare(datakey));
                    data2.forEach(item => {
                        const tableData1 = {};
                        tableData1.xuhao = i++;//排名
                        tableData1.wlname = item.gridName ? item.gridName : '----';//城市id
                        tableData1.jiancedian = item.stationname;//纬度
                        tableData1.chaowrw = item[datakey];//经度
                        this.kongqiData.push(tableData1);
                    })
                })
            },
            //今日战报默认展示数据初始化话
            getInitDataList() {
                //获取今日控制目标和预警值及国控点数据
                api.GetLfAirAlerts().then(res => {
                    let data = res.data.Data;
                    this.yujingAallData = data.data;
                })

                //今日战报控制目标页面需要展示数据
                api.GetLfAirAlert().then(res => {
                    //
                    let data = res.data.Data;
                    //
                    this.SoutypeData = data;
                    //
                    data.forEach(item =>{
                        //今日控制目标
                        this.SouDataList.push(item.ControlItem);
                        //
                    })

                })
                //获取要保值编码
                api.GetAirQualityRes().then(res =>{
                    let codedata = res.data.Data;
                    //console.log(codedata);
                   this.qualitys = codedata;
                })
                //模块四空气排名
                api.GetLfAirWinterPre().then(res => {

                    let data = res.data.Data;
                    this.LfAirWinterPre = data;
                })
                //模块五未来三天天气
                api.GetWeatherWinterPre().then(res => {

                    let data = res.data.Data;
                    if (data[0].minQuality == data[0].maxQuality) {
                        this.onelan = false;
                    }
                    if (data[1].minQuality == data[1].maxQuality) {
                        this.twolan = false;
                    }
                    if(data[2]){
                        if (data[2].minQuality == data[2].maxQuality) {
                            this.treelan = false;
                        }
                    }
                    this.WeatherWinterPre = data;
                })
                //用电量数据
                api.GetElectricityChart().then(res => {

                    let data = res.data.Data;
                    let data2 = res.data.Message;
                    this.DianTime = data2;
                    this.Diandata = data;
                    setTimeout(() => {
                        this.ElectricityConsumption()
                    }, 400)
                })

                //企业列表数据
                api.GetqyWinterPreCompanyControl().then(res => {

                    let data2 = res.data.Data;
                    let i = 1;
                    data2.forEach(item => {
                        const tableData3 = {};
                        tableData3.SerialNumber = i++;//排名
                        tableData3.gridName = item.gridName;//城市id
                        tableData3.stationname = item.stationname;//纬度
                        tableData3.overItem = item.overItem;//经度
                        this.EnterpriseData.push(tableData3);
                    })
                })
                //工地列表数据
                api.GetgdWinterPreDustControl().then(res => {

                    let pm10data = res.data.Data.Pm10;
                    let pm25data = res.data.Data.Pm25;
                    let i = 1;
                    pm10data.forEach(item => {
                        const tableData1 = {};
                        tableData1.ranking = i++;//排名
                        tableData1.gridName = item.gridName;//城市id
                        tableData1.stationname = item.stationname;//纬度
                        tableData1.pm10 = item.pm10;//经度
                        this.PM10Data.push(tableData1);
                    })

                    pm25data.forEach(item => {
                        const tableData2 = {};
                        tableData2.ranking = (i++) - 10;//排名
                        tableData2.gridName = item.gridName;//城市id
                        tableData2.stationname = item.stationname;//纬度
                        tableData2.pm25 = item.pm25;//经度
                        this.PM25Data.push(tableData2);
                    })
                })
                //Tvoc列表数据
                api.GetWinterPreTVocControl().then(res => {
                    let data4 = res.data.Data;
                    let i = 1;
                    data4.forEach(item => {
                        const tableData4 = {};
                        tableData4.SerialNumber = i++;//排名
                        tableData4.gridName = item.gridName;//城市id
                        tableData4.stationname = item.pointName;//纬度
                        tableData4.overItem = item.tvoc;//经度
                        this.TvocData.push(tableData4);
                    })
                })
            },
            //获取月考核数据
           	GetMonthCheck(){
           		let date = new Date();
//         		let month = date.getMonth()+1;
				let month = '';
//         		let year = date.getFullYear();
           		let t = this;
//         		console.log(month,year)
           		api.GetMonthCheck(month).then(res => {
           			let allData = res.data.Data;
           			console.log(allData);
           			allData.forEach(item=>{
           				item.group == '市区组'&&t.shiQuData.push(item);
           				item.group == '环京县(市)组'&&t.huanJingData.push(item);
           				item.group == '南部县(市)'&&t.nanBuData.push(item);
           			})
           			console.log(t.shiQuData)
                })
           	},
            //图片背景跟换
            getImagesTarget(type) {
                let rtValue;
                switch (type) {
                    case '严重':
                        rtValue = 'du-yz';
                        break;
                    case '中度':
                        rtValue = 'du-zz';
                        break;
                    case '优':
                        rtValue = 'du-y';
                        break;
                    case '良':
                        rtValue = 'du-l';
                        break;
                    case '轻度':
                        rtValue = 'du-qd';
                        break;
                    case '重度':
                        rtValue = 'du-zd';
                        break;
                }
                return rtValue;
            },
            //非co进度条颜色值
            FcoBackgroundsColor(val) {
                let Degrees = val;
                let Vcolor;
                if (Degrees > 5) {

                    Vcolor = '#0f0'
                } else if (0 <= Degrees && Degrees <= 5) {

                    Vcolor = '#ff0'
                } else if (Degrees <= 0) {

                    Vcolor = '#f00'
                }
                return Vcolor;
            },
            //Co进度条颜色值
            CoBackgroundsColor(val) {
                let Degrees = val;
                let Vcolor;
                if (Degrees > 0.5) {

                    Vcolor = '#0f0'
                } else if (0 <= Degrees && Degrees <= 0.5) {

                    Vcolor = '#ff0'
                } else if (Degrees <= 0) {

                    Vcolor = '#f00'
                }
                return Vcolor;
            },
            //Co进度条颜色值
            AqiBackgroundsColor(val,type) {
                let TYPE = type;//pm2.5
                let Degrees = val;//数值
                let Vcolor;//返回颜色
                ////
                switch (TYPE){
                            case 'PM2.5':
                                if (0 <= Degrees && Degrees <= 35) {
                                    //绿色
                                    Vcolor = 'background:rgb(0,228,0);color:#fff'
                                } else if (35 <= Degrees && Degrees <= 75) {
                                    //黄色
                                    Vcolor = 'background:rgb(255,255,0);color:#000'
                                } else if (75 <= Degrees && Degrees <= 115) {
                                    //橙色
                                    Vcolor = 'background:rgb(225,126,0);color:#fff'
                                }else if (115 <= Degrees && Degrees <= 150) {
                                    //红色
                                    Vcolor = 'background:rgb(255,0,0);color:#fff'
                                }else if (150 <= Degrees && Degrees <= 250) {
                                    //紫色
                                    Vcolor = 'background:rgb(153,0,76);color:#fff'
                                }else if (Degrees >= 250) {
                                    ///黑红
                                    Vcolor = 'background:rgb(126,0,35);color:#fff'
                                }
                                break;
                            case 'PM10':
                                if (0 <= Degrees && Degrees <= 50) {
                                    //绿色
                                    Vcolor = 'background:rgb(0,228,0);color:#fff'
                                } else if (50 <= Degrees && Degrees <= 150) {
                                    //黄色
                                    Vcolor = 'background:rgb(255,255,0);color:#000'
                                } else if (150 <= Degrees && Degrees <= 250) {
                                    //橙色
                                    Vcolor = 'background:rgb(225,126,0);color:#fff'
                                }else if (250 <= Degrees && Degrees <= 350) {
                                    //红色
                                    Vcolor = 'background:rgb(255,0,0);color:#fff'
                                }else if (350 <= Degrees && Degrees <= 420) {
                                    //紫色
                                    Vcolor = 'background:rgb(153,0,76);color:#fff'
                                }else if (Degrees >= 420) {
                                    ///黑红
                                    Vcolor = 'background:rgb(126,0,35);color:#fff'
                                }
                                break;
                            case 'SO2':
                                if (0 <= Degrees && Degrees <= 50) {
                                    //绿色
                                    Vcolor = 'background:rgb(0,228,0);color:#fff'
                                } else if (50 <= Degrees && Degrees <= 150) {
                                    //黄色
                                    Vcolor = 'background:rgb(255,255,0);color:#000'
                                } else if (150 <= Degrees && Degrees <= 475) {
                                    //橙色
                                    Vcolor = 'background:rgb(225,126,0);color:#fff'
                                }else if (475 <= Degrees && Degrees <= 800) {
                                    //红色
                                    Vcolor = 'background:rgb(255,0,0);color:#fff'
                                }else if (800 <= Degrees && Degrees <= 1600) {
                                    //紫色
                                    Vcolor = 'background:rgb(153,0,76);color:#fff'
                                }else if (Degrees >= 1600) {
                                    ///黑红
                                    Vcolor = 'background:rgb(126,0,35);color:#fff'
                                }
                                break;
                            case 'CO':
                                if (0 <= Degrees && Degrees <= 2) {
                                    //绿色
                                    Vcolor = 'background:rgb(0,228,0);color:#fff'
                                } else if (2 <= Degrees && Degrees <= 4) {
                                    //黄色
                                    Vcolor = 'background:rgb(255,255,0);color:#000'
                                } else if (4 <= Degrees && Degrees <= 14) {
                                    //橙色
                                    Vcolor = 'background:rgb(225,126,0);color:#fff'
                                }else if (14 <= Degrees && Degrees <= 24) {
                                    //红色
                                    Vcolor = 'background:rgb(255,0,0);color:#fff'
                                }else if (24 <= Degrees && Degrees <= 36) {
                                    //紫色
                                    Vcolor = 'background:rgb(153,0,76);color:#fff'
                                }else if (Degrees >= 36) {
                                    ///黑红
                                    Vcolor = 'background:rgb(126,0,35);color:#fff'
                                }
                                break;
                            case 'O3':
                                if (0 <= Degrees && Degrees <= 100) {
                                    //绿色
                                    Vcolor = 'background:rgb(0,228,0);color:#fff'
                                } else if (100 <= Degrees && Degrees <= 160) {
                                    //黄色
                                    Vcolor = 'background:rgb(255,255,0);color:#000'
                                } else if (160 <= Degrees && Degrees <= 215) {
                                    //橙色
                                    Vcolor = 'background:rgb(225,126,0);color:#fff'
                                }else if (215 <= Degrees && Degrees <= 265) {
                                    //红色
                                    Vcolor = 'background:rgb(255,0,0);color:#fff'
                                }else if (265 <= Degrees && Degrees <= 800) {
                                    //紫色
                                    Vcolor = 'background:rgb(153,0,76);color:#fff'
                                }else if (Degrees >= 800) {
                                    ///黑红
                                    Vcolor = 'background:rgb(126,0,35);color:#fff'
                                }
                                break;
                            case 'NO2':
                                ///
                                if (0 <= Degrees && Degrees <= 40) {
                                    //绿色
                                    Vcolor = 'background:rgb(0,228,0);color:#fff'
                                } else if (40 <= Degrees && Degrees <= 80) {
                                    //黄色
                                    Vcolor = 'background:rgb(255,255,0);color:#000'
                                } else if (80 <= Degrees && Degrees <= 180) {
                                    //橙色
                                    Vcolor = 'background:rgb(225,126,0);color:#fff'
                                }else if (180 <= Degrees && Degrees <= 280) {
                                    //红色
                                    Vcolor = 'background:rgb(255,0,0);color:#fff'
                                }else if (280 <= Degrees && Degrees <= 565) {
                                    //紫色
                                    Vcolor = 'background:rgb(153,0,76);color:#fff'
                                }else if (Degrees >= 565) {
                                    ///黑红
                                    Vcolor = 'background:rgb(126,0,35);color:#fff'
                                }
                                break;
                        }
                        console.log(Vcolor);
                return Vcolor;
            },
        },
        components: {BattleMap, WinterProgress ,Weather},
    };


</script>
<style lang="scss" scoped>
    @import "../../styles/carousel"; //轮播图样式
    .control {
        width: 100%;
        height: 100%;
        color: white;
        padding: 5px 10px;
    }

    .pm h2 {
        font-size: 21px;
        font-family: 'Arial-BoldMT';
        margin: 0;
        float: left
    }

    .pm .yujing {
        font-size: 12px;
        font-family: "Microsoft YaHei";
        color: #BECBEC;
        float: right
    }

    .top div, .under div {
        font-size: 14px;
        font-family: 'Microsoft YaHei';
        position: relative;
        /* left:-50%*/
    }

    .top, .under {
        display: inline-block;
        text-align: left;
        position: relative;
        left: 0;
        width: 330px;
    }

    .top {
        bottom: -16px;
    }

    .under {
        top: -16px;
    }

    .real {
        transform: rotate(180deg)
    }

    //今日控制目标
    .htt-one-up .item {
        display: inline-block;
        margin-bottom: 5px;
        width: 160px;
    }

    .htt-one-up .item div:nth-child(1) {
        font-size: 16px;
        font-weight: bolder;
    }

    .htt-one-up .item div:nth-child(2) {
        font-size: 12px;
        color: #BECBEC;
    }

    .htt-one-up .colLine {
        height: 35px;
        width: 1px;
        margin-bottom: -5px;
        background: #17558F;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
    }
    .item-kz-class{
        width: 94%;
        margin: 0 auto;
        .kz-class{
            margin-top: 10px;
        }
        .rb-class{
            margin-top: 10px;
        }
    }

    //媒体查询
    @media only screen and (min-width: 1400px) {

        .Window_one {
            height: 365px !important;
        }
        .Window_Two {
            height: 365px !important;
        }
        .Window_Three {
            height: 438px !important;
        }
        .Window_Four {
            height: 336px !important;
        }
        .Window_Five {
            height: 336px !important;
        }
        .Window_six {
            height: 262px !important;
        }
        /*----------*/
        #MonthRange{
            width: 650px!important;
        }
        #maintubiao{
            width: 650px!important;
        }
        #monthAirQuality{
            width: 650px!important;
        }
        #airQuality{
            width: 650px!important;
        }
        /*---大屏预警管控---*/
        .pp_tab{
            li{
                width: 66px!important;
            }
        }
        .bao_left{
            margin-right: 15px!important;
        }
        .bao_right{
            dl{
                margin-right: 12px!important;
            }
        }
        .item_text4{
            height: 330px!important;
        }
        /*---大屏幕大气污染图例--*/
        #pmcodepc{
            width: 96%!important;
            height: 250px!important;
            margin-left: 10px!important;
        }
        /*---用电量---*/
        #dian_type{
            margin-top: 15px!important;
            width: 453px!important;
            height: 250px!important;
            margin-left: 10px!important;
        }
    }

    //
    .Like-winter {
        width: 100%;
        height: auto;
        color: #fff;
        background: #242953;
        .right{
        	float: right;
        }
        .title {
            width: 1324px;
            height: auto;
            margin: 0 auto;
            position: relative;
            h1 {
                margin: 0;
                font-size: 44px;
                line-height: 80px;
                color: #b0d6fa;
                letter-spacing: 64px;
            }
            .text_left {
                top: 25px;
                left: 2px;
                text-align: left;
                font-size: 16px;
                position: absolute;
                width: 370px;
                height: 60px;
                color: #fff;
                border: none;
                .oline1 {
                    span {
                        padding-left: 4px;
                        font-size: 18px;
                        font-weight: bold;
                        color: #c7254e;
                    }
                }
            }
            .txtshow {
                top: 25px;
                right: 10px;
                font-size: 19px;
                position: absolute;
                width: 478px;
                height: 60px;
                color: #fff;
                border: none;
                .juli_one {
                    float: left;
                }
                .juli_two {
                    float: right;
                }
                span {
                    font-size: 22px;
                    padding: 0 4px;
                    font-weight: bold;
                    color: #ce453d;
                }
            }
        }
        .qxtable {
            width: 100%;
            height: 15px;
            text-align: left;
            margin-top: 22px;
            margin-bottom: 9px;
            color: #BECBEC;
            i {
                display: inline-block;
                width: 3px;
                height: 12px;
                margin-right: 5px;
                margin-top: 4px;
                margin-left: 10px;
                float: left;
                background: #005BEA;
                background: -webkit-linear-gradient(top, #00C6FB, #005BEA);
            }
            a {
                padding: 0 4px;
                color: #ccc;
            }
        }
        .warp_box {
            width: 1324px;
            overflow-y: auto;
            overflow-x: hidden;
            padding-bottom: 20px;
            margin: 0 auto;
        }
        .Window_one {
            width: 370px;
            height: 305px;
            border: solid 1px #428bca;
            background: #1d2339;
            float: left;
            overflow: hidden;
            position: relative;

            .item_text4{
                overflow-x: hidden;
                overflow-y: auto;
                height: 268px;
            }
            .winter_one_top01,.winter_one_top02{
                position: absolute;
                top: 6px;
                right: 10px;
            }
            .tt-text{
                width: 100%;
                height: 40px;
                border-bottom: solid 1px #428bca;
                line-height: 40px;
                p{
                    text-align: left;
                    padding-left: 10px;
                }
            }
            .tt-tab{
                width: 100%;
                height: 40px;
                line-height: 40px;
                .tt-tab-l{
                    float: left;
                    font-size: 12px;
                    width: 94px;
                    height: 40px;
                    padding-left: 0px;
                    border-bottom: 1px solid #ccc;
                }
                .tt-tab-r{
                    float: left;
                    width:  calc(100% - 94px);
                }
            }
            .qxtable_bottom{
                width: 100%;
                height: 22px;
                text-align: left;
                margin-bottom: 4px;
                color: #BECBEC;
                .tb_ul{
                    float: right;
                    margin-right:20px;
                    overflow: hidden;
                    li{
                        list-style: none;
                        text-align: center;
                        float: left;
                        font-size: 12px;
                        cursor: pointer;
                        width:50px;
                        border-bottom: solid 1px #fff;
                    }
                    .bottomColor{
                        border-bottom: solid 2px #1e68d1;
                        //background: #666;
                    }
                }
                i {
                    display: inline-block;
                    width: 3px;
                    height: 12px;
                    margin-right: 5px;
                    margin-top: 4px;
                    margin-left: 10px;
                    float: left;
                    background: #005BEA;
                    background: -webkit-linear-gradient(top, #00C6FB, #005BEA);
                }
                a {
                    padding: 0 4px;
                    color: #ccc;
                }
            }
            .winter_bao_top{
                width: 100%;
                height: 70px;
                overflow: hidden;
                .bao_left{
                    margin-top: 3px;
                    float: left;
                    width: 60px;
                    margin-right: 0px;
                    dl{
                        width: 63px;
                    }
                }
                .bao_right{
                    float: left;
                    height: 60px;
                    dl{
                        width: 40px;
                        float: left;
                        margin-left: 4px;
                        .w_title{
                            font-size: 13px;
                        }
                        .w_value{
                            display: inline-block;
                            width: 100%;
                            height: 18px;
                            color: #494949;
                            line-height: 18px;
                            border-radius: 3px;
                        }
                        dd{
                            margin-top: 2px;
                            position: relative;
                            .jb_dian{
                                border: solid 1px #fff;
                                position: absolute;
                                top:calc(50% - 3px);
                                right: -1px;
                                display: inline-block;
                                width: 6px;
                                height: 6px;
                                border-radius: 50%;
                                background: red;
                            }

                        }

                    }
                }
            }
            .conten_detail {
                text-align: left;
                padding-left: 10px;
            }
            .detail {
                width: 100%;
                height: auto;
                div:nth-child(1) {
                    line-height: 13px;
                    width: 10%;
                    text-align: left;
                }
            }
            .item_text1 {
                width: 100%;
                height: 24px;
                font {
                    float: right;
                    padding-right: 10px;
                    padding-top: 4px;
                }
            }
            .item_text3 {
                width: 100%;
                height: 24px;
                line-height: 34px;
                text-align: left;
                padding-left: 20px;
                border-bottom: solid 1px #ccc;

                a {
                    padding: 0 4px;
                    color: #ccc;
                }
            }
        }
        .Window_Two {
            width: 428px;
            height: 305px;
            border: solid 1px #428bca;
            background: #1d2339;
            float: left;
            overflow: hidden;
    .class-fx{
      width: 130px;
      height: 38px;
      position: absolute;
      top: 10px;
        overflow: hidden;
      z-index: 9999;
      left: 10px;
        .weather_panel{
            margin-top: -4px;
        }
    }
        }
        .Window_Three {
            width: 480px;
            height: 378px;
            border: solid 1px #428bca;
            background: #1d2339;
            float: left;
            overflow-x: hidden;
            overflow-y: auto;
            .qxtable{
                .left{
                    float: left;
                }
                .right{
                    float: right;
                    margin-right: 30px;
                    li{
                    	cursor: pointer;
                        list-style: none;
                        float: left;
                        padding: 0 5px;
                        color: #fff;
                        font-size: 12px;
                    }
                    .selec{
                        background: #2394f2;
                    }
                }
            }
			.endTime{
				font-size: 8px;
				color: #5d77a9;
				margin-right: 20px;
				span{
					color: #adbadb;
				}
			}
            //采暖考核模块
            .item_banyuan {
                width: 460px;
                height: 88px;
                margin-top: 9px;
                margin-left: 9px;
                .obay_1 {
                    float: left;
                    width: 186px;
                    height: 88px;
                    border-left: solid 1px #7c7056;
                    overflow: hidden;
                    background: url("../../../static/imgs/mues/cainuan/l-bg2.png") right no-repeat;
                    position: relative;
                    .title_baay {
                        height: 32px;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    p {
                        padding-right: 37px;
                    }
                    .pro_l {
                        height: 88px;
                        width: 70px;
                        position: absolute;
                        bottom: -5px;
                        right: -8px;
                    }
                }
                .obay_2 {
                    float: left;
                    width: 88px;
                    height: 88px;
                    overflow: hidden;
                    border-top: solid 1px #7c7056;
                    p {
                        font-size: 12px;
                        padding-top: 3px;
                    }
                    .title_baay {
                        height: 32px;
                        font-size: 26px;
                        font-weight: bold;
                    }
                    img {
                        margin-top: 20px;
                    }
                }
                .obay_3 {
                    float: left;
                    width: 184px;
                    height: 88px;
                    border-right: solid 1px #7c7056;
                    overflow: hidden;
                    background: url("../../../static/imgs/mues/cainuan/r-bg2.png") no-repeat;
                    position: relative;
                    .title_baay {
                        padding-top: 15px;
                        height: 32px;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    p {
                        padding-left: 35px;
                        padding-top: 15px;
                    }
                    .pro_r {
                        height: 88px;
                        width: 70px;
                        position: absolute;
                        bottom: -5px;
                        left: 0;
                    }
                }
            }
            .addData {
                height: 120px;
                .line_top {
                    p {
                        font-size: 12px;
                        line-height: 26px;
                    }
                }
            }
            .table_kaohe_sanqu {
                width: 450px;
                height: 110px;
                margin: 0 auto;
                .lable_title {
                    text-align: left;
                    height: 28px;
                    width: 100%;
                    color: #fff;

                    a {
                        color: #fff;
                        display: inline-block;
                    }
                }
                .tubiao_warp {
                    .warp_left {
                        float: left;
                        height: 80px;
                        width: 209px;

                    }
                    .warp_chenter {
                        float: left;
                        height: 80px;
                        width: 59px;

                        ul {
                            li {
                                list-style: none;
                            }
                        }
                    }
                    .warp_right {
                        float: right;
                        height: 80px;
                        width: 182px;

                    }
                }
            }
            .table_kaohe_baxian {
                width: 100%;
                height: 190px;
                margin: 0 auto;
                .lable_title {
                    text-align: left;
                    height: 28px;
                    width: 100%;
                    color: #fff;
                    padding-left: 16px;
                    //background: #777;
                    a {
                        color: #fff;
                        display: inline-block;
                    }
                }
                .tubiao_warp {
                    .warp_left {
                        float: left;
                        height: 165px;
                        width: 219px;
                        // border: solid 1px #1080cc;
                    }
                    .warp_chenter {
                        float: left;
                        height: 165px;
                        width: 59px;
                        // border: solid 1px #1080cc;
                        ul {
                            li {
                                list-style: none;
                            }
                        }
                    }
                    .warp_right {
                        float: right;
                        height: 165px;
                        width: 200px;
                        //border: solid 1px #1080cc;
                    }
                }
            }
        }
        .Window_Four {
            width: 370px;
            height: 276px;
            border: solid 1px #428bca;
            background: #1d2339;
            float: left;
            overflow-x: hidden;
            overflow-y: auto;
            .daqititle {
                margin-top: 30px;
            }
            .nytable {
                width: 100%;
                tr, td {
                    border: none;
                    height: 38px;
                }
                .lightColor {
                    background: #22293c !important;
                }
                .darkColor {
                    background: #051427 !important;
                }
                .goLeft {
                    text-align: left;
                    padding-left: 20px;
                }
            }
            .prog_box {
                .item_progrs_left {
                    width: 20%;
                    float: left;
                    padding-left: 4%;
                    margin-right: 5%;
                    li {
                        list-style: none;
                    }
                }
                .item_progrs {
                    margin-top: 2.5px;
                    width: 70%;
                    float: left;
                }
            }
            .renwu-box {
                width: 300px;
                height: auto;
                margin: 0 auto;
                .e_users {
                    width: 150px;
                    height: 60px;
                    margin-top: 35px;
                    float: left;
                    p {
                        margin: 0;
                        color: #8079eb;
                        font-size: 22px;
                        font-weight: bold;
                        padding: 3px;
                        span {
                            font-size: 14px;
                        }
                    }
                    h5 {
                        margin: 6px;
                        color: #45edf8;
                        font-size: 22px;
                    }
                }
            }

        }
        .Window_Five {
            width: 428px;
            height: 276px;
            border: solid 1px #428bca;
            background: #1d2339;
            float: left;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .Window_six {
            width: 480px;
            height: 202px;
            border: solid 1px #428bca;
            background: #1d2339;
            overflow: hidden;
            float: left;
            .tt-text{
                width: 100%;
                height: 36px;
                border-bottom: solid 1px #428bca;
                line-height: 36px;
                p{
                    text-align: left;
                    padding-left: 10px;
                }
            }
            .tian {
                display: inline-block;
                width: 20px;
            }
            .data_water1 {
                margin-top: 8px;
                width: 158px;
                height: auto;
                border-right: solid 1px #1080cc;
                float: left;
                p {
                    color: #fff;
                    font-size: 14px;
                    padding-bottom: 4px;
                }
                a {
                    display: inline-block;
                    width: 100%;
                    margin-top: 4px;
                    padding-left: 14px;
                    color: #9ea9c7;
                    font-size: 12px;
                    line-height: 20px;
                    text-align: left;
                }
                span {
                    color: #fff;
                }
            }
            .data_water2 {
                margin-top: 8px;
                width: 158px;
                height: auto;
                border-right: solid 1px #1080cc;
                float: left;
                p {
                    color: #fff;
                    font-size: 14px;
                    padding-bottom: 4px;
                }
                a {
                    display: inline-block;
                    width: 100%;
                    margin-top: 4px;
                    padding-left: 14px;
                    color: #9ea9c7;
                    font-size: 12px;
                    line-height: 20px;
                    text-align: left;
                }
                span {
                    color: #fff;
                }
            }
            .data_water3 {
                margin-top: 8px;
                float: left;
                width: 158px;
                height: auto;
                p {
                    color: #fff;
                    font-size: 14px;
                    padding-bottom: 4px;
                }
                a {
                    display: inline-block;
                    width: 100%;
                    margin-top: 4px;
                    padding-left: 14px;
                    color: #9ea9c7;
                    font-size: 12px;
                    line-height: 20px;
                    text-align: left;
                }
                span {
                    color: #fff;
                    display: inline-block;
                }
            }
        }
    }
</style>
