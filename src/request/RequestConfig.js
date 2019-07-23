export default {
  development: [{
    site:'http://117.119.97.150',// 'http://117.119.97.150',//'http://devgkptplat.zhiscity.com',//'http://gkpt.zq12369.com:8015',//http://117.119.97.150:8063
    port: ':8063',//':8063',
    path: '/'
  },{
    site: 'http://117.119.97.150',
    port: ':8073',
    path: '/'
  },{
    site: 'http://117.119.97.150',//'http://117.119.97.150',//
    port: ':8061',//':8061',//
    path: '/'
  }],
  release: [{
    site:'http://gkpt.zq12369.com',// 'http://117.119.97.150',//'http://devgkptplat.zhiscity.com',//'http://gkpt.zq12369.com:8015',//http://117.119.97.150:8063
    port: ':8016',//':8063',
    path: '/'
  },{
    site: 'http://gkpt.zq12369.com',
    port: ':8015',
    path: '/'
  },{
    site: 'http://gkpt.zq12369.com',//'http://117.119.97.150',//
    port: ':8013',//':8061',//
    path: '/'
  }],
  getRequestUrlByType(type){
    let a = 1;
    console.log(process.env.API_ROOT);
    let apiConfig = this.release;
    (process.env.API_ROOT === 'DEV' || process.env.API_ROOT === 'TEST') && (apiConfig = this.release);
    let url = undefined;
    let cf = undefined;
    switch (type.toUpperCase()) {
      case 'MONPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Monitoring/GetMonitoringPointReal';
        break;
      case 'MONCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Monitoring/GetMonitoringPointChart';
        break;
      case 'MONCHARTHISTORY':
        cf = apiConfig[0];
        url = cf.site + 'api/Monitoring_7_24/';
        break;
      case 'SENSEPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/FcStation/GetFcStationList';
        break;
      case 'SENSEPOLLUTIONHISTORY':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/FcStation/GetHourPollution';
        break;
      case 'XHPOLLUTION':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + 'api/XhHb/GetXhHbPointsMicro';
        break;
      case 'XHPOLLUTIONCHAR':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + 'api/XhHb/GetXhHistoriesMicro';
        break;
      case 'VOCPOLLUTION':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + 'api/XhHb/GetXhHbPointsVoc';
        break;
      case 'SENSECHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/FcStation/GetSingleStationInfo';
        break;
      case 'VOCCHART':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbHistory';
        url = cf.site + cf.port + cf.path + 'api/XhHb/GetXhHistoriesVoc';
        break;
      case 'DUSTPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Dust/GetDustHourRanking_NEW';
        break;
      case 'DUSTCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Dust/GetDust24Hour_NEW';
        break;
      case 'VIDEOTAEGET':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Video/GetVideoDeviceInfo';
        break;
      case 'XHDUST':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + 'api/XhHb/GetXhHbPointsRaise';
        break;
      case 'XHDUSTCHAR':
        cf = apiConfig[0];
        // url = 'http://117.119.97.150:8063/api/XhHb/GetXhHbPoint';
        url = cf.site + cf.port + cf.path + 'api/XhHb/GetXhHistoriesRaise';
        //url = 'http://devgkptplat.zhiscity.com/api/XhHb/GetXhHistoriesRaise'
        break;
      case 'STATICTARGET':
        cf = apiConfig[1];
        url = cf.site + cf.port + cf.path + 'yqd/yqdcon/selectPollutantDischargeAll';
        break;
      case 'ENTERPRISE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Company/GetCompanyPointList';
        break;
      case 'COMPONYINFO':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Company/GetCompanyInfo?pscode=';
        break;
      case 'ENTERPRISECHAR':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Company/GetCompanyDetai';
        break;
      case 'EMERGENCY':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/EmergencyPlan/GetEmergencyList';
        break;
      case 'SENSEBATTLE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/winterpre/GetWinterPreAirGis';
        break;
      case 'DUSTBATTLE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/winterpre/GetWinterPreDustGis';
        break;
      case 'ENTREPRISEBATTLE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/winterpre/GetWinterPreCompanyGis';
        break;
      case 'GSCITYPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Monitoring/GetJjjAnd226MonitorList';
        break;
      case 'GSCITYPOLLUTIONCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Monitoring/GetJjjAnd226Detail';
        break;
      case 'MAINSIXPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/SixParamAir/GetSixParamAirList';
        break;
      case 'MAINSIXCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/SixParamAir/GetSixParamAirDetail';
        break;
      case 'WINTERPRE':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/WinterPre/GetWinterPreTVocGis';
        break;
      case 'TOWNPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Town/GetTownList';
        break;
      case 'TOWNCHART':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/Town/GetSingleTown';
        break;
      case 'GRIDPOLLUTION':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/GridForecast/GetGridForecast';
        break;
      case 'GRIDCHAR':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/GridForecast/GetGridForecast';
        break;
      case 'ALLREPORT':
        cf = apiConfig[2];
        url = cf.site + cf.port + cf.path + 'servicePlatform/mobile/selectCases';
        break;
      case 'ALLREPORTCHAR':
        cf = apiConfig[2];
        url = cf.site + cf.port + cf.path + 'servicePlatform/mobile/caseInfo';
        break;
      case 'MAPGEOSEARCH':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + 'api/MapBox/MapBoxData';
        break;
      case 'HISTORYDATA':
        cf = apiConfig[0];
        url = cf.site + cf.port + cf.path + '724json/';
        break;
    }
    return url;
  }
}
