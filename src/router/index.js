import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'//登录页面
//实时监控组页面
import Index from '@/views/Index'//实时监测页面
import HighVideos from '@/views/HighVideo'//高点视频监测
import homepage from '@/views/homePage'//项目说明
//气象预报组页面
import Dynamicwindfield from '@/views/WeatherForecast/DynamicWindField'//动态风场
import SuperStation from '@/views/WeatherForecast/SuperStation'//超级站
import WeatherStation from '@/views/WeatherForecast/WeatherStation'//气象站
import Weather from '@/views/WeatherForecast/Weather'//天气预报
import GridPrediction from '@/views/WeatherForecast/GridPrediction'//网格预报
//大数据模块组页面
import DustEmissionStatistics from '@/views/DataAnalysis/DustEmissionStatistics'//扬尘源统计
import LargeDataResources from '@/views/DataAnalysis/LargeDataResources'//大数据资源
import DistrictsCounties from '@/views/DataAnalysis/DistrictsCounties'//区县打分
import FixedSourceStatistics from '@/views/DataAnalysis/FixedSourceStatistics'//固定源统计
import SensorNetworkRanking from '@/views/DataAnalysis/SensorNetworkRanking'//传感网排名
import MeanRatioSensorNetwork from '@/views/DataAnalysis/MeanRatioSensorNetwork'//传感网均值比
import LikeWinter from '@/views/DataAnalysis/LikeWinter'//(今日战报)冬防战报
import AirStation from '@/views/DataAnalysis/AirStation'//乡镇空气站统计
import CityCheck from '@/views/DataAnalysis/CityCheck'//乡镇考核页面
import CountyCheck from '@/views/DataAnalysis/CountyCheck'//乡镇考核页面
import StateControl from '@/views/DataAnalysis/StateControl'//国省控排名页面
import DustRange from '@/views/DataAnalysis/DustRange'//工地扬尘排名页面
import SixParamRange from '@/views/DataAnalysis/SixParamRange'//六参数排名页面
import TvocRange from '@/views/DataAnalysis/TvocRange'//Tvoc排名页面
import CityRankings from '@/views/DataAnalysis/CityRankings'//城市排名测试页面
import OfficialReport from '@/views/DataAnalysis/OfficialReport'//官方报告
//解决缓存以及详情页面
import ScavengingCached from '@/views/ScavengingCached/index'//不需要缓存集合页面
//后台总集成页面
import Management from '@/views/Management/Management'//后台业务数据管理
import BusinessManagement from '@/views/Management/Business/BusinessManagement'//后台业务数据管理

Vue.use(Router)

