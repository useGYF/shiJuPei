/**
 * Created by 96400 on 2017/7/24.
 */
import {API_ROOT} from './config.js'
/*全局*/
let icode = null;
/*接口*/
const apiconfig = [
        {
            devn:'http://117.119.97.150:8063',//测试001
            devc:'http://117.119.97.150:8061',//测试002
            devy:'http://117.119.97.150:8073',//测试003
        },
        {
            devn:'http://gkpt.zq12369.com:8016',//正式001
            devy:'http://gkpt.zq12369.com:8015',//正式(大气源清单)
            devc:'http://gkpt.zq12369.com:8013',//正式
        }
    ];
/*判断环境*/
console.log('接口测试')
console.log(process.env.API_ROOT);
/*
* icode === 0为测试  1为正式
* */
if(process.env.API_ROOT === 'TEST' || process.env.API_ROOT === 'DEV'){
    icode = 1;
    //icode = 0;
}else {
    icode = 1;
};
/*langfang----jiekou*/
const apilangfangTDK = {
    GetLfAir: apiconfig[icode].devn + '/api/lfair/GetLfAir ',//首页面板天气模块数据
    GetElectricityIndexChart: apiconfig[icode].devn + '/api/LargeData/GetElectricityIndexChart?',//大数据对比
    GetLfAirPollution: apiconfig[icode].devn + '/api/LfAir/GetLfAirPollutionItemAccu',//首页面板累计值
    GetMonitoringPointAccu: apiconfig[icode].devn + '/api/Monitoring/GetMonitoringPointAccu?pointLevel=',//国控点，这是累计接口
    GetMonitoringPointHour: apiconfig[icode].devn + '/api/Monitoring/GetMonitoringPointHour?time=',//这是小时查询部分，默认pointlevel不传，返回所有国控点和省控点
    GetMonitoringPointReal: apiconfig[icode].devn + '/api/Monitoring/GetMonitoringPointReal?pointLevel=',//实时监测点信息
    GetycXhHbPointsRaise: apiconfig[icode].devn + '/api/XhHb/GetXhHbPointsRaise',//在线扬尘先河统计
    GetFcStationList: apiconfig[icode].devn + '/api/FcStation/GetFcStationList',//传感网数据实时
    GetXhHbPointsMicroAccu: apiconfig[icode].devn + '/api/XhHb/GetXhHbPointsMicroAccu',//传感网数据累计先河
    GetXhHbPointsRaise: apiconfig[icode].devn + '/api/IndexStatistics/GetIndexStatistics',//首页接入数据统计
    GetAirPie: apiconfig[icode].devn + '/api/IndexStatistics/GetAirPie',//空气传感器占比统计
    GetVideoPie: apiconfig[icode].devn + '/api/IndexStatistics/GetVideoPie',//视频占比统计
    GetGridPie: apiconfig[icode].devn + '/api/IndexStatistics/GetGridPie',//网格类型占比统计
    GetGridMemberPie: apiconfig[icode].devn + '/api/IndexStatistics/GetGridMemberPie',//网格员占比统计
    GetCompanyPointList: apiconfig[icode].devn + '/api/Company/GetCompanyPointList',//企业在线右侧
    GetOfficeProgess: apiconfig[icode].devn + '/api/IndexStatistics/GetOfficeProgess',//企业在线右侧二
    GetDustHourRanking: apiconfig[icode].devn + '/api/Dust/GetDustHourRanking_NEW?',//在线源清单查询
    GetLfAirWinterPre: apiconfig[icode].devn + '/api/LfAir/GetLfAirWinterPre',//冬防战报模块一01空气预报
    GetWinterPreCompanyControl: apiconfig[icode].devn + '/api/WinterPre/GetWinterPreCompanyControl',//冬防战报列表1
    GetWinterPreAirControl: apiconfig[icode].devn + '/api/WinterPre/GetWinterPreAirControl',//冬防战报列表2
    GetWinterPreDustControl: apiconfig[icode].devn + '/api/WinterPre/GetWinterPreDustControl',//冬防战报列表3
    GetWeatherWinterPre: apiconfig[icode].devn + '/api/Weather/GetWeatherWinterPre',//冬防战报模块六天气排名
    GetsourcetypeAllInfo: apiconfig[icode].devc +'/servicePlatform/enterprise/allInfo?',//静态原清单1
    GetallInfoBySourceType: apiconfig[icode].devc + '/servicePlatform/enterprise/allInfoBySourceType?',//静态原清单2
    GetUserLogin: apiconfig[icode].devn +'/api/login/UserLogin',//登录接口
    GetCompanyStatistics: apiconfig[icode].devn + '/api/Company/GetCompanyStatistics',//企业污染统计
    GetEmergencyList: apiconfig[icode].devn + '/api/EmergencyPlan/GetEmergencyList',//应急清单....
    GetElectricityChart: apiconfig[icode].devn + '/api/Winter/GetElectricityChart',//用电量
    GetqyWinterPreCompanyControl: apiconfig[icode].devn + '/api/WinterPre/GetWinterPreCompanyControl',//企业在线列表
    GetkqWinterPreAirControl: apiconfig[icode].devn + '/api/WinterPre/GetWinterPreAirControl',//空气质量检测列表
    GetgdWinterPreDustControl: apiconfig[icode].devn + '/api/WinterPre/GetWinterPreDustControl',//工地扬尘检测
    GetWinterPrePolluDays: apiconfig[icode].devn + '/api/winterpre226/GetWinterPrePolluDays',//冬防战报模块三重污染天数
    GetWinterPre226Pm25: apiconfig[icode].devn + '/api/winterpre226/GetWinterPre226Pm25',//冬防战报模块三PM2.5的
    GetCompanyList: apiconfig[icode].devn + '/api/EmergencyPlan/GetCompanyList',//应急清单企业
    GetLfAirAlerts: apiconfig[icode].devn + '/api/LfAir/GetLfAirAlerts',//获取今日控制目标和预警值及国控点数据
    GetWinterPreTVocControl: apiconfig[icode].devn + '/api/WinterPre/GetWinterPreTVocControl',//冬防战报tvoc
    GetJingJinJiHourList: apiconfig[icode].devn + '/api/jingJinJi/GetJingJinJiHourListPc',//京津冀城市排名
    GetElectricityChart2: apiconfig[icode].devn + '/api/LargeData/GetElectricityChart?',//大数据资源统计
    GetPointNameListData: apiconfig[icode].devn + '/api/LargeData/GetPointNameList',//大数据资源统计
    GetTownList: apiconfig[icode].devn + '/api/Town/GetTownList',//乡镇企业列表展示
    GetSingleTown: apiconfig[icode].devn + '/api/Town/GetSingleTown?StationId=',//乡镇企业详细数据展示
    GetTownAnalysisList: apiconfig[icode].devn + '/api/Town/GetTownAnalysisList?region=',//乡镇统计实时数据
    GetTownAnalysisListForDaily: apiconfig[icode].devn + '/api/Town/GetTownAnalysisListForDaily?',//乡镇统计日报数据
    GetTownAnalysisListForDay: apiconfig[icode].devn + '/api/Town/GetTownAnalysisListForDay?region=',//乡镇统计日累计数据
    GetTownAnalysisListForYear: apiconfig[icode].devn + '/api/Town/GetTownAnalysisListForYear?',//乡镇统计年报数据
    GetTownAnalysisListForQuarter: apiconfig[icode].devn + '/api/Town/GetTownAnalysisListForQuarter?',//乡镇统计季报数据
    GetTownAnalysisListForCustom: apiconfig[icode].devn + '/api/Town/GetTownAnalysisListForCustom?',//乡镇统计自定义数据
    GetTownAnalysisListForMonth: apiconfig[icode].devn + '/api/Town/GetTownAnalysisListForMonth?',//乡镇统计月报数据
    GetTownRegion: apiconfig[icode].devn + '/api/Town/GetTownRegion',//乡镇区县列表
    GetHourConcentration: apiconfig[icode].devn + '/api/MeanRatio/GetHourConcentration',//国省控获取小时浓度及均值比
    GetDayConcentration: apiconfig[icode].devn + '/api/MeanRatio/GetDayConcentration',//国省控获取日浓度及均值比
    GetPointInfoName: apiconfig[icode].devn + '/api/MeanRatio/GetPointInfo',//国省控点信息
    GetCompanyHistoryData: apiconfig[icode].devn + '/api/Company/GetCompanyHistoryData?',//获取一段时间内企业监测数据，包含正常、超标、异常、离线停炉标识
    ExcelHistoryData: apiconfig[icode].devn + '/api/Company/ExcelHistoryData?',//导出一段时间内企业监测数据，包含正常、超标、异常、离线停炉标识
    GetCompanyOverLimitStatistics: apiconfig[icode].devn + '/api/Company/GetCompanyOverLimitStatistics?',//获取一段时间内企业超标统计
    ExcelOverLimitStatistics: apiconfig[icode].devn + '/api/Company/ExcelOverLimitStatistics?',//企业超标统计导出
    GetcompanyListTablaData: apiconfig[icode].devn + '/api/Company/GetcompanyList',//获取企业列表
    GetQxHourRank: apiconfig[icode].devn + '/api/LfAir/GetQxHourRank',//区县小时排行列表
    GetXhHbPointsVoc: apiconfig[icode].devn + '/api/XhHb/GetXhHbPointsVoc',//VOC面板数据列表
    GetVideoInfoByType: apiconfig[icode].devn + '/api/Video/GetVideoInfoByType',//获取高空视频监控列表
    GetTownListData: apiconfig[icode].devn + '/api/Town/GetTownList?region=',//乡镇企业列表展示
    EmergencyInfoInsert: apiconfig[icode].devn + '/api/EmergencyBulletin/Insert',//新增应急消息
    GetEmergencyInfo: apiconfig[icode].devn + '/api/EmergencyBulletin/GetNotice?',//获取应急消息
    GetCaseList: apiconfig[icode].devc + '/servicePlatform/admin/caseData/selectCasePage?',//获取案件审核列表
    GetCaseAll: apiconfig[icode].devc + '/servicePlatform/mobile/list/anjian?type=1',//获取责任主体
    GetUploadImg: apiconfig[icode].devc + '/servicePlatform/admin/caseData/uploadAnalysisFile',//上传案件图片
    GetPollutionType: apiconfig[icode].devc + '/servicePlatform/mobile/list/anjian?type=2',//获取污染类别
    GetEditCase: apiconfig[icode].devc + '/servicePlatform/admin/caseData/editCaseZrzt?',//分配责任主体
    GetExportCase: apiconfig[icode].devc + '/servicePlatform/admin/caseData/export?',//导出案件
    GetEditResult: apiconfig[icode].devc + '/servicePlatform/admin/caseData/editCasehandlingResult',//案件处理结果
    GetCaseImg: apiconfig[icode].devc + '/servicePlatform/admin/caseData/getImgByCaseCode?',//获取案件图片
    GetEmergencyInfoList: apiconfig[icode].devn + '/api/EmergencyBulletin/Notices?',//获取预警信息列表
    GetEmergencyInfoUpdate: apiconfig[icode].devn + '/api/EmergencyBulletin/Update?',//编辑预警信息
    GetEmergencyEnd: apiconfig[icode].devn + '/api/EmergencyBulletin/End?',//结束预警信息
    GetMonitorPointAlarmValue: apiconfig[icode].devn + '/api/AlarmValueSetting/GetMonitorPointAlarmValue',//获取国控点预警值
    MonitorPointAlarmValueSetting: apiconfig[icode].devn + '/api/AlarmValueSetting/MonitorPointAlarmValueSetting',//国控点预警值设置
    GetTVOCAlarmValue: apiconfig[icode].devn + '/api/AlarmValueSetting/GetTVOCAlarmValue',//获取TVOC预警值
    TVOCAlarmValueSetting: apiconfig[icode].devn + '/api/AlarmValueSetting/TVOCAlarmValueSetting',//TVOC预警值设置
    GetTVOCLevleValue: apiconfig[icode].devn + '/api/AlarmValueSetting/GetTVOCLevleValue',//获取TVOC颜色值
    TVOCLevelValueSetting: apiconfig[icode].devn + '/api/AlarmValueSetting/TVOCLevelValueSetting',//TVOC颜色值设置
    GetMonthCheck: apiconfig[icode].devn + '/api/CheckCounty/GetMonthCheck?',//获取月考核
    GetWinterPreComIndexMonthPc: apiconfig[icode].devn + '/api/WinterPre/GetWinterPreComIndexMonthPc?',//月度累计综指排名
    GetWinterPrePollutionDaysMonthPc: apiconfig[icode].devn + '/api/WinterPre/GetWinterPrePollutionDaysMonthPc?',//月度累计空气质量
    GetWinterPreComIndexYearPc: apiconfig[icode].devn + '/api/WinterPre/GetWinterPreComIndexYearPc?',//年度累计综指排名
    GetWinterPrePollutionDaysYearPc: apiconfig[icode].devn + '/api/WinterPre/GetWinterPrePollutionDaysYearPc?',//年度累计空气质量
    GetFirstGridDropDown: apiconfig[icode].devn + '/api/Grid/GetFirstGridDropDown',//日数据管理县市区选择
    GetMonitoringDay: apiconfig[icode].devn + '/api/Monitoring/GetMonitoringDay?',//获取日数据列表
    UpdateMonitoringDay: apiconfig[icode].devn + '/api/Monitoring/UpdateMonitoringDay',//单条修改日数据
    ImportExel: apiconfig[icode].devn + '/api/Monitoring/ImportExel?',//导出
    UploadFile: apiconfig[icode].devn + '/api/Monitoring/UploadFile',//日数据上传
    GetOperatorInfo: apiconfig[icode].devn + '/api/Operator/GetOperatorInfo',//运维记录列表
    GetOperDeviceInfo: apiconfig[icode].devn + '/api/Operator/GetOperDeviceInfo',//设备列表
    AddOperatorInfo: apiconfig[icode].devn + '/api/Operator/AddOperatorInfo',//添加运维记录
    DeleteOperatorInfo: apiconfig[icode].devn + '/api/Operator/DeleteOperatorInfo',//删除运维记录
    UpdateOperatorInfo: apiconfig[icode].devn + '/api/Operator/UpdateOperatorInfo',//编辑运维记录
    GetAssessment: apiconfig[icode].devn + '/api/Town/GetAssessment?',//乡镇考核
    GetMonitoringRank: apiconfig[icode].devn + '/api/Monitoring/GetMonitoringRank?',//国省控点排名
    GetDustRank: apiconfig[icode].devn + '/api/Dust/GetDustRank?',//工地扬尘排名
    GetSixParamDayRank: apiconfig[icode].devn + '/api/SixParamAir/GetSixParamDayRank?',//六参数排名
    GetTVOCRank: apiconfig[icode].devn + '/api/XhHb/GetTVOCRank?',//tvoc排名
    GetSixParamCityRank: apiconfig[icode].devn + '/api/Monitoring/GetSixParamDayRank?',//城市排名
    GetVideoDeviceInfoData: apiconfig[icode].devn + '/api/Video/GetVideoDeviceInfo',//视频列表
    GetClassification: apiconfig[icode].devn + '/api/SixParamAir/GetSixParamAirList?typeName=',//六参数实时分类查询
    GetClassificationleiji: apiconfig[icode].devn + '/api/SixParamair/GetSixParamAirListAccu?typeName=',//六参数累计分类
    GetSixParamAirList: apiconfig[icode].devn + '/api/SixParamAir/GetSixParamAirList?typeName=',//六参数列表
    GetSixParamTypeList: apiconfig[icode].devn + '/api/SixParamair/GetSixParamTypeList',//六参数获取类型
    GetTotalCount: apiconfig[icode].devn + '/api/Dust/GetTotalCount',//获取视频设备接入数据统计
    GetpeortpleselectCases: apiconfig[icode].devc + '/servicePlatform/mobile/selectCases?',//全民举报统计列表
    GetLfAirAlert: apiconfig[icode].devn + '/api/LfAir/GetLfAirAlert',//今日控制目标，预警 ，保优保良
    GetBaoYouLiang: apiconfig[icode].devn + '/api/LfAir/GetBaoYouLiang?qualityCode=',//今日战报 保优保良
    GetAirQuality: apiconfig[icode].devn + '/api/LfAir/GetAirQuality',//今日战报获取空气质量等级及编码
    GetChartByRegion: apiconfig[icode].devn + '/api/EmergencyPlan/GetChartByRegion',//应急EChart图表根据地址分类
    GetChartByClassification: apiconfig[icode].devn + '/api/EmergencyPlan/GetChartByClassification',//应急EChart图表根据错峰类别分类
    GetSearchAll: apiconfig[icode].devn +'/api/Search/SearchAll?',//全网搜索
    GetBulletinNotices: apiconfig[icode].devn +'/api/EmergencyBulletin/Notices',//获取消息列表集合
    GetCompanyOutPut: apiconfig[icode].devn +'/api/Company/GetCompanyOutPut?pscode=',//根据企业pscode获取排气口
    GetselectPageData: apiconfig[icode].devc + '/servicePlatform/admin/economicData/selectPage',//分页查询经济数据列表
    GetsaveEconomicData: apiconfig[icode].devc + '/servicePlatform/admin/economicData/saveEconomicData',//保存经济数据
    GetselectByIdData: apiconfig[icode].devc + '/servicePlatform/admin/economicData/selectById',//根据id查询经济数据
    GetFileById: apiconfig[icode].devc + '/servicePlatform/admin/economicData/getFileById',//根据id下载导入的文件
    GetFileAnalysisResById: apiconfig[icode].devc + '/servicePlatform/admin/economicData/getFileAnalysisResById',//根据id获取导入的文件解析后数据
    GetdeteletedById: apiconfig[icode].devc + '/servicePlatform/admin/economicData/deteletedById',//删除经济数据
    PostgfbgInsert: apiconfig[icode].devn + '/api/OfficialReport/Insert',//官方报告新增数据
    PostgfbgUpdate: apiconfig[icode].devn + '/api/OfficialReport/Update',//官方报告修改数据
    GetgfbgDelete: apiconfig[icode].devn + '/api/OfficialReport/Delete/',//官方报告删除数据
    GetgfbgGetList: apiconfig[icode].devn + '/api/OfficialReport/GetList?',//获取后台列表
    GetGetListBySourceList: apiconfig[icode].devn + '/api/OfficialReport/GetListBySource?',//获取前台列表
    GetgfbgGetSource: apiconfig[icode].devn + '/api/OfficialReport/GetSource',//官方报告获取来源分类
    GetgfbgSingle: apiconfig[icode].devn + '/api/OfficialReport/GetSingle/',//官方报告获取单个
    PostydInsert: apiconfig[icode].devn + '/api/Winter/Insert',//用电量填报
    PostydList: apiconfig[icode].devn + '/api/Winter/List?',//用电量列表
    GetydImportExel: apiconfig[icode].devn + '/api/Winter/ImportExel?',//导出用电量数据
    PostselectAllChild: apiconfig[icode].devy + '/yqd/yqdcon/selectAllChildByParentIds',//根据父id集合查询所有子类型
    PostselectAllParent: apiconfig[icode].devy + '/yqd/yqdcon/selectAllParent',//查询所有父类型
    PostselectClassIdsGroup: apiconfig[icode].devy + '/yqd/yqdcon/selectByPubAndClassIdsGroupByClass',//根据父id集合和污染源类别查询所有子类型在此项污染源上的数值(按类型分组
    PostselectByPubAndClassNet: apiconfig[icode].devy + '/yqd/yqdcon/selectByPubAndClassIdsGroupByNet',//根据父id集合和污染源类别查询所有子类型在此项污染源上的数值(按网格分组
    PostselectPollutantDischarge: apiconfig[icode].devy + '/yqd/yqdcon/selectPollutantDischargeByClassIdsPage',//根据父id集合查询所有子类型在此项污染源上的数据
    GetDustExcelOutPut: apiconfig[icode].devn + '/api/Dust/ExcelOutPut?',//工地扬尘排名导出
    GetSixParamAirExcelOutPut: apiconfig[icode].devn + '/api/SixParamAir/ExcelOutPut?',//六参数排名导出
    GetTVOCExcelOutPut: apiconfig[icode].devn + '/api/XhHb/ExcelOutPut?',//TVOC排名导出
    DayDataUrl: apiconfig[icode].devn + '/api/Monitoring/UploadFile',//日数据上传
    CaseImgUp: apiconfig[icode].devc + '/servicePlatform/',//案件上传图片
    UploadAnalysisFile: apiconfig[icode].devc + '/servicePlatform/admin/economicData/uploadAnalysisFile',//经济数据上传
    DianUploadFile: apiconfig[icode].devn + '/api/Winter/UploadFile',//用电量上传
    GetTownExcelOutPut: apiconfig[icode].devn + '/api/Town/ExcelOutPut?',//乡镇空气站导出
    GetVideoScatterInfo: apiconfig[icode].devn +'/api/Video/GetVideoScatterInfo?name=',//slwvideo
    GetVocsVideoInfo: apiconfig[icode].devn +'/api/Video/GetVocsVideoInfo?name=',//vocvideo
    GetElectricityChartForDay: apiconfig[icode].devn +'/api/LargeData/GetElectricityChartForDay?',//大数据天
    GetElectricityIndexChartForDay: apiconfig[icode].devn +'/api/LargeData/GetElectricityIndexChartForDay?',//大数据天
}
export const PostydInsertResource = API_ROOT.concat(apilangfangTDK.PostydInsert);
export const PostydListResource = API_ROOT.concat(apilangfangTDK.PostydList);
export const GetydImportExelResource = API_ROOT.concat(apilangfangTDK.GetydImportExel);
export const GetLfAirResource = API_ROOT.concat(apilangfangTDK.GetLfAir);
export const GetLfAirPollutionResource = API_ROOT.concat(apilangfangTDK.GetLfAirPollution);
export const GetMonitoringPointAccuResource = API_ROOT.concat(apilangfangTDK.GetMonitoringPointAccu);
export const GetMonitoringPointHourResource = API_ROOT.concat(apilangfangTDK.GetMonitoringPointHour);
export const GetMonitoringPointRealResource = API_ROOT.concat(apilangfangTDK.GetMonitoringPointReal);
export const GetCompanyOutPutResource = API_ROOT.concat(apilangfangTDK.GetCompanyOutPut);
export const GetBulletinNoticesResource = API_ROOT.concat(apilangfangTDK.GetBulletinNotices);
export const GetXhHbPointsRaiseResource = API_ROOT.concat(apilangfangTDK.GetXhHbPointsRaise);
export const GetAirPieResource = API_ROOT.concat(apilangfangTDK.GetAirPie);
export const GetVideoPieResource = API_ROOT.concat(apilangfangTDK.GetVideoPie);
export const GetGridPieResource = API_ROOT.concat(apilangfangTDK.GetGridPie);
export const GetGridMemberPieResource = API_ROOT.concat(apilangfangTDK.GetGridMemberPie);
export const GetCompanyPointListResource = API_ROOT.concat(apilangfangTDK.GetCompanyPointList);
export const GetOfficeProgessResource = API_ROOT.concat(apilangfangTDK.GetOfficeProgess);
export const GetycXhHbPointsRaiseResource = API_ROOT.concat(apilangfangTDK.GetycXhHbPointsRaise);
export const GetDustHourRankingResource = API_ROOT.concat(apilangfangTDK.GetDustHourRanking);
export const GetLfAirAlertResource = API_ROOT.concat(apilangfangTDK.GetLfAirAlert);
export const GetLfAirWinterPreResource = API_ROOT.concat(apilangfangTDK.GetLfAirWinterPre);
export const GetWeatherWinterPreResource = API_ROOT.concat(apilangfangTDK.GetWeatherWinterPre);
export const GetsourcetypeAllInfoResource = API_ROOT.concat(apilangfangTDK.GetsourcetypeAllInfo);
export const GetallInfoBySourceTypeResource = API_ROOT.concat(apilangfangTDK.GetallInfoBySourceType)
export const GetEnterpriseDataResource = API_ROOT.concat(apilangfangTDK.GetEnterpriseData);
export const GetCompanyStatisticsResource = API_ROOT.concat(apilangfangTDK.GetCompanyStatistics);
export const GetEmergencyListResource = API_ROOT.concat(apilangfangTDK.GetEmergencyList);
export const GetElectricityChartResource = API_ROOT.concat(apilangfangTDK.GetElectricityChart);
export const GetqyWinterPreCompanyControlResource = API_ROOT.concat(apilangfangTDK.GetqyWinterPreCompanyControl);
export const GetkqWinterPreAirControlResource = API_ROOT.concat(apilangfangTDK.GetkqWinterPreAirControl);
export const GetgdWinterPreDustControlResource = API_ROOT.concat(apilangfangTDK.GetgdWinterPreDustControl);
export const GetCompanyListResource = API_ROOT.concat(apilangfangTDK.GetCompanyList);
export const GetLfAirAlertsResource = API_ROOT.concat(apilangfangTDK.GetLfAirAlerts);
export const GetWinterPreTVocControlResource = API_ROOT.concat(apilangfangTDK.GetWinterPreTVocControl);
export const GetJingJinJiHourListResource = API_ROOT.concat(apilangfangTDK.GetJingJinJiHourList);
export const GetElectricityChart2Resource = API_ROOT.concat(apilangfangTDK.GetElectricityChart2);
export const GetPointNameListDataResource = API_ROOT.concat(apilangfangTDK.GetPointNameListData);
export const GetTownListResource = API_ROOT.concat(apilangfangTDK.GetTownList);
export const GetSingleTownResource = API_ROOT.concat(apilangfangTDK.GetSingleTown);
export const GetTownAnalysisListResource = API_ROOT.concat(apilangfangTDK.GetTownAnalysisList);
export const GetTownAnalysisListForDailyResource = API_ROOT.concat(apilangfangTDK.GetTownAnalysisListForDaily);
export const GetTownAnalysisListForDayResource = API_ROOT.concat(apilangfangTDK.GetTownAnalysisListForDay);
export const GetTownAnalysisListForQuarterResource = API_ROOT.concat(apilangfangTDK.GetTownAnalysisListForQuarter);
export const GetTownRegionResource = API_ROOT.concat(apilangfangTDK.GetTownRegion);
export const GetTownAnalysisListForMonthResource = API_ROOT.concat(apilangfangTDK.GetTownAnalysisListForMonth);
export const GetTownAnalysisListForYearResource = API_ROOT.concat(apilangfangTDK.GetTownAnalysisListForYear);
export const GetPointInfoNameResource = API_ROOT.concat(apilangfangTDK.GetPointInfoName);
export const GetCompanyHistoryDataResource = API_ROOT.concat(apilangfangTDK.GetCompanyHistoryData);
export const ExcelHistoryDataResource = API_ROOT.concat(apilangfangTDK.ExcelHistoryData);
export const GetCompanyOverLimitStatisticsResource = API_ROOT.concat(apilangfangTDK.GetCompanyOverLimitStatistics);
export const ExcelOverLimitStatisticsResource = API_ROOT.concat(apilangfangTDK.ExcelOverLimitStatistics);
export const GetcompanyListTablaDataResource = API_ROOT.concat(apilangfangTDK.GetcompanyListTablaData);
export const GetQxHourRankResource = API_ROOT.concat(apilangfangTDK.GetQxHourRank);
export const GetXhHbPointsVocResource = API_ROOT.concat(apilangfangTDK.GetXhHbPointsVoc);
export const GetVideoInfoByTypeResource = API_ROOT.concat(apilangfangTDK.GetVideoInfoByType);
export const GetTownListDataResource = API_ROOT.concat(apilangfangTDK.GetTownListData);
export const EmergencyInfoInsertResource = API_ROOT.concat(apilangfangTDK.EmergencyInfoInsert);
export const GetEmergencyInfoResource = API_ROOT.concat(apilangfangTDK.GetEmergencyInfo);
export const GetEmergencyInfoListResource = API_ROOT.concat(apilangfangTDK.GetEmergencyInfoList);
export const GetEmergencyInfoUpdateResource = API_ROOT.concat(apilangfangTDK.GetEmergencyInfoUpdate);
export const GetVideoDeviceInfoDataResource = API_ROOT.concat(apilangfangTDK.GetVideoDeviceInfoData);
export const GetClassificationResource = API_ROOT.concat(apilangfangTDK.GetClassification);
export const GetClassificationleijiResource = API_ROOT.concat(apilangfangTDK.GetClassificationleiji);
export const GetSixParamAirListResource = API_ROOT.concat(apilangfangTDK.GetSixParamAirList);
export const GetTotalCountResource = API_ROOT.concat(apilangfangTDK.GetTotalCount);
export const GetSixParamTypeListResource = API_ROOT.concat(apilangfangTDK.GetSixParamTypeList);
export const GetpeortpleselectCasesResource = API_ROOT.concat(apilangfangTDK.GetpeortpleselectCases);
export const GetMonitorPointAlarmValueResource = API_ROOT.concat(apilangfangTDK.GetMonitorPointAlarmValue);
export const MonitorPointAlarmValueSettingResource = API_ROOT.concat(apilangfangTDK.MonitorPointAlarmValueSetting);
export const GetTVOCAlarmValueResource = API_ROOT.concat(apilangfangTDK.GetTVOCAlarmValue);
export const TVOCAlarmValueSettingResource = API_ROOT.concat(apilangfangTDK.TVOCAlarmValueSetting);
export const GetTVOCLevleValueResource = API_ROOT.concat(apilangfangTDK.GetTVOCLevleValue);
export const TVOCLevelValueSettingResource = API_ROOT.concat(apilangfangTDK.TVOCLevelValueSetting);
export const GetBaoYouLiangResource = API_ROOT.concat(apilangfangTDK.GetBaoYouLiang);
export const GetAirQualityResource = API_ROOT.concat(apilangfangTDK.GetAirQuality);
export const GetMonthCheckResource = API_ROOT.concat(apilangfangTDK.GetMonthCheck);
export const GetWinterPreComIndexMonthPcResource = API_ROOT.concat(apilangfangTDK.GetWinterPreComIndexMonthPc);
export const GetWinterPrePollutionDaysMonthPcResource = API_ROOT.concat(apilangfangTDK.GetWinterPrePollutionDaysMonthPc);
export const GetWinterPreComIndexYearPcResource = API_ROOT.concat(apilangfangTDK.GetWinterPreComIndexYearPc);
export const GetWinterPrePollutionDaysYearPcResource = API_ROOT.concat(apilangfangTDK.GetWinterPrePollutionDaysYearPc);
export const GetChartByRegionResource = API_ROOT.concat(apilangfangTDK.GetChartByRegion);
export const GetChartByClassificationResource = API_ROOT.concat(apilangfangTDK.GetChartByClassification);
export const GetFirstGridDropDownResource = API_ROOT.concat(apilangfangTDK.GetFirstGridDropDown);
export const GetMonitoringDayResource = API_ROOT.concat(apilangfangTDK.GetMonitoringDay);
export const UpdateMonitoringDayResource = API_ROOT.concat(apilangfangTDK.UpdateMonitoringDay);
export const UploadFileResource = API_ROOT.concat(apilangfangTDK.UploadFile);
export const ImportExelResource = API_ROOT.concat(apilangfangTDK.ImportExel);
export const GetSearchAllResource = API_ROOT.concat(apilangfangTDK.GetSearchAll);
export const GetAssessmentResource = API_ROOT.concat(apilangfangTDK.GetAssessment);
export const GetMonitoringRankResource = API_ROOT.concat(apilangfangTDK.GetMonitoringRank);
export const GetDustRankResource = API_ROOT.concat(apilangfangTDK.GetDustRank);
export const GetSixParamDayRankResource = API_ROOT.concat(apilangfangTDK.GetSixParamDayRank);
export const GetTVOCRankResource = API_ROOT.concat(apilangfangTDK.GetTVOCRank);
export const GetSixParamCityRankResource = API_ROOT.concat(apilangfangTDK.GetSixParamCityRank);
export const GetsaveEconomicDataResource = API_ROOT.concat(apilangfangTDK.GetsaveEconomicData);
export const GetFileByIdResource = API_ROOT.concat(apilangfangTDK.GetFileById);
export const GetFileAnalysisResByIdResource = API_ROOT.concat(apilangfangTDK.GetFileAnalysisResById);
export const GetdeteletedByIdResource = API_ROOT.concat(apilangfangTDK.GetdeteletedById);
export const GetEmergencyEndResource = API_ROOT.concat(apilangfangTDK.GetEmergencyEnd);
export const GetselectPageDataResource = API_ROOT.concat(apilangfangTDK.GetselectPageData);
export const GetselectByIdDataResource = API_ROOT.concat(apilangfangTDK.GetselectByIdData);
export const GetOperatorInfoResource = API_ROOT.concat(apilangfangTDK.GetOperatorInfo);
export const GetOperDeviceInfoResource = API_ROOT.concat(apilangfangTDK.GetOperDeviceInfo);
export const AddOperatorInfoResource = API_ROOT.concat(apilangfangTDK.AddOperatorInfo);
export const DeleteOperatorInfoResource = API_ROOT.concat(apilangfangTDK.DeleteOperatorInfo);
export const UpdateOperatorInfoResource = API_ROOT.concat(apilangfangTDK.UpdateOperatorInfo);
export const PostgfbgInsertResource = API_ROOT.concat(apilangfangTDK.PostgfbgInsert);
export const PostgfbgUpdateResource = API_ROOT.concat(apilangfangTDK.PostgfbgUpdate);
export const GetgfbgDeleteResource = API_ROOT.concat(apilangfangTDK.GetgfbgDelete);
export const GetgfbgGetListResource = API_ROOT.concat(apilangfangTDK.GetgfbgGetList);
export const GetgfbgGetSourceResource = API_ROOT.concat(apilangfangTDK.GetgfbgGetSource);
export const GetgfbgSingleResource = API_ROOT.concat(apilangfangTDK.GetgfbgSingle);
export const GetGetListBySourceList = API_ROOT.concat(apilangfangTDK.GetGetListBySourceList);
export const GetTownAnalysisListForCustomResource = API_ROOT.concat(apilangfangTDK.GetTownAnalysisListForCustom);
export const PostselectAllChildResource = API_ROOT.concat(apilangfangTDK.PostselectAllChild);
export const PostselectAllParentResource = API_ROOT.concat(apilangfangTDK.PostselectAllParent);
export const PostselectClassIdsGroupResource = API_ROOT.concat(apilangfangTDK.PostselectClassIdsGroup);
export const PostselectByPubAndClassNetResource = API_ROOT.concat(apilangfangTDK.PostselectByPubAndClassNet);
export const PostselectPollutantDischargResource = API_ROOT.concat(apilangfangTDK.PostselectPollutantDischarge);
export const GetCaseListResource = API_ROOT.concat(apilangfangTDK.GetCaseList);
export const GetCaseAllResource = API_ROOT.concat(apilangfangTDK.GetCaseAll);
export const GetPollutionTypeResource = API_ROOT.concat(apilangfangTDK.GetPollutionType);
export const GetEditCaseResource = API_ROOT.concat(apilangfangTDK.GetEditCase);
export const GetExportCaseResource = API_ROOT.concat(apilangfangTDK.GetExportCase);
export const GetCaseImgResource = API_ROOT.concat(apilangfangTDK.GetCaseImg);
export const GetUploadImgResource = API_ROOT.concat(apilangfangTDK.GetUploadImg);
export const GetEditResultResource = API_ROOT.concat(apilangfangTDK.GetEditResult);
export const GetUserLoginResource = API_ROOT.concat(apilangfangTDK.GetUserLogin);//拼接登录
export const GetHourConcentrationResource = API_ROOT.concat(apilangfangTDK.GetHourConcentration);//拼接登录
export const GetDayConcentrationResource = API_ROOT.concat(apilangfangTDK.GetDayConcentration);//拼接登录
export const GetDustExcelOutPutResource = API_ROOT.concat(apilangfangTDK.GetDustExcelOutPut);
export const GetSixParamAirExcelOutPutResource = API_ROOT.concat(apilangfangTDK.GetSixParamAirExcelOutPut);
export const GetTVOCExcelOutPutResource = API_ROOT.concat(apilangfangTDK.GetTVOCExcelOutPut);
export const DayDataUrlResource = API_ROOT.concat(apilangfangTDK.DayDataUrl);
export const CaseImgUpResource = API_ROOT.concat(apilangfangTDK.CaseImgUp);
export const UploadAnalysisFileResource = API_ROOT.concat(apilangfangTDK.UploadAnalysisFile);
export const DianUploadFileResource = API_ROOT.concat(apilangfangTDK.DianUploadFile);
export const GetTownExcelOutPutResource = API_ROOT.concat(apilangfangTDK.GetTownExcelOutPut);
export const GetVideoScatterInfoResource = API_ROOT.concat(apilangfangTDK.GetVideoScatterInfo);
export const GetVocsVideoInfoResource = API_ROOT.concat(apilangfangTDK.GetVocsVideoInfo);
export const GetElectricityIndexChartResource = API_ROOT.concat(apilangfangTDK.GetElectricityIndexChart);
export const GetElectricityChartForDayResource = API_ROOT.concat(apilangfangTDK.GetElectricityChartForDay);
export const GetElectricityIndexChartForDayResource = API_ROOT.concat(apilangfangTDK.GetElectricityIndexChartForDay);