export default new Router({
    routes: [
        //登录页面
        // {
        //     path: '/Login',
        //     name: 'Login',
        //     component: Login
        // },
        //实时监控页面（主页面）
        {
            path: '/',
            name: 'index',
            meta: { keepAlive: true },
            component: Index,
            //实时监控子路由模块
            children:[
                //国省控点右侧
                {
                  path:'MonitoringPoint',
                  meta: { keepAlive: true },
                  component:resolve => require(['@/components/Monitoringpoint_new'], resolve)
                },
                //乡镇页面右侧
                {
                    path:'TownshipPanel',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/Township_new'], resolve)
                },
                //TVOC页面有车右侧
                {
                    path:'tvocPanel',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/Tvoc_new'], resolve)
                },
                //六参数页面右侧
                {
                    path:'SenPanel',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/Sensornetwork_new'], resolve)
                },
                //工地（在线扬尘）右侧
                {
                    path:'OnlineListPanel',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/OnlineList_new'], resolve)
                },
                //应急清单右侧
                {
                    path:'EmergencylistPanel',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/Emergencylist_new'], resolve)
                },
                //静态原清单右侧
                {
                    path:'StaticdustPanel',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/Staticdust_new'], resolve)
                },
                //企业部分右侧
                {
                    path:'EnterprisePanel',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/Enterprise_new'], resolve)
                },
                //散乱污视频右侧
                {
                    path:'ScatteredDirtData',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/ScatteredDirtVideo_new'], resolve)
                },
                //VOCs视频右侧
                {
                    path:'VocsVideoData',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/VocsVideo_new'], resolve)
                },
                //全民举报
                {
                    path:'ReportWholePeople',
                    meta: { keepAlive: true },
                    component:resolve => require(['@/components/ReportWholePeople_new'], resolve)
                },
            ]
        },
        //乡镇统计
        {
            path: '/AirStation',
            name: 'AirStation',
            meta: { keepAlive: false },
            component: AirStation,
        },
        //homepage
        {
            path: '/homepage',
            name: 'homePage',
            component: homepage,
        },
        //城市排名页面
        {
            path: '/CityRankings',
            name: 'cityrankings',
            meta: { keepAlive: false },
            component: CityRankings,
        },
         //工地扬尘排名页面
        {
            path: '/DustRange',
            name: 'DustRange',
            meta: { keepAlive: false },
            component: DustRange,
        },
         //六参数排名页面
        {
            path: '/SixParamRange',
            name: 'SixParamRange',
            meta: { keepAlive: false },
            component: SixParamRange,
        },
         //tvoc排名页面
        {
            path: '/TvocRange',
            name: 'TvocRange',
            meta: { keepAlive: false },
            component: TvocRange,
        },
        //乡镇考核
        {
            path: '/CountyCheck',
            name: 'CountyCheck',
            meta: { keepAlive: false },
            component: CountyCheck,
        },
        //区县考核
        {
            path: '/CityCheck',
            name: 'CityCheck',
            meta: { keepAlive: false },
            component: CityCheck,
        },
        //国省控排名
        {
            path: '/StateControl',
            name: 'StateControl',
            meta: { keepAlive: false },
            component: StateControl,
        },
        //城市排名
        {
            path: '/CityRankings',
            name: 'CityRankings',
            meta: { keepAlive: false },
            component: CityRankings,
        },
        //传感网均值比
        {
            path: '/MeanRatioSensorNetwork',
            name: 'Meanratiosensornetwork',
            meta: { keepAlive: false },
            component: MeanRatioSensorNetwork
        },
        //大数据资源
        {
            path: '/LargeDataResources',
            name: 'LargeDataResources',
            meta: { keepAlive: false },
            component: LargeDataResources
        },
        //高点监控（视频监控页面）
        {
            path: '/HighVideos',
            name: 'heighvideos',
            component: HighVideos,
            meta: { keepAlive: false }
        },
        //官方报告
        {
            path: '/OfficialReport',
            name: 'OfficialReport',
            component: OfficialReport,
            meta: { keepAlive: false },

        },
        //解决缓存页面
        {
            path:'/ScavengingCached',
            name: 'ScavengingCached',
            component:ScavengingCached,
            meta: { keepAlive: false },
            children:[
                //官方报告详情页面
                {
                    path:'/ScavengingCached/repDetail',
                    name: 'repDetail',
                    component:resolve => require(['@/views/DataAnalysis/repDetail/detail'], resolve)
                },
            ]
        },
        //固定源统计
        {
            path: '/FixedSourceStatistics',
            name: 'Fixedsourcestatistics',
            meta: { keepAlive: false },
            component: FixedSourceStatistics
        },
        //传感网排名
        {
            path: '/SensorNetworkRanking',
            name: 'Sensornetworkranking',
            meta: { keepAlive: false },
            component: SensorNetworkRanking
        },
        //动态风场页面
        {
            path: '/dynamicweather',
            name: 'dynamicweather',
            meta: { keepAlive: false },
            component: Dynamicwindfield
        },
        //气象站
        {
            path: '/weatherstation',
            name: 'weatherstation',
            meta: { keepAlive: false },
            component: WeatherStation
        },
        //超级站
        {
            path: '/superstation',
            name: 'superstation',
            meta: { keepAlive: false },
            component: SuperStation
        },
        //天气预报
        {
            path: '/Weather',
            name: 'Weather',
            meta: { keepAlive: false },
            component: Weather
        },
        //区县打分
        {
            path: '/DistrictsCounties',
            name: 'DistrictsCounties',
            meta: { keepAlive: false },
            component: DistrictsCounties
        },
        //冬防战报（今日战报）
        {
            path: '/LikeWinter',
            name: 'likewinter',
            meta: { keepAlive: false },
            component: LikeWinter
        },
        //后台数据管理
        {
            path: '/Management',
            name: 'management',
            component: Management,
            meta: { keepAlive: true },
            redirect: '/Management/BusinessManagement',
            children:[
            	//基础数据管理
            	{
                    path:'/Management/BasisManagement',
                    component:resolve => require(['@/views/Management/Basis/BasisManagement'], resolve)
                },
 				//业务数据管理
				{
		            path: '/Management/BusinessManagement',
		            name: 'BusinessManagement',
		            component: BusinessManagement,
		            redirect: '/Management/BusinessManagement/Case-Review',
		            children:[
		            	//预警信息
		            	{
	                    	path:'/Management/BusinessManagement/Business-Warning',
	                    	component:resolve => require(['@/views/Management/Business/BusinessWarning'], resolve)
                		},
                		//运维记录
		            	{
	                    	path:'/Management/BusinessManagement/Business-Operation',
	                    	component:resolve => require(['@/views/Management/Business/BusinessOperation'], resolve)
                		},
                		//预警值
                		{
	                    	path:'/Management/BusinessManagement/Business-WarningVal',
	                    	component:resolve => require(['@/views/Management/Business/BusinessWarningVal'], resolve)
                		},
                		//TVOC值设置
                		{
	                    	path:'/Management/BusinessManagement/Business-TVOCVal',
	                    	component:resolve => require(['@/views/Management/Business/BusinessTVOCVal'], resolve)
                		},
                		//日数据管理
                		{
	                    	path:'/Management/BusinessManagement/Business-DayData',
	                    	component:resolve => require(['@/views/Management/Business/BusinessDayData'], resolve)
                		},
                		//案件管理
                		{
	                    	path:'/Management/BusinessManagement/Case-Review',
	                    	component:resolve => require(['@/views/Management/Business/CaseReview'], resolve)
                		},
                        //官方报告
                        {
                            path:'/Management/BusinessManagement/Business-Presentation',
                            component:resolve => require(['@/views/Management/Business/BusinessPresentation'], resolve)
                        },
                        //经济数据
                        {
                            path:'/Management/BusinessManagement/Business-Economic',
                            component:resolve => require(['@/views/Management/Business/BusinessEconomicData'], resolve)
                        },
                        //运维记录
                        {
                            path:'/Management/BusinessManagement/Business-operation',
                            component:resolve => require(['@/views/Management/Business/BusinessOperation'], resolve)
                        },
                        //BusinessElectricity.vue
                        {
                            path:'/Management/BusinessManagement/Business-Electricity',
                            component:resolve => require(['@/views/Management/Business/BusinessElectricity'], resolve)
                        }
		            ]
		        },
                
               
            
            ]
        },
        //网格预报
        {
            path: '/GridPrediction',
            name: 'GridPrediction',
            meta: { keepAlive: false },
            component: GridPrediction
        },
        //扬尘源统计
        // {
        //     path: '/DustEmissionStatistics',
        //     name: 'DustEmissionStatistics',
        //     meta: { keepAlive: false },
        //     component: DustEmissionStatistics
        // }
    ]
})
