<script>
  import Vue from 'vue'
  import BMap from 'BMap'
  import Coordtransform from 'coordtransform'
  import RequestHandle from '@/request/'
  import {bus} from '@/js/bus'

  export default {
    name: 'MainHandle',
    render() {
    },
    data() {
      return {
        lsMarkers: [],
        lsLabels: [],
        lsRedLabels: [],
        lsValueLabels: [],
        dataSource: [],
        searchSource: [],
        mouseLabel: undefined,
        mkm: undefined,
        markUrl: '/static/imgs/duststatic/',
        defaultType: 'LAYER_GS',
        maxZoom: 13,
        trafficLayer: undefined,
        searchInfoWindow: undefined,
        browser: 1,
        noGeoSearchLayers: ['LAYER_YQD', 'LAYER_YJ', 'LAYER_LK', 'LAYER_SP_SLW', 'LAYER_SP_VOC', 'LAYER_SP_GKW', 'LAYER_ZT', 'LAYER_HW', 'LAYER_JY', 'LAYER_QM']
      };
    },
    created() {
      bus.$once('setMainMap', this.setMap);//地图初始化
      bus.$on('setMainValueLabel', this.setLabelValueVisible);//设置值Label是否显示
      bus.$on('targetMainLayer', this.targetClick);//切换响应事件
      bus.$on('targetPollution', this.pollutionTargetClick);//指标切换响应事件
      bus.$on('setGSMarkerVisible', this.setGSMarkerLabelVisible);//设置国省控随比例显示
      bus.$on('locationClick', this.locationMarker);//右侧列表点击响应事件
      bus.$on('loadCumulative', this.loadCumulativeSource);//累计数据加载
      bus.$on('geoSearch', this.searchGeometry);//空间查询
      bus.$on('loadHistory', this.loadHistorySource);//加载时间轴数据
    },
    mounted() {

    },
    methods: {
      //区分浏览器类别
      myBrowser() {
        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        let isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
          return "Opera"
        }
        ; //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
          return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Chrome") > -1) {
          return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
          return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
          return "IE";
        }
        ; //判断是否IE浏览器
      },

      //设置Map对象
      setMap(map) {
        this.map = map;
        !this.mouseLabel && (this.mouseLabel = new BMap.Label(''), this.mouseLabel.setStyle({
          border: 'none',
          color: '#333',
          background: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei',
          boxShadow: '1px 3px 4px rgba(0,0,0,0.18)',
          padding: 0
        }), this.mouseLabel.hide(), this.map.addOverlay(this.mouseLabel));
        if (this.map) {
          this.targetClick(this.defaultType, true);
        }
      },

      //切换响应事件
      targetClick(type, hasVisible, from) {
        switch (type.toUpperCase()) {
          case 'LAYER_SP':
          case 'LAYER_SP_SLW':
          case 'LAYER_SP_VOC':
          case 'LAYER_SP_GD':
          case 'LAYER_SP_GKW':
          case 'LAYER_VOC':
          case 'LAYER_CG':
          case 'LAYER_CGQ_LCS':
          case 'LAYER_CGQ_GSX':
          case 'LAYER_CGQ_VOC':
          case 'LAYER_GS':
          case 'LAYER_GD':
          case 'LAYER_QY':
          case 'LAYER_CX':
          case 'LAYER_YQD':
          case 'LAYER_YJ':
          case 'LAYER_QM':
            //请求接口触发
            hasVisible ? this.requestData(type, from) : (this.removeMarkerByList(this.getMarkerByType(type), type), this.removeLabelValue(this.getLabelValueByType(type), type), this.removeLabelRed(this.getLabelRedByType(type), type), this.delDataSourceByCode(type));
            break;
          case 'LAYER_LK':
            this.targetTrafficLayer(hasVisible);
            break;
        }
      },

      //指标切换事件
      pollutionTargetClick(type, fieldName, displayName) {
        const t = this;
        let dt = this.getDataSourceByCode(type, fieldName);
        if (dt) {
          this.lsMarkers.length && this.removeMarkerByList(this.getMarkerByType(type), type);
          this.lsLabels.length && this.removeMarkerLabel(this.getMarkerLabelByType(type), type);
          this.lsRedLabels.length && this.removeLabelRed(this.getLabelRedByType(type), type);
          this.lsValueLabels.length && this.removeLabelValue(this.getLabelValueByType(type), type);
          //源清单切换图层缓存问题
          type.toUpperCase() === 'LAYER_YQD' ? setTimeout(() => {
            t.loadMarker(dt.data, type, fieldName, displayName);
          }, 200) : this.loadMarker(dt.data, type, fieldName, displayName);
          switch (type.toUpperCase()) {
            case 'LAYER_GS':
              bus.$emit('switchRender', fieldName);
              break;
            case 'LAYER_CGQ_LCS':
              bus.$emit('refreshTarget', fieldName);
              break;
            case 'LAYER_GD':
              bus.$emit('refreshDustTarget', fieldName);
              break;
            case 'LAYER_YQD':
              bus.$emit('setStaticTarget', fieldName);
              break;
            case 'LAYER_QY':
              break;
          }
        }
      },

      //点击播放关联视频
      AssociatedVideo(id) {
        //获取需要视频idcode
        let idcode = id;
        //跳转页面传递idcode
        this.$router.push({
          path: '/HighVideos',
          query: {
            id: idcode
          }
        })
      },

      //右侧面板点击事件
      locationMarker(type, data, fieldName, hasSearch = false) {
        if (!data) {
          return;
        }
        let lng = data.lng || data.longitude;
        let lat = data.lat || data.latitude;
        let pt = new BMap.Point(lng, lat);
        if (!hasSearch) {
          if (data && type) {
            data['ptType'] = type;
            type.toUpperCase() === 'LAYER_GS' && (data['isLf'] = true, data['dataLevel'] = 1);
            type.toUpperCase() !== 'LAYER_GS' && (pt = this.wgsPointToBd(pt));
            this.markerClick(data, pt, fieldName);
          }
        } else {
          let code = data.layer.toUpperCase();
          let ckItem = this.dataSource.find(v => v.code === code) || {};
          let dtItem = undefined;
          let fieldName = undefined;
          switch (code) {
            case 'LAYER_GS':
              dtItem = {
                pointname: data.names,
                citygid: data.id,
                isLf: true,
                dataLevel: 1
              };
              fieldName = 'aqi';
              break;
            case 'LAYER_CGQ_LCS':
              dtItem = {
                stationid: data.six_stationid,
                dataType: data.dateType,
                stationname: data.names
              };
              fieldName = 'aqi';
              break;
            case 'LAYER_CGQ_VOC':
              dtItem = {
                stationid: data.xh_stationid,
                pointname: data.names
              };
              fieldName = 'tVOC_V';
              break;
            case 'LAYER_CX':
              dtItme = {
                Stationid: data.town_Stationid,
                name: data.names
              };
              fieldName = 'pm25';
              break;
            case 'LAYER_GD':
              dtItem = {
                deviceid: data.deviceid,
                sourcetype: data.sourcetype,
                name: data.names
              };
              fieldName = 'pm25';
              break;
            case 'LAYER_QY':
              dtItem = {
                pscode: data.pscode,
                psname: data.names
              };
              fieldName = 'smokeStatus';
              break;
            case 'LAYER_SP_VOC':
            case 'LAYER_SP_SLW':
            case 'LAYER_SP_GKW':
              this.AssociatedVideo(data.id);
              break;
            // dtItem = {
            //   CamName: data.voc_name,
            //   TypeName: 'VOC'
            // };
            // dtItem = {
            //   CamName: data.slw_name,
            //   TypeName: '散乱污'
            // };

          }
          dtItem && (dtItem['ptType'] = code, this.markerClick(dtItem, pt, ckItem.fieldName || fieldName));
        }
      },

      //加载累计数据
      loadCumulativeSource(data, type, fieldName, displayName) {
        const t = this;
        this.lsMarkers.length && this.removeMarkerByList(this.getMarkerByType(type), type);
        this.lsLabels.length && this.removeMarkerLabel(this.getMarkerLabelByType(type), type);
        this.lsRedLabels.length && this.removeLabelRed(this.getLabelRedByType(type), type);
        this.lsValueLabels.length && this.removeLabelValue(this.getLabelValueByType(type), type);
        if (type.toUpperCase() === 'LAYER_YQD') {
          setTimeout(function(){
            t.requestData(type, undefined, data);
          },500);
        } else {
          type.toUpperCase() === 'LAYER_GS' && (data.forEach(v => (v['dataLevel'] = '1', v['isLf'] = true)));
          data.length && (this.loadMarker(data, type, fieldName, displayName), this.setDataSource(type, data, fieldName, displayName));
        }
      },

      //加载历史数据
      loadHistorySource(tm, hasReset, cbk) {
        const t = this;
        if (t.dataSource.length) {
          t.lsMarkers.length && t.clearMarkers();
          let dsItem = t.dataSource[0];
          let code = dsItem.code;
          let fieldName = dsItem.fieldName;
          let displayField = dsItem.displayField;
          if (hasReset) {
            //重置
            t.loadMarker(dsItem.data, code, fieldName, displayField);
          } else {
            let urlHS = RequestHandle.getRequestUrl('HISTORYDATA');
            let fileName = `${tm.year}${tm.month}${tm.day}${tm.hours}.json`;
            let folderName = `${tm.year}${tm.month}${tm.day}`;

            switch (code.toUpperCase()) {
              case 'LAYER_GS':
                urlHS += `Monitoring/${folderName}/${fileName}`;
                break;
              case 'LAYER_CGQ_LCS':
                urlHS += `SixParam/${folderName}/${fileName}`;
                break;
              case 'LAYER_CX':
                urlHS += `TOWN/${folderName}/${fileName}`;
                break;
              case 'LAYER_GD':
                urlHS += `Dust/${folderName}/${fileName}`;
                break;
              case 'LAYER_QY':
                urlHS += `Company/${folderName}/${fileName}`;
                break;
              case 'LAYER_CGQ_VOC':
                urlHS += `TVOC/${folderName}/${fileName}`;
                break;
            }
            let params = {
              url: urlHS,
              type: 'GET',
              pms: null
            };

            RequestHandle.request(params, (result) => {
              if (result.status) {
                t.loadMarker(result.obj, code, fieldName, displayField);
                //t.setLabelValue(result.obj, code, fieldName, displayField);
              }
            }, (ex) => {
              console.error(ex);
            })
          }
        } else {
          cbk();
        }
      },

      //测试
      setLabelValue(dt, code, fieldName, displayField) {
        const t = this;
        t.lsMarkers.forEach((v) => {
          let mk = v.marker;
          let atr = mk.attributes;
          let hv = dt.find(v => v.citygid === atr.citygid);
          hv && mk.setContent(hv[fieldName]);
        });
      },

      //圈选查询事件
      searchGeometry(ol) {
        let searchSource = this.dataSource.length && this.searchSourceDataByGeometry(ol);
        let hasFactor = !!searchSource.length;
        if (!searchSource.length) {
          let defaultSource = this.dataSource.find(v => (v.code.toUpperCase() === 'LAYER_GS'));
          this.dataSource.length && (searchSource.push({
            'fieldName': defaultSource.fieldName,
            'layerCode': defaultSource.code,
            'Id': ''
          }))
        }
        let urlQM = RequestHandle.getRequestUrl('MAPGEOSEARCH');

        RequestHandle.request({
          url: urlQM,
          type: 'POST',
          pms: hasFactor ? {Id: searchSource.map(v => v.Id)} : {}
        }, function (result) {
          let dt = result.obj;
          bus.$emit('loadSearchChar', dt, searchSource, hasFactor);
        });
      },

      //发送请求获取相应数据
      requestData(type, from, params = undefined) {
        const t = this;
        this.lsMarkers.length && this.removeMarkerByList(this.getMarkerByType(type), type);
        this.lsLabels.length && this.removeMarkerLabel(this.getMarkerLabelByType(type), type);
        this.lsRedLabels.length && this.removeLabelRed(this.getLabelRedByType(type), type);
        this.lsValueLabels.length && this.removeLabelValue(this.getLabelValueByType(type), type);
        let lsUrl = [];
        let fieldName = undefined;
        let displayName = undefined;
        let pms = undefined;
        //let pmsKey = undefined;
        let requestType = 'GET';
        let uppercaseType = type.toUpperCase();
        switch (uppercaseType) {
          case 'LAYER_SP':
          case 'LAYER_SP_SLW':
          case 'LAYER_SP_VOC':
          case 'LAYER_SP_GD':
          case 'LAYER_SP_GKW':
            //pmsKey = uppercaseType === 'LAYER_SP' ? undefined : (uppercaseType === 'LAYER_SP_SLW' ? '' : (uppercaseType === 'LAYER_SP_VOC' ? '' : (uppercaseType === 'LAYER_SP_GKW' ? '' : undefined)));
            let urlSP = RequestHandle.getRequestUrl('VIDEOTAEGET');
            displayName = 'CamName';
            //pmsKey && (pms = {key: pmsKey});
            lsUrl.push(urlSP);
            break;
          case 'LAYER_CG':
          case 'LAYER_CGQ_LCS':
          case 'LAYER_CGQ_GSX':
            //pmsKey = uppercaseType === 'LAYER_CG' ? undefined : (uppercaseType === 'LAYER_CGQ_LCS' ? '' : (uppercaseType === 'LAYER_CGQ_GSX' ? '' : (uppercaseType === 'LAYER_CGQ_VOC' ? '' : undefined)));
            let urlLCS = RequestHandle.getRequestUrl('MAINSIXPOLLUTION');
            //pmsKey && (pms = {key: pmsKey});
            fieldName = 'aqi';
            displayName = 'stationname';
            lsUrl.push(urlLCS);
            break;
          case 'LAYER_VOC':
          case 'LAYER_CGQ_VOC':
            let urlVOC = RequestHandle.getRequestUrl('VOCPOLLUTION');
            fieldName = 'tVOC_V';
            displayName = 'pointName';
            lsUrl.push(urlVOC);
            break;
          case 'LAYER_CGQ_SLW':
            let urlSLW = RequestHandle.getRequestUrl('VOCPOLLUTION');
            fieldName = 'aqi';
            lsUrl.push(urlSLW);
            break;
          case 'LAYER_GS':
            let urlGS = RequestHandle.getRequestUrl('GSCITYPOLLUTION');
            fieldName = 'aqi';
            displayName = 'pointname';
            lsUrl.push(urlGS);
            break;
          case 'LAYER_GD':
            let urlGD = RequestHandle.getRequestUrl('DUSTPOLLUTION');
//            let urlXHGD = RequestHandle.getRequestUrl('XHDUST');
            fieldName = 'pm25';
            displayName = 'name';
            lsUrl.push(urlGD);
            break;
          case 'LAYER_QY':
            let urlQY = RequestHandle.getRequestUrl('ENTERPRISE');
            lsUrl.push(urlQY);
            fieldName = 'smokeStatus';
            displayName = 'psname';
            break;
          case 'LAYER_CX':
            let urlCX = RequestHandle.getRequestUrl('TOWNPOLLUTION');
            lsUrl.push(urlCX);
            fieldName = 'pm25';
            displayName = 'name';
            break;
          case 'LAYER_YQD':
            let urlYQ = RequestHandle.getRequestUrl('STATICTARGET');
            lsUrl.push(urlYQ);
            requestType = 'GET';
            fieldName = 'so2';
            displayName = 'name';
            pms = params || {ids: '0001'};
            break;
          case 'LAYER_YJ':
            let urlYJ = RequestHandle.getRequestUrl('EMERGENCY');
            lsUrl.push(urlYJ);
            fieldName = '';
            displayName = 'companyname';
            break;
          case 'LAYER_QM':
            let urlQM = RequestHandle.getRequestUrl('ALLREPORT');
            lsUrl.push(urlQM);
            fieldName = 'casecode';
            displayName = '';
            pms = {
              uname: '', status: '', pollutiontype: '', departmenttype: '', starttime: '', endtime: ''
            };
            break;
        }
        let reqPms = undefined;
        if (pms) {
          for (let k in pms) {
            if (!reqPms) {
              reqPms = k + '=' + pms[k];
            } else {
              reqPms += '&' + k + '=' + pms[k];
            }
          }
        }
        for (let i = 0, length = lsUrl.length; i < length; i++) {
          let url = lsUrl[i];
          let params = {url: url + (reqPms ? ('?' + reqPms) : ''), type: requestType, pms: null};
          RequestHandle.request(params, function (result) {
            if (result.status) {
              let rtValue = [];
              let dt = result.obj;
              if (dt) {
                for (let k = 0, length = dt.length; k < length; k++) {
                  let item = dt[k];
                  if (item.Type == from) {
                    rtValue.push(dt[k]);
                  }
                }
              }
              rtValue.length && (t.loadMarker(rtValue, type, fieldName, displayName), t.setDataSource(type, rtValue, fieldName, displayName));
            }
          }, function (e) {
            console.error(e);
          });
        }
      },

      //dataSource存储根据图层标识
      setDataSource(code, data, fieldName, displayField) {
        let o = this.dataSource.find(v => (v.code.toUpperCase() === code.toUpperCase()));
        if (!o) {
          let otherAtr = this.getOtherAttributeByType(code);
          this.dataSource.push({code: code.toUpperCase(), fieldName: fieldName, displayField: displayField, data: data, index: otherAtr.index || -1});
        } else {
          o.data = data;
        }
        this.dataSource.length > 1 && this.dataSource.sort(function (m, n) {
          return m.index - n.index;
        });
        bus.$emit('hasLoadHistory', this.dataSource.length);
      },

      //全局查询dataSource
      searchDataSource(code, value) {
        const t = this;
        let searchSource = (code === 'ALL' ? this.dataSource : this.getDataSourceByCode(code));
        let searchValue = [];
        if (Array.isArray(searchSource)) {
          searchSource.forEach(v => (searchValue = searchValue.concat(t.searchFunction(v, value))));
        } else {
          searchValue = searchValue.concat(t.searchFunction(searchSource, value));
        }
      },

      //条件检索
      searchFunction(obj, value) {
        let displayField = obj.displayField;
        return obj.data.filter(v => (v[displayField].indexOf(value) !== -1));
      },

      //空间检索实现
      searchSourceDataByGeometry(overlay) {
        let rtValue = [];
        if (overlay) {
          let center = overlay.getCenter();
          let bounds = overlay.getBounds();
          let radius = overlay.getRadius();
          let southWest = bounds.getSouthWest();
          let northEast = bounds.getNorthEast();
          let minX = southWest.lng;
          let minY = southWest.lat;
          let maxX = northEast.lng;
          let maxY = northEast.lat;
          for (let i = 0, length = this.dataSource.length; i < length; i++) {
            let item = this.dataSource[i];
            let otherAtr = this.getOtherAttributeByType(item.code);
            if (this.noGeoSearchLayers.includes(item.code.toUpperCase()))
              continue;
            let dt = item.data;
            for (let j = 0, count = dt.length; j < count; j++) {
              let vl = dt[j];
              let lng = vl.longitude;
              let lat = vl.latitude;
              if (lng < minX || lat < minY || lng > maxX || lat > maxY) {
                continue;
              }
              let dns = this.distance(center.lat, center.lng, lat, lng);
              //let distance = Math.Sqrt(Math.Pow(Math.Abs(center.lng - lng), 2) + Math.Pow(Math.Abs(center.lat - lat), 2));
              if (dns <= radius) {
                rtValue.push({
                  'fieldName': item.fieldName,
                  'layerCode': item.code,
                  'Id': otherAtr && (vl[otherAtr.pk])
                });
              }
            }
          }
        }
        return rtValue;
      },

      //获取dataSource根据图层标识
      getDataSourceByCode(code, fieldName) {
        return this.dataSource.find(function (v) {
          let rtValue = v.code.toUpperCase() === code.toUpperCase();
          rtValue && (v.fieldName = fieldName);
          return rtValue;
        });
      },

      //删除dataSource根据图层标识
      delDataSourceByCode(code) {
        this.dataSource = this.dataSource.filter(v => (v.code.toUpperCase() !== code.toUpperCase()));
        bus.$emit('hasLoadHistory', this.dataSource.length);
      },

      //路况显隐性切换
      targetTrafficLayer(hasVisible) {
        if (hasVisible) {
          this.trafficLayer = new BMap.TrafficLayer();
          this.map.addTileLayer(this.trafficLayer);
        }
        else {
          this.trafficLayer && this.map.removeTileLayer(this.trafficLayer);
          this.trafficLayer = undefined;
        }
      },

      //加载Marker
      loadMarker(data, type, fieldName, displayName, hasPass = true) {
        let startTime = new Date();
        const t = this;
        hasPass && this.passRequestData(data, type, fieldName);
        let mb = this.myBrowser();
        //判断不是火狐谷歌全部使用gif
        if ('FF' !== mb && 'Chrome' !== mb)
          this.browser = 0;

        for (let i = 0, length = data.length; i < length; i++) {
          let value = data[i];
          value['ptType'] = type;
          let pt = new BMap.Point(value.lo || value.lng || value.Longitude || value.longitude, value.la || value.lat || value.Latitude || value.latitude);
          let marker = type.toUpperCase() === 'LAYER_GS' ? t.getGSValueLabel(pt, value, fieldName) : t.getMarker(pt, t.getMarkerState(value, type, fieldName), type, value[displayName] || undefined);

          let label = t.getDisplayFieldLabel(pt, value, displayName);
          (label && type.toUpperCase() === 'LAYER_GS') && (t.map.addOverlay(label), this.hasMarkerVisible(value) ? label.show() : label.hide(), label.attributes = value, label.valueField = fieldName, label.layerType = type, label.displayField = displayName, t.lsMarkers.push({
            marker: label,
            type: type
          }));
          //获取警报Label
          let labelRed = t.getLabelRed(value, type, fieldName, pt, this.browser);
          (labelRed && (value.isLf || true) && ((parseInt(value.dataLevel) === 1) || true)) && (t.lsRedLabels.push({label: labelRed, type: type, attributes: value}), t.map.addOverlay(labelRed), t.map.getZoom() > 9 ? labelRed.show() : labelRed.hide());

          //加载数值Label
          let labelValue = t.setValueLabel(value, fieldName, type, pt);
          (labelValue && (type.toUpperCase() !== 'LAYER_GS' && type.toUpperCase() !== 'LAYER_QY')) && (t.lsValueLabels.push({label: labelValue, type: type}), marker.setLabel(labelValue));//t.map.addOverlay(labelValue));

          marker && ((type.toUpperCase() !== 'LAYER_YQD' && t.map.addOverlay(marker)), marker.attributes = value, marker.valueField = fieldName, marker.layerType = type, marker.displayField = displayName, t.lsMarkers.push({
            marker: marker,
            type: type
          }), (type.toUpperCase() !== 'LAYER_GS' && ((marker.addEventListener('mouseover', function (e) {
            let tg = e.target || e.currentTarget;
            let mkLabel = this.getLabel();
            mkLabel && mkLabel.hide();
            t.setMouseLabel(tg);
          })), marker.addEventListener('mouseout', function (e) {
            let mkLabel = this.getLabel();
            mkLabel && (t.map.getZoom() >= t.maxZoom ? mkLabel.show() : mkLabel.hide());
            t.mouseLabel.hide();
          }))), marker.addEventListener('click', function (e) {
            let tg = e.target;
            let point = new BMap.Point(tg.getPosition().lng, tg.getPosition().lat);
            t.markerClick(tg.attributes, point, fieldName);
          }));

          //实现聚合效果
          if (type.toUpperCase() === 'LAYER_YQD' && i === length - 1) {
            this.mkm = new BMapLib.MarkerClusterer(this.map, {}, fieldName);
            let mks = this.getMarkerByType(type) || [];
            let clu = mks.map(v => (v.marker));
            clu.length && this.mkm.addMarkers(clu);
            this.mkm.setStyles(this.getMarkerCluster());
          }
        }
        let endTime = new Date();
        console.log('地图此次加载用时：' + (endTime - startTime) + 'ms');
      },

      //传送数据
      passRequestData(data, type, fieldName, hasLoaded) {
        switch (type.toUpperCase()) {
          case 'LAYER_SP_SLW':
            break;
          case 'LAYER_SP_VOC':
            break;
          case 'LAYER_SP_GKW':
            break;
          case 'LAYER_CGQ_LCS':
            bus.$emit('loadMarkerData', data, fieldName);
            break;
          case 'LAYER_CGQ_VOC':
            break;
          case 'LAYER_GS':
            bus.$emit('refreshRanking', data.filter(v => (v.isLf && v.dataLevel === '1')), fieldName);
            break;
          case 'LAYER_GD':
            bus.$emit('refreshDustRanking', data, fieldName);
            break;
          case 'LAYER_QY':
            break;
          case 'LAYER_CX':
            break;
          case 'LAYER_YQD':
            break;
          case 'LAYER_YJ':
            bus.$emit('loadEmergencyData', data, fieldName);
            break;
          case 'LAYER_JY':
            break;
          case 'LAYER_ZT':
            break;
          case 'LAYER_HW':
            break;
        }
      },

      //获取国省控点ValueLabel
      getGSValueLabel(pt, value, fieldName) {
        let count = value[fieldName] || value[fieldName.toLocaleLowerCase()];
        let level = fieldName.toUpperCase() !== 'WINDANGLE' && this.getPollutionState(count || 0, fieldName) || 0;
        let mkOverlay = undefined;

        if (fieldName.toUpperCase() === 'WINDANGLE') {
          level = this.getPollutionState(parseInt(value.windspeed) || 0,fieldName);
          let icon = `static/imgs/arrow/color/${level}.png`;
          let myIcon = new BMap.Icon(icon, new BMap.Size(25, 25));
          mkOverlay = new BMap.Marker(pt, {icon: myIcon, offset: new BMap.Size(0, -10)});
          mkOverlay.setRotation(count || 0);
        }
        else {
          let opts = {
            position: pt,
            offset: new BMap.Size(-20, -30)
          };
          let bgColor = (count ? getColorByIndex(level) : '#999') || '#999';
          mkOverlay = new BMap.Label(((count === null || count === undefined) ? '--' : count) + '<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-top: 8px solid; border-right: 8px solid transparent; color:' + bgColor + '; position: absolute;  margin-top:-2px;margin-left:8px  " ></div>', opts);  // 创建文本标注对象
          mkOverlay.setStyle({
            color: level > 3 ? '#fff' : '#333',
            background: bgColor,
            fontSize: '14px',
            border: 'none',
            width: '35px',
            textAlign: 'center',
            height: '22px',
            lineHeight: '22px',
            cursor: 'pointer',
            borderRadius: '4px'
          });
        }
        this.hasMarkerVisible(value) ? mkOverlay.show() : mkOverlay.hide();
        return mkOverlay;
      },

      //获取显示Label
      getDisplayFieldLabel(pt, value, displayField) {
        //let conPoint = this.wgsPointToBd(pt);
        let displayValue = value[displayField];
        let label = new BMap.Label(displayValue || '');
        label.setStyle({
          border: 'none',
          color: '#333',
          background: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei',
          boxShadow: '1px 3px 4px rgba(0,0,0,0.18)',
          padding: '0 5px'
        });
        label.setPosition(pt);
        displayValue && label.setOffset(new BMap.Size(-((displayValue.length * 14) / 2) - 6, 0));
//        label.show();
//        this.hasMarkerVisible(value) ? label.show() : label.hide();
        return label;
      },

      //获取Label状态
      getMarkerLabelState(data, ptType, fieldName) {
        let value = data[fieldName] || data[fieldName.toLocaleLowerCase()];
        let level = 0;
        if (ptType.toUpperCase() === 'LAYER_VOC' || ptType.toUpperCase() === 'LAYER_CGQ_VOC') {
          level = data.polluLevel || 0;//getVOCLeveColorIndex(data.tVOC_V) || 0;
          value = (data[fieldName] === null || data[fieldName] === undefined) ? '--' : data[fieldName];
        } else if (ptType.toUpperCase() === 'LAYER_QY') {
          level = data['isOnline'] ? (value ? 4 : 0) : 0;//getNO2LevelIndex(value) || 1;
          value = data['smoke'] || '--';
        } else if (ptType.toUpperCase() === 'LAYER_SP_SLW' || ptType.toUpperCase() === 'LAYER_SP_VOC' || ptType.toUpperCase() === 'LAYER_SP_GKW') {
          value = data[fieldName];
        }
//        else if (ptType.toUpperCase() === 'LAYER_GD') {
//          level = this.getPollutionState(value, fieldName) || -1;
//          value = data[fieldName] || '--';
//        } else if (ptType.toUpperCase() === 'LAYER_CX') {
//          level = this.getPollutionState(value, fieldName) || -1;
//          value = data[fieldName] || '--';
//        }
        else {
          level = this.getPollutionState(value || 0, fieldName) || 0;
          value = (value === null || value === undefined || value === '') ? '--' : value;//data[fieldName] || '--';
        }
        return {level: level, value: value};
      },

      //设置MouseLabel相关显示信息
      setMouseLabel(tg) {
        const t = this;
        let attr = tg.attributes;
        let displayFieldName = tg.displayField;
        let valueField = tg.valueField;
        let lt = tg.layerType;
        if (lt.toUpperCase() === 'LAYER_YQD' || lt.toUpperCase() === 'LAYER_YJ' || lt.toUpperCase() === 'LAYER_QY' || lt.toUpperCase() === 'LAYER_SP_SLW' || lt.toUpperCase() === 'LAYER_SP_VOC' || lt.toUpperCase() === 'LAYER_SP_GKW') {
          let ptName = attr[displayFieldName] || attr['psname'];
          ptName && (t.mouseLabel.setContent('<span style="padding:0 5px;">' + ptName + '</span>' + '<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid; border-right: 8px solid transparent; color:#fff; position: absolute;  margin-top:-26px;margin-left:' + (ptName.length * 14) / 2 + 'px  " ></div>'),
            t.mouseLabel.setPosition(tg.getPosition()),
            t.mouseLabel.setOffset(new BMap.Size(-(ptName.length * 14) / 2 - 14, 12)),
            t.mouseLabel.show());
        }
        else {
          if (attr && displayFieldName) {
            // let v = attr[valueField];
            // if (v) {
            let mouseState = t.getMarkerLabelState(attr, lt, valueField);
            let ptName = attr[displayFieldName] || attr['psname'];//兼容企业显示字段
            let col = '#00ff00';
            if (lt.toUpperCase() === 'LAYER_QY') {
              col = mouseState.level ? '#43ce17' : '#d20040';
            } else {
              col = getColorByIndex(mouseState.level);
            }
            !(attr[valueField] || attr[valueField.toLocaleLowerCase()]) && (col = '#999');
            let mouseContent = '<div><span style="padding:0 5px;">' + ptName + '</span><span style="display:inline-block;width:32px;text-align:center;color:' + (mouseState.level > 3 ? '#fff;' : '#333;') + 'background-color:' + col + '">' + mouseState.value + '</span></div>' + '<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid; border-right: 8px solid transparent; color:#fff; position: absolute;  margin-top:-26px;margin-left:' + (ptName.length * 14 + 32) / 2 + 'px  " ></div>';
            //ptName && (t.mouseLabel.setContent(ptName + '<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid #fff; border-right: 8px solid transparent; color:#333; position: absolute;  margin-top:-24px;margin-left:' + (ptName.length * 6 - 8) + 'px"></div>'),
            ptName && (t.mouseLabel.setContent(mouseContent),
              t.mouseLabel.setPosition(tg.getPosition()),
              t.mouseLabel.setOffset(new BMap.Size(-(ptName.length * 14 + 32) / 2 - 12, 12)),
              t.mouseLabel.show());
            // }
          }
        }
      },

      //获取警报Label
      getLabelRed(data, ptType, fieldName, pt, waringType) {
        let labelRed = undefined;
        if (ptType.toUpperCase() === 'LAYER_GS' || ptType.toUpperCase() === 'LAYER_CGQ_LCS' || ptType.toUpperCase() === 'LAYER_CGQ_VOC') {
          let hasRed = data[fieldName.toUpperCase() === 'TVOC_V' ? 'IsAlert' : (fieldName + 'IsAlert')] || false;
          //警报
          if (hasRed) {
            let conPoint = this.wgsPointToBd(pt);
            if (waringType) {
              let elContext = '<div class="pulse"></div><div class="pulse1"></div>';
              let opts = {
                position: (ptType.toUpperCase() === 'LAYER_SP' || ptType.toUpperCase() === 'LAYER_SP_VOC' || ptType.toUpperCase() === 'LAYER_CGQ_VOC' || ptType.toUpperCase() === 'LAYER_GD') ? conPoint : pt,//ptType.toUpperCase() === 'LAYER_CGQ_LCS' ||
                offset: (ptType.toUpperCase() === 'LAYER_SP' || ptType.toUpperCase() === 'LAYER_CGQ_LCS' || ptType.toUpperCase() === 'LAYER_SP_VOC' || ptType.toUpperCase() === 'LAYER_CGQ_VOC' || ptType.toUpperCase() === 'LAYER_GD') ? new BMap.Size(-35, -35) : new BMap.Size(-35, -35)
              };
              labelRed = new BMap.Label(elContext, opts);
              labelRed.setStyle({
                border: 'none',
                background: 'none',
                height: '60px',
                width: '60px',
              });
            } else {
              let imgUrl = 'static/imgs/main/red10.gif';//this.getMarkerIcon(type);
              let icon = new BMap.Icon(imgUrl, new BMap.Size(62, 62));//|| ptType.toUpperCase() === 'LAYER_CGQ_LCS'
              labelRed = new BMap.Marker((ptType.toUpperCase() === 'LAYER_SP' || ptType.toUpperCase() === 'LAYER_SP_VOC' || ptType.toUpperCase() === 'LAYER_CGQ_VOC' || ptType.toUpperCase() === 'LAYER_GD') ? conPoint : pt, {
                //marker = new BMap.Marker((lyType.toUpperCase() === 'LAYER_GS') ? pt:conPoint, {
                icon: icon,
                offset: new BMap.Size(-5, -5)
              });
            }
          }
        }
        return labelRed;
      },

      //获取Marker状态
      getMarkerState(data, ptType, fieldName) {
        let value = fieldName && (data[fieldName] || data[fieldName.toLocaleLowerCase()]) || 0;
        let level = 0;
        ptType = ptType.toUpperCase();
        switch (ptType) {
          case 'LAYER_VOC':
          case 'LAYER_CGQ_VOC':
            level = data.polluLevel || 0;//getVOCLeveColorIndex(data.tVOC_V) || 0;
            break;
          case 'LAYER_QY':
            level = value === 1 ? 0 : (value === 2 ? 2 : (value === 3 ? 4 : (value === 4 ? 1 : 0)));//data['isOnline'] ? (value ? 4 : 1) : 0;
            break;
          case 'LAYER_YQD':
            level = 2;
            break;
          case 'LAYER_YJ':
            level = -1;
            break;
          case 'LAYER_SP_SLW':
          case 'LAYER_SP_VOC':
          case 'LAYER_SP_GKW':
          case 'LAYER_QM':
            level = 1;
            break;
          default:
            level = this.getPollutionState(value, fieldName);
            break;
        }
        let iconName = ptType !== 'LAYER_YJ' ? this.getIconName(ptType, level - 1) : ('yj-' + data.whetherpeak + '-' + data.buttonstate);
        return iconName.toUpperCase();
      },

      //获取污染指标状态
      getPollutionState(value, type) {
        let level = 0;
        value-=0;
        if (type) {
          switch (type.toUpperCase()) {
            case 'AQI':
              level = getAQILevelIndex(value);
              break;
            case 'PM25':
              level = getPM25LevelIndex(value);
              break;
            case 'PM10':
              level = getPM10LevelIndex(value);
              break;
            case 'SO2':
              level = getSO2LevelIndex(value);
              break;
            case 'NO2':
              level = getNO2LevelIndex(value);
              break;
            case 'CO':
              level = getCOLevelIndex(value);
              break;
            case 'O3':
              level = getO3LevelIndex(value);
              break;
            case 'COMPLEXINDEX':
            case 'COM_INDEX':
              level = getComplexIndex(value);
              break;
            case 'TEMP':
              level = getTempLevelIndex(value);
              break;
            case 'HUMI':
              level = getHumiLevelIndex(value);
              break;
            case 'WINDSPEED':
            case 'WINDANGLE':
              level = getWindLevelIndex(parseInt(value));
              break;
            default:
              level = 0;
              break;
          }
        }
        return level;
      },

      //获取Icon名称
      getIconName(ptType, level) {
        let iconName = undefined;
        switch (ptType.toUpperCase()) {
          case 'LAYER_CG':
            iconName = 'cgq-';
            break;
          case 'LAYER_CGQ_LCS':
            iconName = 'cgq-lcs-';
            break;
          case 'LAYER_CGQ_GSX':
            iconName = 'cgq-gsx-';
            break;
          case 'LAYER_CGQ_VOC':
            iconName = 'cgq-voc-';
            break;
          case 'LAYER_VOC':
            iconName = 'voc-';
            break;
          case 'LAYER_GS':
            iconName = 'gs-';
            break;
          case 'LAYER_GD':
            iconName = 'gd-';
            break;
          case 'LAYER_QY':
            iconName = 'qy-';
            break;
          case 'LAYER_SP':
            iconName = 'sp-';
            break;
          case 'LAYER_SP_SLW':
            iconName = 'sp-slw-';
            break;
          case 'LAYER_SP_VOC':
            iconName = 'sp-voc-';
            break;
          case 'LAYER_SP_GD':
            iconName = 'sp-gd-';
            break;
          case 'LAYER_SP_GKW':
            iconName = 'sp-gkwgl-';
            break;
          case 'LAYER_LK':
            iconName = 'lk-';
            break;
          case 'LAYER_ZT':
            iconName = 'ztc-';
            break;
          case 'LAYER_HW':
            iconName = 'hwc-';
            break;
          case 'LAYER_JY':
            iconName = 'jyz-';
            break;
          case 'LAYER_CX':
            iconName = 'cx-';
            break;
          case 'LAYER_YQD':
            iconName = 'yqd-';
            break;
          case 'LAYER_QM':
            iconName = 'qm-';
            break;
        }
        switch (level) {
          case -1:
            iconName += 'ng';
            break;
          case 0:
            iconName += 'g';
            break;
          case 1:
            iconName += 'y';
            break;
          case 2:
            iconName += 'o';
            break;
          case 3:
            iconName += 'r';
            break;
          case 4:
            iconName += 'm';
            break;
          case 5:
            iconName += 'v';
            break;
        }
        return iconName;
      },

      //图标点击事件
      markerClick(attributes, point, fieldName) {
        // console.log(attributes)
        // console.log(point)
        // console.log(fieldName)
        const t = this;
        let m = new BMap.Marker(point, {
          offset: (attributes.hasOwnProperty('ptType')) && (attributes.ptType.toUpperCase() === 'LAYER_GS' ? (new BMap.Size(-39, 18)) : (new BMap.Size(-39, 38))) || (new BMap.Size(0, 0))
        });
        if (attributes.hasOwnProperty('ptType') && (attributes.ptType.toUpperCase() === 'LAYER_SP' || attributes.ptType.toUpperCase() === 'LAYER_SP_VOC' || attributes.ptType.toUpperCase() === 'LAYER_SP_SLW' || attributes.ptType.toUpperCase() === 'LAYER_SP_GKW')) {

          t.AssociatedVideo(attributes.CamIndexCode);//attributes.DevIndexCode

          // let res = t.setCameraWindow(attributes);
          // (this.searchInfoWindow = new BMapLib.SearchInfoWindow(t.map, res, {
          //   title: '<sapn style="font-size:16px"><b>' + (attributes['CamName'] || '') + ' - ' + (attributes['TypeName'] || '') + '</b>' + '</span>',             //标题
          //   width: 520,
          //   height: 424,
          //   enableAutoPan: true,
          //   enableSendToPhone: false,
          //   searchTypes: []
          // }));
          //视频关闭窗口
          //this.searchInfoWindow.addEventListener('close',function(){
          // console.log('关闭开关打开')
          // document.getElementById('v-frame').contentWindow.OnStopPreview();
          //});
          // this.searchInfoWindow.open(m);
        } else if (attributes.hasOwnProperty('ptType') && (attributes.ptType.toUpperCase() === 'LAYER_YJ')) {
          let res = t.setEmergencyWindow(attributes);
          let imgUrl = '/static/imgs/main/yj-' + attributes.whetherpeak + '-' + attributes.buttonstate + '.png';
          let tli = attributes.whetherpeak ? '采暖期错峰企业' : '应急企业';
          this.searchInfoWindow = new BMapLib.SearchInfoWindow(t.map, res, {
            title: '<div style="height:35px;position:absolute;top:-35px;left:235px ">' +
            '<div style="background-color: white;height:35px;width:70px;border-radius: 35px 35px 0 0;border:1px solid #ccc;border-bottom-color:transparent;text-align:center">' +
            '<img style="display: inline-block;" src="' + imgUrl + '" alt="">' +
            '</div>' +
            '</div>' +
            '<div style="font-size:16px;text-align:center;font-weight:bold">' + tli + '</div>',
            width: 520,
            height: 350,
            enableAutoPan: true,
            searchTypes: []
          });
          this.searchInfoWindow.open(m);
        } else if (attributes.hasOwnProperty('ptType') && (attributes.ptType.toUpperCase() === 'LAYER_YQD')) {
          let res = t.setStaticDustWindow(attributes);
          let displayFieldName = 'name';
          this.searchInfoWindow = new BMapLib.SearchInfoWindow(t.map, res || '无数据', {
            title: '<sapn style="font-size:16px" ><b title="' + (attributes[displayFieldName] || '') + '">' + (attributes[displayFieldName] || '') + '</b>' + '</span>',             //标题
            width: '720',
            height: 'auto',
            enableAutoPan: true,
            enableSendToPhone: false,
            searchTypes: []
          });
          this.searchInfoWindow.open(m);
        } else {
          let res = undefined;
          let charUrl = undefined;
          let pms = undefined;
          let displayName = undefined;
          let infoWidth = '410px';
          let ptType = attributes.ptType;
          let ckItem = this.dataSource.find(v => v.code === ptType.toUpperCase());
          switch (ptType.toUpperCase()) {
            case 'LAYER_CG':
            case 'LAYER_CGQ_LCS':
              //res = t.setCGInfoWindow(attributes);
              //let dtCGType = (attributes.hasOwnProperty('dataType') && attributes.dataType) || undefined;
              //charUrl = !dtCGType ? RequestHandle.getRequestUrl('SENSECHART') : RequestHandle.getRequestUrl('XHPOLLUTIONCHAR');
              charUrl = RequestHandle.getRequestUrl('MAINSIXCHART');
              pms = {stationid: attributes.stationid, pollute: fieldName, dataType: attributes.dataType || ''};
              displayName = 'stationname';
              break;
            case 'LAYER_CGQ_VOC':
              //res = t.setVOCInfoWindow(attributes);
              charUrl = RequestHandle.getRequestUrl('VOCCHART');
              pms = {stationid: attributes.stationId || attributes.id};
              displayName = 'pointName';
              break;
            case 'LAYER_GS':
              //res = t.setGSInfoWindow(attributes);
              charUrl = RequestHandle.getRequestUrl('GSCITYPOLLUTIONCHART');
              pms = {id: attributes.citygid, type: (fieldName === 'pm25' ? 'pm2.5' : fieldName), 'isLf': attributes.isLf, 'dataLevel': (attributes.dataLevel || null)};
              displayName = 'pointname';
              break;
            case 'LAYER_GD':
              //res = t.setGDInfoWindow(attributes);
              let dtGDType = (attributes.hasOwnProperty('dataType') && attributes.dataType) || undefined;
              charUrl = !dtGDType ? RequestHandle.getRequestUrl('DUSTCHART') : RequestHandle.getRequestUrl('XHDUSTCHAR');
              pms = {deviceid: attributes.deviceid || attributes.cityid, ptype: ckItem.fieldName, sourcetype: attributes.sourcetype};// === 'pm25' ? 'pm2.5' : fieldName};
              displayName = 'name';
              break;
            case 'LAYER_QY':
              displayName = 'psname';
              charUrl = RequestHandle.getRequestUrl('ENTERPRISECHAR');
              pms = {pscode: attributes.pscode, type: fieldName.replace('Status', '') || ckItem.fieldName};
              infoWidth = 588;
              break;
            case 'LAYER_CX':
              displayName = 'name';
              charUrl = RequestHandle.getRequestUrl('TOWNCHART');
              fieldName = ckItem.fieldName;
              pms = {StationId: attributes.deviceid || attributes.id, type: fieldName};
              break;
            case 'LAYER_QM':
              charUrl = RequestHandle.getRequestUrl('ALLREPORTCHAR');
              pms = {CaseCode: attributes.casecode};
              break;
          }
          (this.searchInfoWindow = new BMapLib.SearchInfoWindow(t.map, res || '无数据', {
            title: '<sapn style="font-size:16px" ><b title="' + (attributes[displayName] || '') + '">' + (attributes[displayName] || '') + '</b>' + '</span><span id="vocvideo" class="class-vidoes"  style="display:' + ((ptType.toUpperCase() === 'LAYER_CGQ_VOC') ? 'block' : 'none') + '">视频点击播放</span>',             //标题
            width: infoWidth,
            height: "auto",
            enableAutoPan: true,
            enableSendToPhone: false,
            searchTypes: []
          }));
          //其他关闭窗口

          this.searchInfoWindow.open(m);
          let requestPms = undefined;
          for (let key in pms) {
            if (!requestPms) {
              requestPms = key + '=' + pms[key];
            } else {
              requestPms += '&' + key + '=' + pms[key];
            }
          }
          let url = charUrl + '?' + (requestPms || '');
          // if (ptType.toUpperCase() === 'LAYER_QM') {
          //   let data = {
          //     tupian: [
          //       {
          //         attachment: "http://117.119.97.150:8061/servicePlatform/statics/files/jiandujiance/mobile/b7c76eb3/anjian_/15204127198680.jpg"
          //       }
          //     ],
          //     createtime: "2018-03-07 16:51:59",
          //     departmenttype: "市工商局",
          //     pollutiontype: "汽车黑烟",
          //     description: "河北计策装错",
          //     location: "河北省廊坊市广阳区新华路68号",
          //     username: "admin",
          //     status: "未处理"
          //   };
          //   let qmContent = t.setQMInfoWindow(data);
          //   t.searchInfoWindow.setContent(qmContent);
          // }

          RequestHandle.request({url: url, type: 'GET', pms: {}}, function (result) {
            let data = result.obj;
            if (data) {
              switch (ptType.toUpperCase()) {
                case 'LAYER_CG':
                case 'LAYER_CGQ_LCS':
                  let cgContent = t.setCGInfoWindow(data);
                  t.searchInfoWindow.setContent(cgContent);
                  t.setCGChart(attributes.stationid, data.hourdatas, fieldName);
                  break;
                case 'LAYER_GS':
                  let gsContent = t.setGSInfoWindow(data);
                  t.searchInfoWindow.setContent(gsContent);
                  t.setGSChart(data.citygid, data.hourdatas || [], fieldName.toUpperCase());//result.history
                  break;
                case 'LAYER_GD':
                  let gdContent = t.setGDInfoWindow(data[data.length - 1] || data);
                  t.searchInfoWindow.setContent(gdContent);
                  t.setGDChart(attributes.deviceid || attributes.cityid, data.valuelist || data[0].valuelist || [], fieldName);
                  break;
                case 'LAYER_CGQ_VOC':

                  let vocContent = t.setVOCInfoWindow(data);
                  t.searchInfoWindow.setContent(vocContent);
                  t.setVOCChart(attributes.stationId, data.hourdatas);
                  //
                  $('#vocvideo').click(function () {
                    //
                    if (data.videoCamIndexCode) {
                      t.AssociatedVideo((data.videoCamIndexCode));
                    }
                  });
                  break;
                case 'LAYER_QY':
                  t.getQyData(attributes.pscode, function (rsl) {
                    let qyContent = t.setQYInfoWindow(data, rsl);
                    t.searchInfoWindow.setContent(qyContent);
                    t.setQYLChart(attributes.pscode, result.history, fieldName);
                    $('#QyData').click(function () {
                      t.navChange1();
                    });
                    $('#QyInfo').click(function () {
                      t.navChange2();
                    })
                  });
                  break;
                case 'LAYER_CX':
                  let cxContent = t.setCXInfoWindow(data);
                  t.searchInfoWindow.setContent(cxContent);
                  t.setCXChart(attributes.deviceid || attributes.id, data.list, fieldName);
                  break;
                case 'LAYER_QM':
                  let qmContent = t.setQMInfoWindow(data);
                  t.searchInfoWindow.setContent(qmContent);
                  break;
              }
            }
          }, function (ex) {
            console.error(ex);
          });
        }
      },

      //国省控点
      setGSInfoWindow(data) {
        let aqi = data.aqi;
        let time = data.time;
        let gridName = (data.firstGridName || '') + '-' + (data.secodGridName || '') + '-' + (data.threeGridName || '');
        let tel = data.Contact || data.contact || '';
        let memberName = data.memberName || '';
        /*return '<table width=\'100%\'><tr><td style=\'font-size:12px\' valign=\'top\'>'
         + '<table width=\'100%\' class=\'fitem\'>'
         + '</td></tr><tr><th>类型</th><td style=\'width:70px;text-align:center;\'>' + data.type
         + '</td></tr></tr><th>AQI</th><td style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getAQILevelIndex(aqi)) + ';color:#fff\'>' + aqi
         + '</td><th>综指</th><td  style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getComplexIndex(data.complexindex)) + ';color:#fff\'>' + parseFloat(data.complexindex).toFixed(3)
         + '</td></tr><tr><th>PM2.5</th><td style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getPM25LevelIndex(data.pm25)) + ';color:#fff\'>' + parseInt(data.pm25)
         + '</td><th>PM10</th><td style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getPM10LevelIndex(data.pm10)) + ';color:#fff\'>' + parseInt(data.pm10)
         + '</td><th>CO</th><td style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getCOLevelIndex(data.co)) + ';color:#fff\'>' + parseFloat(data.co).toFixed(1)
         + '</td></tr><tr><th>NO2</th><td style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getNO2LevelIndex(data.no2)) + ';color:#fff\'>' + parseInt(data.no2)
         + '</td><th>SO2</th><td style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getSO2LevelIndex(data.so2)) + ';color:#fff\'>' + parseInt(data.so2)
         + '</td><th>O3</th><td style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getO3LevelIndex(data.o3)) + ';color:#fff\'>' + parseInt(data.o3)
         + '</td></tr><tr><th>温度</th><td style=\'width:70px;text-align:center;\'>' + parseInt(data.temp) + '℃'
         + '</td><th>湿度</th><td style=\'width:70px;text-align:center;\'>' + parseInt(data.humi) + '%'
         + '</td></tr><tr><th>风向</th><td style=\'width:70px;text-align:center;\'>' + data.winddirection
         + '</td><th>风级</th><td style=\'width:70px;text-align:center;\'>' + (parseInt(data.windspeed) || 0) + '级'
         + '</td></tr><tr><th>时间</th><td colspan=\'5\' style=\'text-align:left;padding-left:7px;\'>' + data.time.replace(/T/g, ' ') + '</td></tr></table>'
         + '</td>'
         + '<td valign=\'top\' align=\'right\'><td>'
         + '</tr></table><div id=\'citychart_' + data.citygid + '\' style=\'width:100%;height:110px\'></div>';*/

        return '  <div class="param"><div class="line"></div>\n' +
          '        <div class="item one">\n' +
          '            <div class="above">\n' +
          '            <div class="square"></div>\n' +
          '            <span class="type">' + data.type + '</span>\n' +
          '            </div>\n' +
          '            <div class="date">' + time.replace('T', ' ') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item second">\n' +
          '            <div class="key" style=\'color:' + (getAQILevelIndex(aqi) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getAQILevelIndex(aqi)) + '\'> AQI</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(aqi) ? aqi : '--') + '</div>\n' +
          '        </div>' +
          '<div class="item third">' +
          '<div class="key" style=\'color:' + (getComplexIndex(data.complexindex) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getComplexIndex(data.complexindex)) + '\'>综指</div>' +
          '<div class="value">' + (this.hasNullOrUndefined(data.complexindex) ? parseFloat(data.complexindex).toFixed(3) : '--') + '</div></div><br>\n' +
          '        <div class="item secondLine secondLine1">\n' +
          '            <div class="key" style=\'color:' + (getPM25LevelIndex(data.pm25) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getPM25LevelIndex(data.pm25)) + '\'>PM2.5</div>\n' +
          '            <div class="value"> ' + (this.hasNullOrUndefined(data.pm25) ? parseInt(data.pm25) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine secondLine1">\n' +
          '            <div class="key" style=\'color:' + (getPM10LevelIndex(data.pm10) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getPM10LevelIndex(data.pm10)) + '\'>PM10</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.pm10) ? parseInt(data.pm10) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine">\n' +
          '            <div class="key" style=\'color:' + (getCOLevelIndex(data.co) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getCOLevelIndex(data.co)) + '\'>CO</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.co) ? parseFloat(data.co).toFixed(1) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine ">\n' +
          '            <div class="key" style=\'color:' + (getNO2LevelIndex(data.no2) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getNO2LevelIndex(data.no2)) + '\'>NO2</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.no2) ? parseInt(data.no2) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine ">\n' +
          '            <div class="key" style=\'color:' + (getSO2LevelIndex(data.so2) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getSO2LevelIndex(data.so2)) + '\'>SO2</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.so2) ? parseInt(data.so2) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine">\n' +
          '            <div class="key" style=\'color:' + (getO3LevelIndex(data.o3) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getO3LevelIndex(data.o3)) + '\'>O3</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.o3) ? parseInt(data.o3) : '--') + '</div>\n' +
          '        </div>\n' +
          '    </div><div class="index">' +
          '<div class="item">温度：' + (this.hasNullOrUndefined(data.temp) ? (parseInt(data.temp) + '℃') : '--') + '</div>' +
          '<div class="item">湿度：' + (this.hasNullOrUndefined(data.humi) ? (parseInt(data.humi) + '%') : '--') + '</div>' +
          '<div class="item">风向：' + (data.winddirection || '--') + '</div>' +
          '<div class="item">风级：' + (parseInt(data.windspeed) || 0) + '级' + '</div></div>' +

          '<div class="chart"><div id=\'citychart_' + data.citygid + '\' style=\'width:100%;height:110px\'></div></div>' +
          '<div class="Introduce"><div class="Net">所属网格：' + gridName + '</div><div class="Person">网格员代表：' + memberName + '</div><div>联系方式：' + tel + '</div></div>'

      },

      //国省图表
      setGSChart(code, data, fieldName) {
        let rtValue = [];
        for (let i = 0, length = data.length; i < length; i++) {
          let item = data[i];
          let value = item.value;
          let obj = {
            x: converTimeFormat(item.time.replace('T', ' ')).getTime(),
            y: (fieldName === 'CO' || fieldName === 'COMPLEXINDEX') ? parseFloat(value) : parseInt(value),
            //color: getColorByIndex(getAQILevelIndex(parseInt(value)))
            color:getColorByIndex(this.getPollutionState(value,fieldName))
          };
          rtValue.push(obj);
        }
        let targetFieldName = this.getTargetFieldName(fieldName);
        let title = '最近24小时' + targetFieldName + '变化趋势';
        this.loadChar(code, targetFieldName, rtValue, title);
      },

      //VOC监控
      setVOCInfoWindow(data) {
        //渲染颜色
        if (!data.videoCamIndexCode) {
          // console.log(data.videoCamIndexCode)
          // console.log('这里走过来了')
          $('#vocvideo').css('background', '#ccc');
        }
        let gridName = (data.firstGridName || '') + '-' + (data.secodGridName || '') + '-' + (data.threeGridName || '');
        let tel = data.Contact || data.contact || '';
        let memberName = data.memberName || '';
        return '<div class="param">\n' +
          '    <div class="line"></div>\n' +
          '    <div class="item vocItem one">\n' +
          '        <div class="triangle"></div>\n' +
          '        <div class="type">TVOC监测</div>\n' +
          '        <div class="date">' + (data.collectTime || data.recordTime.replace('T', ' ')) + '</div>\n' +
          '    </div>\n' +
          '    <div class="item vocItem">\n' +
          '        <div class="key" style=\'color:' + (data.tVOC_V > 300 ? '#fff' : '#000') + ';background-color:' + getVOCLeveColor(data.tVOC_V) + '\'>TVOC</div>\n' +
          '        <div class="value">' + (this.hasNullOrUndefined(data.tVOC_V) ? data.tVOC_V : '--') + '</div>\n' +
          '    </div>\n' +
          '</div><div class="chart"><div id=\'citychart_' + data.stationId + '\' style=\'width:100%;height:110px\'></div></div>' +
          '<div class="Introduce"><div class="Net">所属网格：' + gridName + '</div><div class="Person">网格员代表：' + memberName + '</div><div>联系方式：' + tel + '</div></div>'
      },

      //六参数
      setCGInfoWindow(data) {
        let gridName = (data.firstGridName || '') + '-' + (data.secodGridName || '') + '-' + (data.threeGridName || '');
        let tel = data.Contact || data.contact || '';
        let memberName = data.memberName || '';
        return '<div class="param"><div class="line"></div>\n' +
          '        <div class="item one">\n' +
          '            <div class="above">\n' +
          '            <div class="circle"></div>\n' +
          '            <span class="type">六参数监测</span>\n' +
          '            </div>\n' +
          '            <div class="date">' + data.collectTime.replace('T', ' ') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item">\n' +
          '            <div class="key keyAqi" style=\'color:' + (getAQILevelIndex(data.aqi) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getAQILevelIndex(data.aqi)) + '\'>AQI</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.aqi) ? data.aqi : '--') + '</div>\n' +
          '        </div><br>\n' +
          '        <div class="item secondLine secondLine1">\n' +
          '            <div class="key" style=\'color:' + (getPM25LevelIndex(data.pm25) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getPM25LevelIndex(data.pm25)) + '\'>PM2.5</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.pm25) ? parseInt(data.pm25) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine secondLine1">\n' +
          '            <div class="key"  style=\'color:' + (getPM10LevelIndex(data.pm10) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getPM10LevelIndex(data.pm10)) + '\'>PM10</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.pm10) ? parseInt(data.pm10) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine">\n' +
          '            <div class="key" style=\'color:' + (getCOLevelIndex(data.co) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getCOLevelIndex(data.co)) + '\'>CO</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.co) ? parseFloat(data.co).toFixed(1) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine">\n' +
          '            <div class="key" style=\'color:' + (getNO2LevelIndex(data.no2) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getNO2LevelIndex(data.no2)) + '\'>NO2</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.no2) ? parseInt(data.no2) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine">\n' +
          '            <div class="key" style=\'color:' + (getSO2LevelIndex(data.so2) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getSO2LevelIndex(data.so2)) + '\'>SO2</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.so2) ? parseInt(data.so2) : '--') + '</div>\n' +
          '        </div>\n' +
          '        <div class="item secondLine">\n' +
          '            <div class="key" style=\'color:' + (getO3LevelIndex(data.o3) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getO3LevelIndex(data.o3)) + '\'>O3</div>\n' +
          '            <div class="value">' + (this.hasNullOrUndefined(data.o3) ? parseInt(data.o3) : '--') + '</div>\n' +
          '        </div>\n' +

          '    </div><div class="chart"><div id=\'citychart_' + data.stationid + '\' style=\'width:100%;height:110px\'></div></div>' +
          '<div class="Introduce"><div class="Net">所属网格：' + gridName + '</div><div class="Person">网格员代表：' + memberName + '</div><div>联系方式：' + tel + '</div></div>'

      },

      //传感器图表
      setCGChart(code, data, fieldName) {
        let rtValue = [];
        for (let i = 0, length = data.length; i < length; i++) {
          let item = data[i];
          let obj = {
            x: converTimeFormat(item.time.replace('T', ' ')).getTime(),
            y: parseInt(item.value),
            color: getColorByIndex(getAQILevelIndex(parseInt(item.value)))
          };
          rtValue.push(obj);
        }
        let targetFieldName = this.getTargetFieldName(fieldName);
        let title = '最近24小时' + targetFieldName + '变化趋势';
        this.loadChar(code, targetFieldName, rtValue, title);
      },

      //VOC图表
      setVOCChart(code, data) {
        let rtValue = [];
        for (let i = 0, length = data.length; i < length; i++) {
          let item = data[i];
          let obj = {
            x: converTimeFormat(item.time).getTime(),
            y: parseInt(item.value),
            color: getVOCLeveColor(item.value)
          };
          //console.log(obj.x)
          rtValue.push(obj);
        }
        let title = '最近24小时TVOC变化趋势';
        this.loadChar(code, 'VOC', rtValue, title);
      },

      //工地信息
      setGDInfoWindow(data) {
        /* return '<table width=\'100%\' class="fitem"><tr><th>PM2.5</th><td style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getPM25LevelIndex(data.pm25)) + ';color:#fff\'>' + (data.pm25 ? parseInt(data.pm25) : '--')
         + '</td><th>PM10</th><td style=\'width:70px;text-align:center;background-color:' + getColorByIndex(getPM10LevelIndex(data.pm10)) + ';color:#fff\'>' + (data.pm10 ? parseInt(data.pm10) : '--')
         + '</td></tr><tr><th>温度</th><td style=\'width:70px;text-align:center;\'>' + (data.temp ? (parseInt(data.temp) + '℃') : '--')
         + '</td><th>湿度</th><td style=\'width:70px;text-align:center;\'>' + (data.humi ? (parseInt(data.humi) + '%') : '--')
         + '</td></tr><tr><th>风向</th><td style=\'width:70px;text-align:center;\'>' + (data.wdirection || '--')
         + '</td><th>风级</th><td style=\'width:70px;text-align:center;\'>' + parseInt(data.windlevel || 0) + '级'
         + '</td></tr><tr><th>时间</th><td colspan=\'5\' style=\'text-align:left;padding-left:7px;\'>' + (data.time && (data.time.replace(/T/g, ' ')) || '') + '</td></tr></table>'
         + '</td>'
         + '<td valign=\'top\' align=\'right\'><td>'
         + '</tr></table><div id=\'citychart_' + data.deviceid + '\' style=\'width:100%;height:110px\'>';*/

        let gridName = (data.firstGridName || '') + '-' + (data.secodGridName || '') + '-' + (data.threeGridName || '');
        let tel = data.Contact || data.contact || '';
        let memberName = data.memberName || '';
        return '<div class="param gongDi">\n' +
          '    <div class="line"></div>\n' +
          '    <div class="item one">\n' +
          '        <img src="../static/imgs/main/gd-g.png" />\n' +
          '        <div class="type">工地扬尘监测</div>\n' +
          '        <div class="date">' + (data.time && (data.time.replace(/T/g, ' ')) || '') + '</div>\n' +
          '    </div>\n' +
          '    <div class="item second">\n' +
          '        <div class="key" style=\'color:' + (data.pm25 > 115 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getPM25LevelIndex(data.pm25)) + '\'>PM2.5</div>\n' +
          '        <div class="value">' + (this.hasNullOrUndefined(data.pm25) ? parseInt(data.pm25) : '--') + '</div>\n' +
          '    </div>' +
          '<div class="item third">' +
          '<div class="key" style=\'color:' + (data.pm10 > 250 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getPM10LevelIndex(data.pm10)) + '\'>PM10</div>' +
          '<div class="value">' + (this.hasNullOrUndefined(data.pm10) ? parseInt(data.pm10) : '--') + '</div>' +
          '</div>\n' +
          '</div><div class="chart"><div id=\'citychart_' + data.deviceid + '\' style=\'width:100%;color:#666666;font-weight:bold;height:110px\'></div></div>' +
          '<div class="Introduce"><div class="Net">所属网格：' + gridName + '</div><div class="Person">网格员代表：' + memberName + '</div><div>联系方式：' + tel + '</div></div>'

      },

      //工地
      setGDChart(code, data, fieldName) {
        let rtValue = [];
        for (let i = 0, length = data.length; i < length; i++) {
          let item = data[i];
          let value = (item.hasOwnProperty('value') ? item.value : item.values) || 0;
          let obj = {
            x: converTimeFormat(item.time && item.time.replace('T', ' ')).getTime(),
            y: parseInt(value),
            color: getColorByIndex(getPM25LevelIndex(parseInt(value)))
          };
          rtValue.push(obj);
        }
        let targetFieldName = this.getTargetFieldName(fieldName);
        let title = '最近24小时' + targetFieldName + '变化趋势';
        this.loadChar(code, targetFieldName, rtValue, title);
      },

      //企业InfoWindow
      setQYInfoWindow(data, data1) {
        let dts = data || [];
        let gridAttr = dts[dts.length - 1] || {};
        let gridName = (gridAttr.firstGridName || '') + '-' + (gridAttr.secodGridName || '') + '-' + (gridAttr.threeGridName || '');
        let tel = gridAttr.Contact || gridAttr.contact || '';
        let memberName = gridAttr.memberName || '';
        let headerElements = '<tr class="qyTable"><td rowspan="2" style="width:138px;height:44px">名称</td><td colspan="2" style="width:86px">氮氧化物</td><td colspan="2" style="width:86px">二氧化硫</td><td colspan="2" style="width:86px">烟尘</td><td rowspan="2" style="width:86px">含氧量</td><td rowspan="2" style="width:78px">总排放量</td></tr><tr class="qyTable"><td>实测</td><td>折算</td><td>实测</td><td>折算</td><td>实测</td><td>折算</td></tr>';
        let els = '';
        for (let i = 0, length = dts.length; i < length; i++) {
          let item = dts[i];
          els += '<tr style="height:22px" class="qyNumber"><td class="qyTable">' + item.outputname + '</td><td>' +
            (this.hasNullOrUndefined(item.nox) ? item.nox : '--') + '</td><td style="color:' + (item.noxStatus ? '#ff0000' : '') + '">' +
            (this.hasNullOrUndefined(item.nox_convert) ? item.nox_convert : '--') + '</td><td>' +
            (this.hasNullOrUndefined(item.so2) ? item.so2 : '--') + '</td><td style="color:' + (item.so2Status ? '#ff0000' : '') + '">' +
            (this.hasNullOrUndefined(item.so2_convert) ? item.so2_convert : '--') + '</td><td>' +
            (this.hasNullOrUndefined(item.smoke) ? item.smoke : '--') + '</td><td style="color:' + (item.smokeStatus ? '#ff0000' : '') + '">' +
            (this.hasNullOrUndefined(item.smoke_convert) ? item.smoke_convert : '--') + '</td><td>' + (item.o2 !== 'null' ? item.o2 : '--') + '</td><td>' +
            (this.hasNullOrUndefined(item.gasoutputflow) ? item.gasoutputflow : '--') + '</td></tr>';
          if (i === (dts.length - 1)) {
            els += '<tr class="qyNumber" style="height:22px"><td  class="qyTable">排放限值(mg/m3)</td><td colspan="2">' + (item.NoxLimit || ' --') + '</td><td colspan="2">' + (item.So2Limit || ' --') + '</td><td colspan="2">' + (item.SmokeLimit || ' --') + '</td><td></td><td>--</td></tr>'
          }
        }
        /* els += '<tr><td>时间</td><td colspan="7">' + ((data.length ? data[0].time : '--') || '--') + '</td></tr>';*/
        return '<div class="qyLine"><div class="line"></div><div class="NavBox"><span id="QyData" class="selected">监测数据</span><span id="QyInfo">企业详情</span></div><div class="line"></div></div></div><div id="QyData-one"><div class="qyPollution"><img class="qyImg" src="../static/imgs/main/qy-g.png" alt=""><div class="type">企业污染源监测</div><div class="date">' + data[0].time + '</div></div><table style="min-width:95%;height: auto;" class="fitem" cellpadding="0" cellspacing="0">' + headerElements + els + '</table><div class="chart"><div id=\'citychart_' + (data.length && data[0].pscode) + '\' style=\'width:100%;height:210px;\'></div></div>' +
          '<div class="Introduce"><div class="Net">所属网格：' + gridName + '</div><div class="Person">网格员代表：' + memberName + '</div><div>联系方式：' + tel + '</div></div></div>' +
          '<div class="qyLine none" id="QyInfo-one"><table><tr><td class="first">污染源名称</td><td class="" colspan="4">' + data1.psname + '</td></tr><tr><td class="first">法人代码</td><td>' + data1.floorSpace + '</td><td class="first">法定代表人</td><td>' + data1.legalPerson + '</td></tr><tr><td class="first">污染源地址</td><td class="" colspan="4">' + data1.pollutionAddress + '</td></tr><tr><td class="first">行政区域</td><td>' + data1.region + '</td><td class="first">污染源规模</td><td>' + data1.pollutionScale + '</td></tr><tr><td class="first">行政类别</td><td>' + data1.industryType + '</td><td class="first">污染源类别</td><td>' + data1.pollutionType + '</td></tr><tr><td class="first">单位类型</td><td>' + data1.companyType + '</td><td class="first">投产日期</td><td>' + data1.commissioningDate.replace("T", " ") + '</td></tr><tr><td class="first">占地面积(m²)</td><td>' + data1.floorSpace + '</td><td class="first">地区名称</td><td>' + data1.areaName + '</td></tr><tr><td class="first">是否30千瓦电力企业</td><td>' + data1.is30Company + '</td><td class="first">启用状态</td><td>' + data1.enabled + '</td></tr><tr><td class="first">关注程度</td><td>' + data1.concernExtent + '</td><td class="first">运行状态</td><td>' + data1.runningStatus + '</td></tr><tr><td class="first">流域</td><td>' + data1.drainageBasin + '</td><td class="first">在线状态</td><td>' + data1.isOnLine + '</td></tr><tr><td class="first">通讯地址</td><td>' + data1.contactAddress + '</td><td class="first">通讯地址</td><td>' + data1.contactAddress + '</td></tr><tr><td class="first">联系人</td><td>' + data1.contactPerson + '</td><td class="first">移动电话</td><td>' + data1.mobilePhone + '</td></tr><tr><td class="first">办公电话</td><td>' + data1.officePhone + '</td><td class="first">污染源网址</td><td>' + data1.pollutionUrl + '</td></tr><tr><td class="first">中心经度</td><td>' + data1.contactPerson + '</td><td class="first">中心纬度</td><td>' + data1.contactPerson + '</td></tr><tr><td class="first">污染源环保部门</td><td class="" colspan="4">' + data1.pollutionOffice + '</td></tr><tr><td class="first">专职环保人员数</td><td>' + data1.pollutionPersonCount + '</td><td class="first">环保负责人</td><td>' + data1.pollutionPerson + '</td></tr><tr style="border-bottom:1px solid #ddd;"><td class="first">备注</td><td class="" colspan="4" >' + data1.remarks + '</td></tr></table></div>';
      },
      navChange1() {
        $('#QyData').addClass('selected');
        $('#QyInfo').removeClass('selected');
        $('#QyInfo-one').addClass('none');
        $('#QyData-one').removeClass('none');
      },
      navChange2() {
        $('#QyInfo').addClass('selected');
        $('#QyData').removeClass('selected');
        $('#QyData-one').addClass('none');
        $('#QyInfo-one').removeClass('none');
      },
      getQyData(pscode, callback) {
        let t = this;
       	let url = RequestHandle.getRequestUrl('COMPONYINFO')+pscode;
//      let url = 'http://gkpt.zq12369.com:8016/api/Company/GetCompanyInfo?pscode=' + pscode;
        RequestHandle.request({url: url, type: 'GET', pms:{}}, function (result) {
          callback(result.obj);
        }, function (ex) {
          console.error(ex);
        })
      },
      //企业24小时
      setQYChart(code, data, fieldName) {
        let rtValue = [];
        for (let i = 0, length = data.length; i < length; i++) {
          let item = data[i];
          let value = item['value'] || 0;
          let obj = {
            x: converTimeFormat(item.time && item.time.replace('T', ' ')).getTime(),
            y: parseInt(value),
            color: item['status'] ? '#ff0000' : '#00ff00'//getColorByIndex(getPM25LevelIndex(parseInt(value)))
          };
          rtValue.push(obj);
        }
        let title = '最近24小时烟尘变化趋势';
        this.loadChar(code, '烟尘', rtValue, title);
      },

      //设置企业24小时排放口图表
      setQYLChart(code, data, fieldName) {
        let xAxis = [];
        let yAxis = [];
        if (data.length) {
          for (let i = 0, length = data.length; i < length; i++) {
            let item = data[i];
            i === 0 && item.forEach(v => (xAxis.push(converTimeFormat(v.time && v.time.replace('T', ' ')).getTime())));
            yAxis.push({
              name: item[0].name,
              data: item.map((v, index) => ([xAxis[index], v.value !== '-' ? (parseFloat(v.value) || 0.0) : null]))
            });
          }
        }
        let nm = (fieldName === 'noxStatus' ? 'NOX' : (fieldName === 'smokeStatus' ? '烟尘' : (fieldName === 'so2Status' ? 'SO2' : 'NOX')));
        let title = '最近24小时' + nm + '变化趋势';
        //yAxis = [{"name":"排气口",data:[[1523811600000,14.5],[1523815200000,12.27],[1523818800000,12.92],[1523822400000,13.78],[1523826000000,12.44],[1523829600000,13.34],[1523833200000,12.41],[1523836800000,12.27],[1523840400000,12.07],[1523844000000,13.28]]},{"name":"75T排气口",data:[[1523811600000,30],[1523815200000,30],[1523818800000,30],[1523822400000,30],[1523826000000,30],[1523829600000,30],[1523833200000,30],[1523836800000,30],[1523840400000,30],[1523844000000,30]]}];//测试数据
        this.loadLineChar(code, nm, yAxis, title);
      },

      //城乡监测站弹出框
      setCXInfoWindow(data) {
        let gridName = (data.firstGridName || '') + '-' + (data.secodGridName || '') + '-' + (data.threeGridName || '');
        let tel = data.Contact || data.contact || '';
        let memberName = data.memberName || '';
        return '<div class="param gongDi">\n' +
          '    <div class="line"></div>\n' +
          '    <div class="item one">\n' +
          '        <img src="../static/imgs/main/gd-g.png" />\n' +
          '        <div class="type">乡镇空气站监测</div>\n' +
          '        <div class="date">' + (data.time && (data.time.replace(/T/g, ' ')) || '') + '</div>\n' +
          '    </div>\n' +
          '    <div class="item second">\n' +
          '        <div class="key" style=\'color:' + (getPM25LevelIndex(data.pm25) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getPM25LevelIndex(data.pm25)) + '\'>PM2.5</div>\n' +
          '        <div class="value">' + (this.hasNullOrUndefined(data.pm25) ? parseInt(data.pm25) : '--') + '</div>\n' +
          '    </div>' +
          '<div class="item third">' +
          '<div class="key" style=\'color:' + (getSO2LevelIndex(data.so2) > 3 ? '#fff' : '#000') + ';background-color:' + getColorByIndex(getSO2LevelIndex(data.so2)) + '\'>SO2</div>' +
          '<div class="value">' + (this.hasNullOrUndefined(data.so2) ? parseInt(data.so2) : '--') + '</div>' +
          '</div>\n' +
          '</div><div class="chart"><div id=\'citychart_' + data.deviceid + '\' style=\'width:100%;color:#666666;font-weight:bold;height:110px\'></div></div>' +
          '<div class="Introduce"><div class="Net">所属网格：' + gridName + '</div><div class="Person">网格员代表：' + memberName + '</div><div>联系方式：' + tel + '</div></div>'
      },

      //城乡监测站图表
      setCXChart(code, data, fieldName = 'PM2.5') {
        let rtValue = [];
        for (let i = 0, length = data.length; i < length; i++) {
          let item = data[i];
          let value = (item.hasOwnProperty('value') ? item.value : item.values) || 0;
          let obj = {
            x: converTimeFormat(item.time && item.time.replace('T', ' ')).getTime(),
            y: parseInt(value),
            color: getColorByIndex(getPM25LevelIndex(parseInt(value)))
          };
          rtValue.push(obj);
        }
        let targetFieldName = this.getTargetFieldName(fieldName);
        let title = '最近24小时' + targetFieldName + '变化趋势';
        this.loadChar(code, targetFieldName, rtValue, title);
      },

      //设置全民举报弹出框
      setQMInfoWindow(data) {
        const fls = [{
          fieldName: 'pollutiontype',
          aliasName: '污染类型'
        }, {
          fieldName: 'username',
          aliasName: '提交人'
        }, {
          fieldName: 'departmenttype',
          aliasName: '责任主体'
        }, {
          fieldName: 'description',
          aliasName: '描述'
        }, {
          fieldName: 'location',
          aliasName: '位置'
        }, {
          fieldName: 'createtime',
          aliasName: '案发时间'
        }, {
          fieldName: 'status',
          aliasName: '处理状态'
        },];
        let atrElement = '';
        let imgElement = '';
        let ims = data.tupian || [];
        fls.forEach(v => (atrElement += `<div class="item"><div class="key">${v.aliasName}</div><div class="value">${data[v.fieldName]}</div></div>`));
        ims.forEach(v => (imgElement += `<div class="item" style='background-image:url(${v.attachment})' />`));
        return `<div class="qm-panel"><div></div><div>${atrElement}</div><div></div><div class="img-panel">${imgElement}</div></div>`;
      },

      //加载Chart数据
      loadChar(container, name, data, title) {
        let dateTypeFormat = '%Y-%m-%d %H:%M';
        let markerShowFlag = false;
        let chart = new Highcharts.Chart('citychart_' + container, {
          chart: {
            type: 'column',
            zoomType: 'x',
            spacingLeft: 0,
            spacingRight: 0
          },
          title: {
            text: title,
            style: {
              fontSize: '12px'
            }
          },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              millisecond: '%H:%M:%S.%L',
              second: '%H:%M:%S',
              minute: '%H:%M',
              hour: '%H:%M',
              day: '%m-%d',
              week: '%m-%d',
              month: '%Y-%m',
              year: '%Y'
            }
          },
          yAxis: {
            title: {
              text: ''
            },
            min: 0
          },
          tooltip: {
            enabled: true,
            formatter: function () {
              let tip = '' + Highcharts.dateFormat(dateTypeFormat, this.x) + '<br/>' +
                this.series.name + ': <b>' + this.y + '</b>';//+ unit;
              return tip;
            }
          },
          plotOptions: {
            series: {
              marker: {
                enabled: markerShowFlag,
                radius: 5
              },
              enableMouseTracking: true,
              turboThreshold: 0
            }
          },
          legend: {
            enabled: false
          },
          credits: {
            enabled: false
          },
          series: [{
            name: name,
            data: data
          }]
        });
        Highcharts.setOptions({global: {useUTC: false}});
      },

      //加载Line数据
      loadLineChar(container, name, data, title) {
        let chart = new Highcharts.Chart('citychart_' + container, {
          chart: {
            type: 'spline'
          },
          title: {
            text: title
          },
          xAxis: {
            type: 'datetime',
            title: {text: ''},
            dateTimeLabelFormats: {
              millisecond: '%H:%M:%S.%L',
              second: '%H:%M:%S',
              minute: '%H:%M',
              hour: '%H:%M',
              day: '%m-%d',
              week: '%m-%d',
              month: '%Y-%m',
              year: '%Y'
            }
          },
          yAxis: {
            min: 0,
            title: {text: ''},
            connectNulls: true
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.y:.2f}'
          },
          plotOptions: {
            spline: {
              marker: {
                enabled: false
              }
            }
          },
          series: data
        });
        Highcharts.setOptions({global: {useUTC: false}});
      },

      //设置摄像头IFrame
      setCameraWindow(data) {
        return '<iframe id="v-frame" style="height:100%;width:100%;border:none;" src="/static/video/video.html?camIndexCode=' + data['CamIndexCode'] + '&devIndexCode=' + data['DevIndexCode'] + '&area=' + data['Area'] + '&type=' + data['Type'] + '&name=' + data['CamName'] + '&panyname=' + data['CompanyName'] + '"></iframe>';
      },

      //设置应急清单Iframe
      setEmergencyWindow(data) {
        let url = 'static/emergency/emergency.html?id=' + (data['id'] || data['pscode'] || '');
        return url ? '<iframe style="height:340px;width:100%;border:none;"  src="' + url + '"></iframe>' : undefined;
      },

      //设置(大气排放)静态源清单Iframe
      setStaticDustWindow(data) {
        let url = undefined;
        if (data.hasOwnProperty('id') || data.hasOwnProperty('classId')) {
          let polcode = data['id'];//data.po || data.polsorcode;
          let tp = data['classId'];//data['tp'] || data['sourcecode'] || data['sourceTypeCode'];
          let ptType = this.getStaticDustType(tp);//this.getPointType('PS001');//
          switch (ptType) {
            // case 0:
            //   url = 'static/alert/carRepair.html' + '?polcode=' + (polcode || '') + '&tp=' + (tp || '');//汽修站
            //   break;
            // case 1:
            //   url = 'static/alert/dryClean.html' + '?polcode=' + (polcode || '') + '&tp=' + (tp || '');//干洗店
            //   break;
            // case 2:
            //   url = 'static/alert/Dust.html' + '?polcode=' + (polcode || '') + '&tp=' + (tp || '');//施工扬尘
            //   break;
            // case 3:
            //   url = 'static/alert/enterprise.html' + '?polcode=' + (polcode || '') + '&tp=' + (tp || '');//企业
            //   break;
            // case 4:
            //   url = 'static/alert/gasStation.html' + '?polcode=' + (polcode || '') + '&tp=' + (tp || '');//加油站
            //   break;
            // case 5:
            //   url = 'static/alert/three.html' + '?polcode=' + (polcode || '') + '&tp=' + (tp || '');//移动源
            //   break;
            // case 6:
            //   url = 'static/alert/Restaurant.html' + '?polcode=' + (polcode || '') + '&tp=' + (tp || '');//餐饮油烟
            //   break;
            //////新数据
            case 'dlhy'://电力行业
              url = 'static/Popups/PowerIndustry.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//汽修站
              break;
            case 'gygl'://工业锅炉
              url = 'static/Popups/industrialBoiler.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//干洗店
              break;
            case 'gthy'://钢铁行业
              url = 'static/Popups/steelIndustry.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//企业
              break;
            case 'blhy'://玻璃行业
              url = 'static/Popups/GlassIndustry.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//加油站
              break;
            case 'hghq'://化工化纤
              url = 'static/Popups/ChemicalChemicalFiber.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//移动源
              break;
            case 'snhy'://水泥行业
              url = 'static/Popups/CementIndustry.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//餐饮油烟
              break;
            case 'qtgy'://其他工业
              url = 'static/Popups/OtherEnterprises.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//汽修站
              break;
            case 'gypt'://工业喷涂
              url = 'static/Popups/IndustrialSpraying.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//干洗店
              break;
            case 'xmyz'://畜牧养殖
              url = 'static/Popups/AnimalHusbandry.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//施工扬尘
              break;
            case 'dcyc'://堆场扬尘
              url = 'static/Popups/StackingDust.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//企业
              break;
            case 'sgyc'://施工扬尘
              url = 'static/Popups/ConstructionDust.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//加油站
              break;
            case 'jyz'://加油站
              url = 'static/Popups/GasStation.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//移动源
              break;
            case 'swzrl'://生物质燃料
              url = 'static/Popups/biomassBoiler.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//餐饮油烟
              break;
            case 'fscl'://废水处理
              url = 'static/Popups/WasteWaterTreatment.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//企业
              break;
            case 'gfcl'://固废处理
              url = 'static/Popups/SolidWasteManagement.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//加油站
              break;
            case 'yqtx'://烟气脱硝
              url = 'static/Popups/FlueGasDenitrification.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//移动源
              break;
            case 'cyyy'://餐饮油烟
              url = 'static/Popups/FoodFume.html' + '?id=' + (polcode || '') + '&tp=' + (tp || '');//餐饮油烟
              break;
            /////
          }
        }
        return url ? '<iframe style="height:400px;width:100%;border:none;" src="' + url + '"></iframe>' : undefined;
      },

      //获取静态源清单类型
      getStaticDustType(type) {
        let rtValue = -1;
        switch (type.toUpperCase()) {
          ////旧版本数据
          // case 'PS003':
          //   rtValue = 0;
          //   break;
          // case 'PS002':
          //   rtValue = 1;
          //   break;
          // case 'PS004':
          //   rtValue = 2;
          //   break;
          // case 'PS001':
          //   rtValue = 3;
          //   break;
          // case 'PS006':
          //   rtValue = 4;
          //   break;
          // case 'PS007':
          //   rtValue = 5;
          //   break;
          // case 'PS005':
          //   rtValue = 6;
          //   break;
          ////新版本数
          case '0101':
            //电力行业
            rtValue = 'dlhy';
            break;
          case '0102':
            //工业锅炉
            rtValue = 'gygl';
            break;
          case '0201':
            //钢铁行业
            rtValue = 'gthy';
            break;
          case '0202':
            //玻璃行业
            rtValue = 'blhy';
            break;
          case '0203':
            //化工化纤
            rtValue = 'hghq';
            break;
          case '0204':
            //水泥行业
            rtValue = 'snhy';
            break;
          case '0205':
            //其他工业企业
            rtValue = 'qtgy';
            break;
          case '0301':
            //工业喷涂
            rtValue = 'gypt';
            break;
          case '0401':
            //畜牧养殖
            rtValue = 'xmyz';
            break;
          case '0501':
            //堆场扬尘
            rtValue = 'dcyc';
            break;
          case '0502':
            //施工扬尘
            rtValue = 'sgyc';
            break;
          case '0601':
            //加油站
            rtValue = 'jyz';
            break;
          case '0701':
            //生物质燃料
            rtValue = 'swzrl';
            break;
          case '0801':
            //废水处理
            rtValue = 'fscl';
            break;
          case '0802':
            //固废处理
            rtValue = 'gfcl';
            break;
          case '0803':
            //烟气脱硝
            rtValue = 'yqtx';
            break;
          case '0901':
            //餐饮油烟
            rtValue = 'cyyy';
            break;
          ///
          default:
            rtValue = -1;
            break;
        }
        return rtValue;
      },

      //判断国省控点是否显示
      hasMarkerVisible(v) {
        let hasVisible = false;
        if (v && v.hasOwnProperty('dataLevel')) {
          let zom = this.map.getZoom();
          let level = parseInt(v['dataLevel']);
          switch (level) {
            case 1:
              hasVisible = zom > 9;
              break;
            case 2:
              hasVisible = zom <= 9;
              break;
            case 3:
              hasVisible = zom <= 1;
              break;
          }
        }
        return hasVisible;
      },

      //随比例控制国省空点是否显示
      setGSMarkerLabelVisible(hasRedLabelVisible) {
        const t = this;
        let lsMarkers = this.getMarkerByType('LAYER_GS') || [];
        lsMarkers.forEach(v => (t.hasMarkerVisible(v.marker.attributes) ? v.marker.show() : v.marker.hide()));
        t.lsRedLabels.forEach(v => (hasRedLabelVisible || (parseInt(v.dataLevel) === 1)) ? v.label.hide() : v.label.show());
      },

      //获取图标对象
      getMarker(pt, type, lyType, value) {
        let marker = undefined;
        if (pt && type) {
          let conPoint = this.wgsPointToBd(pt);
          let imgUrl = this.getMarkerIcon(type);
          let icon = new BMap.Icon(imgUrl, new BMap.Size(25, 25));//|| lyType.toUpperCase() === 'LAYER_CGQ_LCS'
          marker = new BMap.Marker((lyType.toUpperCase() === 'LAYER_SP' || lyType.toUpperCase() === 'LAYER_SP_VOC' || lyType.toUpperCase() === 'LAYER_CGQ_VOC' || lyType.toUpperCase() === 'LAYER_GD') ? conPoint : pt, {
            //marker = new BMap.Marker((lyType.toUpperCase() === 'LAYER_GS') ? pt:conPoint, {
            icon: icon,
            offset: new BMap.Size(0, 0)
          });
          //let typeUpper = type.toUpperCase();
          if (lyType.toUpperCase() === 'LAYER_GS') {
            let label = new BMap.Label((value || '') + '<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid #fff; border-right: 8px solid transparent; color:#333; position: absolute;  margin-top:-24px;margin-left:' + (value.length * 6 - 8) + 'px  " ></div>');
            label.setStyle({
              border: 'none',
              //color: (typeUpper === 'GS-G' || typeUpper === 'GS-O' || typeUpper === 'GS-Y') ? '#333' : '#fff',
              color: '#000000',
              background: '#fff',
              fontSize: '12px',
              fontFamily: 'Microsoft YaHei'
            });
            label.setOffset(new BMap.Size(-6 * value.length + 7, 21));
            marker.setLabel(label);
          }
        }
        return marker;
      },

      //设置显示值覆盖物
      setValueLabel(value, fieldName, ptType, pt) {
        let index = 0;
        let hasLabel = false;
        let label = undefined;
        let vl = fieldName && (value[fieldName] || value[fieldName.toLocaleLowerCase()]);
        switch (ptType.toUpperCase()) {
          case 'LAYER_GS':
            hasLabel = false;
            break;
          case 'LAYER_CGQ_LCS':
            index = this.getPollutionState(Math.ceil(vl) || 0, fieldName);
            ;//getAQILevelIndex(Math.ceil(vl) || 0) || 0;
            hasLabel = true;
            break;
          case 'LAYER_GD':
            index = this.getPollutionState(Math.ceil(vl) || 0, fieldName);//getPM10LevelIndex(Math.ceil(vl) || 0) || 0;
            hasLabel = true;
            break;
          case 'LAYER_CGQ_VOC':
            index = value.polluLevel || 0;//getVOCLeveColorIndex(Math.ceil(vl) || 0) || 0;
            vl = value[fieldName];
            hasLabel = true;
            break;
          case 'LAYER_QY':
            hasLabel = false;
            break;
          case 'LAYER_CX':
            index = this.getPollutionState(Math.ceil(vl) || 0, fieldName);//getPM25LevelIndex(Math.ceil(vl) || 0) || 0;
            hasLabel = true;
            break;
        }
        if (hasLabel) {
          let bgcolor = getColorByIndex(index) || '#999';
          let conPoint = this.wgsPointToBd(pt);//|| ptType.toUpperCase() === 'LAYER_CGQ_LCS'
          let opts = {
            position: (ptType.toUpperCase() === 'LAYER_SP' || ptType.toUpperCase() === 'LAYER_SP_VOC' || ptType.toUpperCase() === 'LAYER_CGQ_VOC' || ptType.toUpperCase() === 'LAYER_GD') ? conPoint : pt,
            offset: new BMap.Size(-9, 24)
          };
          label = new BMap.Label(((vl === null || vl === undefined || vl === '') ? '--' : vl) + '<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid; border-right: 8px solid transparent; color:' + bgcolor + '; position: absolute;  margin-top:-30px;margin-left:8px  " ></div>', opts)  // 创建文本标注对象
          label.setStyle({
            color: index > 3 ? '#fff' : '#333',
            background: bgcolor,
            fontSize: '14px',
            border: '',
            width: '35px',
            textAlign: 'center',
            height: '22px',
            lineHeight: '22px',
            borderRadius: '4px'
          });
          label && ((this.map.getZoom() >= this.maxZoom || ptType.toUpperCase() === 'LAYER_GS') ? label.show() : label.hide());
        }
        return label;
      },

      //设置MarkerLabel
      setMarkerLabel(displayValue, state, point, lyType) {
//        displayValue = displayValue === '药材公司' ? '第十中学' : displayValue;
        let conPoint = this.wgsPointToBd(point);
        let label = new BMap.Label(((!state.value) ? displayValue : this.getLabelContent(displayValue, state, lyType)) || '');
        label.setStyle({
          border: 'none',
          color: '#333',
          background: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei',
          boxShadow: '1px 3px 4px rgba(0,0,0,0.18)',
          padding: 0
        });
        label.setPosition((lyType.toUpperCase() === 'LAYER_SP' || lyType.toUpperCase() === 'LAYER_SP_VOC' || lyType.toUpperCase() === 'LAYER_CGQ_VOC' || lyType.toUpperCase() === 'LAYER_GD') ? conPoint : point);//|| lyType.toUpperCase() === 'LAYER_CGQ_LCS'
        displayValue && label.setOffset(new BMap.Size(-((displayValue.length * 14 + 32) / 2), 22));
        this.map.getZoom() >= this.maxZoom ? label.show() : label.hide();
        lyType.toUpperCase() === 'LAYER_GS' && (label.show());
        return label;
      },

      //获取Label显示内容
      getLabelContent(displayValue, state, lyType) {
        let col = '#00ff00';
        if (lyType.toUpperCase() === 'LAYER_QY') {
          col = state.level ? '#43ce17' : '#d20040';
        } else {
          col = getColorByIndex(state.level);
        }
        return '<div><span style="padding:0 5px;">' + displayValue + '</span><span style="display:inline-block;width:32px;text-align:center;color:' + (state.level > 3 ? '#fff;' : '#333;') + 'background-color:' + col + '">' + state.value + '</span></div>' + '<div class="arrow" style="width: 0;  height: 0; border-left: 8px solid transparent; border-bottom: 8px solid; border-right: 8px solid transparent; color:#fff; position: absolute;  margin-top:-26px;margin-left:' + (displayValue.length * 14 + 32) / 2 + 'px  " ></div>';
      },

      //设置Label显隐性
      setMarkerLabelVisible(hasVisible) {
        for (let i = 0, length = this.lsLabels.length; i < length; i++) {
          let v = this.lsLabels[i];
          hasVisible ? v.label.show() : v.label.hide();
        }
      },

      //获取Label根据类型
      getMarkerLabelByType(type) {
        return this.lsLabels.filter(v => v.type.toUpperCase() === type.toUpperCase());
      },

      //WGS坐标转百度坐标
      wgsPointToBd: function (pt) {
        //let transPoint = this.transformFun([pt.lng, pt.lat]);
        //let bdPoint = new BMap.Point(transPoint[0], transPoint[1]);

        // return bdPoint;
        return pt;
      },

      //WGS坐标转百度坐标
      transformFun: function (path) {
        let gcPoint = Coordtransform.wgs84togcj02(path[0], path[1]);
        return Coordtransform.gcj02tobd09(gcPoint[0], gcPoint[1]);
      },

      //获取地图显示图标根据类型
      getMarkerIcon(type) {
        return '/static/imgs/main/' + type.toLocaleLowerCase() + '.png';
//        switch (type.toUpperCase()) {
//          case 'CGQ-G':
//            path = '/static/imgs/main/cgq-g.png';
//            break;
//          case 'CGQ-O':
//            path = '/static/imgs/main/cgq-o.png';
//            break;
//          case 'CGQ-Y':
//            path = '/static/imgs/main/cgq-y.png';
//            break;
//          case 'CGQ-V':
//            path = '/static/imgs/main/cgq-v.png';
//            break;
//          case 'CGQ-M':
//            path = '/static/imgs/main/cgq-m.png';
//            break;
//          case 'CGQ-R':
//            path = '/static/imgs/main/cgq-r.png';
//            break;
//          case 'CGQ-NG':
//            path = '/static/imgs/main/cgq-ng.png';
//            break;
//          case 'CGQ-LCS-G':
//            path = '/static/imgs/main/cgq-lcs-g.png';
//            break;
//          case 'CGQ-LCS-O':
//            path = '/static/imgs/main/cgq-lcs-o.png';
//            break;
//          case 'CGQ-LCS-Y':
//            path = '/static/imgs/main/cgq-lcs-y.png';
//            break;
//          case 'CGQ-LCS-V':
//            path = '/static/imgs/main/cgq-lcs-v.png';
//            break;
//          case 'CGQ-LCS-M':
//            path = '/static/imgs/main/cgq-lcs-m.png';
//            break;
//          case 'CGQ-LCS-R':
//            path = '/static/imgs/main/cgq-lcs-r.png';
//            break;
//          case 'CGQ-LCS-NG':
//            path = '/static/imgs/main/cgq-lcs-ng.png';
//            break;
//          case 'CGQ-GSX-G':
//            path = '/static/imgs/main/cgq-gsx-g.png';
//            break;
//          case 'CGQ-GSX-O':
//            path = '/static/imgs/main/cgq-gsx-o.png';
//            break;
//          case 'CGQ-GSX-Y':
//            path = '/static/imgs/main/cgq-gsx-y.png';
//            break;
//          case 'CGQ-GSX-V':
//            path = '/static/imgs/main/cgq-gsx-v.png';
//            break;
//          case 'CGQ-GSX-M':
//            path = '/static/imgs/main/cgq-gsx-m.png';
//            break;
//          case 'CGQ-GSX-R':
//            path = '/static/imgs/main/cgq-gsx-r.png';
//            break;
//          case 'CGQ-GSX-NG':
//            path = '/static/imgs/main/cgq-gsx-ng.png';
//            break;
//          case 'CGQ-VOC-G':
//            path = '/static/imgs/main/cgq-voc-g.png';
//            break;
//          case 'CGQ-VOC-O':
//            path = '/static/imgs/main/cgq-voc-o.png';
//            break;
//          case 'CGQ-VOC-Y':
//            path = '/static/imgs/main/cgq-voc-y.png';
//            break;
//          case 'CGQ-VOC-V':
//            path = '/static/imgs/main/cgq-voc-v.png';
//            break;
//          case 'CGQ-VOC-M':
//            path = '/static/imgs/main/cgq-voc-m.png';
//            break;
//          case 'CGQ-VOC-R':
//            path = '/static/imgs/main/cgq-voc-r.png';
//            break;
//          case 'CGQ-VOC-NG':
//            path = '/static/imgs/main/cgq-voc-ng.png';
//            break;
//          case 'GD-G':
//            path = '/static/imgs/main/gd-g.png';
//            break;
//          case 'GD-O':
//            path = '/static/imgs/main/gd-o.png';
//            break;
//          case 'GD-Y':
//            path = '/static/imgs/main/gd-y.png';
//            break;
//          case 'GD-V':
//            path = '/static/imgs/main/gd-v.png';
//            break;
//          case 'GD-M':
//            path = '/static/imgs/main/gd-m.png';
//            break;
//          case 'GD-R':
//            path = '/static/imgs/main/gd-r.png';
//            break;
//          case 'GD-NG':
//            path = '/static/imgs/main/gd-ng.png';
//            break;
//          case 'GS-G':
//            path = '/static/imgs/main/gs-g.png';
//            break;
//          case 'GS-O':
//            path = '/static/imgs/main/gs-o.png';
//            break;
//          case 'GS-Y':
//            path = '/static/imgs/main/gs-y.png';
//            break;
//          case 'GS-V':
//            path = '/static/imgs/main/gs-v.png';
//            break;
//          case 'GS-M':
//            path = '/static/imgs/main/gs-m.png';
//            break;
//          case 'GS-R':
//            path = '/static/imgs/main/gs-r.png';
//            break;
//          case 'GS-NG':
//            path = '/static/imgs/main/gs-ng.png';
//            break;
//          case 'HWC-NG':
//            path = '/static/imgs/main/hwc-ng.png';
//            break;
//          case 'HWC-G':
//            path = '/static/imgs/main/hwc-g.png';
//            break;
//          case 'JYZ-G':
//            path = '/static/imgs/main/jyz-g.png';
//            break;
//          case 'JYZ-NG':
//            path = '/static/imgs/main/jyz-ng.png';
//            break;
//          case 'JYZ-R':
//            path = '/static/imgs/main/jyz-r.png';
//            break;
//          case 'QY-G':
//            path = '/static/imgs/main/qy-g.png';
//            break;
//          case 'QY-NG':
//            path = '/static/imgs/main/qy-ng.png';
//            break;
//          case 'QY-R':
//            path = '/static/imgs/main/qy-r.png';
//            break;
//          case 'SP-G':
//            path = '/static/imgs/main/sp-g.png';
//            break;
//          case 'SP-NG':
//            path = '/static/imgs/main/sp-ng.png';
//            break;
//          case 'SP-SLW-G':
//            path = '/static/imgs/main/sp-slw-g.png';
//            break;
//          case 'SP-SLW-NG':
//            path = '/static/imgs/main/sp-slw-ng.png';
//            break;
//          case 'SP-VOC-G':
//            path = '/static/imgs/main/sp-voc-g.png';
//            break;
//          case 'SP-VOC-NG':
//            path = '/static/imgs/main/sp-voc-ng.png';
//            break;
//          case 'SP-GD-G':
//            path = '/static/imgs/main/sp-gd-g.png';
//            break;
//          case 'SP-GD-NG':
//            path = '/static/imgs/main/sp-gd-ng.png';
//            break;
//          case 'SP-GKWGL-G':
//            path = '/static/imgs/main/sp-gkwgl-g.png';
//            break;
//          case 'SP-GKWGL-NG':
//            path = '/static/imgs/main/sp-gkwgl-ng.png';
//            break;
//          case 'ZTC-G':
//            path = '/static/imgs/main/ztc-g.png';
//            break;
//          case 'ZTC-NG':
//            path = '/static/imgs/main/ztc-ng.png';
//            break;
//          case 'VOC-M':
//            path = '/static/imgs/main/voc-v.png';
//            break;
//          case 'VOC-O':
//            path = '/static/imgs/main/voc-o.png';
//            break;
//          case 'VOC-R':
//            path = '/static/imgs/main/voc-r.png';
//            break;
//          case 'VOC-G':
//            path = '/static/imgs/main/voc-g.png';
//            break;
//          case 'VOC-Y':
//            path = '/static/imgs/main/voc-y.png';
//            break;
//          case 'VOC-NG':
//            path = '/static/imgs/main/voc-ng.png';
//            break;
//          case 'CX-NG':
//            path = '/static/imgs/main/cx-ng.png';
//            break;
//          case 'CX-G':
//            path = '/static/imgs/main/cx-g.png';
//            break;
//          case 'CX-Y':
//            path = '/static/imgs/main/cx-y.png';
//            break;
//          case 'CX-O':
//            path = '/static/imgs/main/cx-o.png';
//            break;
//          case 'CX-R':
//            path = '/static/imgs/main/cx-r.png';
//            break;
//          case 'CX-M':
//            path = '/static/imgs/main/cx-m.png';
//            break;
//          case 'CX-V':
//            path = '/static/imgs/main/cx-v.png';
//            break;
//          case 'YQD-Y':
//            path = '/static/imgs/main/yqd-y.png';
//        }
//        return path;
      },

      //根据类型获取Marker
      getMarkerByType(type) {
        let rtValue = [];
        for (let i = 0, length = this.lsMarkers.length; i < length; i++) {
          let item = this.lsMarkers[i];
          item.type.toUpperCase() === type.toUpperCase() && rtValue.push(item);
        }
        return rtValue;
      },

      //获取警报Label根据类型
      getLabelRedByType(type) {
        let rtValue = [];
        for (let i = 0, length = this.lsRedLabels.length; i < length; i++) {
          let item = this.lsRedLabels[i];
          item.type.toUpperCase() === type.toUpperCase() && rtValue.push(item);
        }
        return rtValue;
      },

      //设置聚合效果样式
      getMarkerCluster() {
        return [{
          url: this.markUrl + '0.png',
          size: new BMap.Size(30, 26),
          opt_anchor: [16, 0],
          textColor: '#333',
          opt_textSize: 10
        }, {
          url: this.markUrl + '1.png',
          size: new BMap.Size(40, 35),
          opt_anchor: [40, 35],
          textColor: '#333',
          opt_textSize: 12
        }, {
          url: this.markUrl + '2.png',
          size: new BMap.Size(50, 44),
          opt_anchor: [32, 0],
          textColor: '#333',
          opt_textSize: 14
        }];
      },

      //获取值Label根据类型
      getLabelValueByType(type) {
        let rtValue = [];
        for (let i = 0, length = this.lsValueLabels.length; i < length; i++) {
          let item = this.lsValueLabels[i];
          item.type.toUpperCase() === type.toUpperCase() && rtValue.push(item);
        }
        return rtValue;
      },

      //根据指标类型获取指标别名
      getTargetFieldName(type) {
        let rtValue = type;
        switch (type.toUpperCase()) {
          case 'AQI':
            rtValue = 'AQI';
            break;
          case 'PM25':
          case 'PM2.5':
            rtValue = 'PM2.5';
            break;
          case 'PM10':
            rtValue = 'PM10';
            break;
          case 'SO2':
            rtValue = 'SO2';
            break;
          case 'NO2':
            rtValue = 'NO2';
            break;
          case 'CO':
            rtValue = 'CO';
            break;
          case 'O3':
            rtValue = 'O3';
            break;
          case 'COMPLEXINDEX':
          case 'COM_INDEX':
            rtValue = '综指';
            break;
          case 'TEMP':
            rtValue = '温度';
            break;
          case 'HUMI':
            rtValue = '湿度';
            break;
          case 'WINDANGLE':
            rtValue = '风向';
            break;
          case 'WINDSPEED':
            rtValue = '风力';
            break;
        }
        return rtValue;
      },

      //设置数值Value显隐性
      setLabelValueVisible(hasVisible) {
        this.lsValueLabels.forEach(v => (hasVisible ? v.label.show() : v.label.hide()));
      },

      //空间检索
      distance(lon1, lat1, lon2, lat2) {
        let R = 6378137; //地球半径
        lat1 = lat1 * Math.PI / 180.0;
        lat2 = lat2 * Math.PI / 180.0;
        let sa2 = Math.sin((lat1 - lat2) / 2.0);
        let sb2 = Math.sin(((lon1 - lon2) * Math.PI / 180.0) / 2.0);
        return 2 * R * Math.asin(Math.sqrt(sa2 * sa2 + Math.cos(lat1) * Math.cos(lat2) * sb2 * sb2));
      },

      //移除Marker根据类型及Marker集合
      removeMarkerByList(ls, type) {
        for (let i = 0, length = ls.length; i < length; i++) {
          let overlayItem = ls[i];
          this.map.removeOverlay(overlayItem.marker);
        }
        let lsAllMarkers = [];
        for (let i = 0, length = this.lsMarkers.length; i < length; i++) {
          let item = this.lsMarkers[i];
          item.type.toUpperCase() !== type.toUpperCase() && lsAllMarkers.push(item);
        }
        this.lsMarkers = lsAllMarkers;
        //this.mkm && (this.mkm.removeMarkers(ls.map(v => v.marker)), this.mkm = undefined);
        (this.mkm && type.toUpperCase() === 'LAYER_YQD') && (this.mkm.clearMarkers(), this.mkm = undefined);
        this.searchInfoWindow && (this.searchInfoWindow.close(), this.searchInfoWindow = undefined);
      },

      //移除Label
      removeMarkerLabel(ls = [], type) {
        const t = this;
        ls.forEach(v => t.map.removeOverlay(v.label));
        let lsAllLabels = [];
        this.lsLabels.forEach(function (v) {
          v.type.toUpperCase() !== type.toUpperCase() && lsAllLabels.push(v);
        });
        this.lsLabels = lsAllLabels;
      },

      //移除LabelRed
      removeLabelRed(ls = [], type) {
        const t = this;
        ls.forEach(v => t.map.removeOverlay(v.label));
        let lsAllLabels = [];
        this.lsRedLabels.forEach(function (v) {
          v.type.toUpperCase() !== type.toUpperCase() && lsAllLabels.push(v);
        });
        this.lsRedLabels = lsAllLabels;
      },

      //移除LabelValue
      removeLabelValue(ls = [], type) {
        const t = this;
        ls.forEach(v => t.map.removeOverlay(v.label));
        let lsAllLabels = [];
        this.lsValueLabels.forEach(function (v) {
          v.type.toUpperCase() !== type.toUpperCase() && lsAllLabels.push(v);
        });
        this.lsValueLabels = lsAllLabels;
      },

      //获取指标PrimaryKey
      getOtherAttributeByType(type) {
        let rtValue = undefined;
        switch (type.toUpperCase()) {
          case 'LAYER_GS':
            rtValue = {pk: 'citygid', index: 0};
            break;
          case 'LAYER_CGQ_LCS':
            rtValue = {pk: 'stationid', index: 1};
            break;
          case 'LAYER_CGQ_VOC':
            rtValue = {pk: 'stationId', index: 2};
            break;
          case 'LAYER_CX':
            rtValue = {pk: 'deviceid', index: 3};
            break;
          case 'LAYER_GD':
            rtValue = {pk: 'deviceid', index: 4};
            break;
          case 'LAYER_QY':
            rtValue = {pk: 'pscode', index: 5};
            break;
          case 'LAYER_YQD':
            rtValue = {pk: 'po', index: 6};
            break;
          case 'LAYER_YJ':
            rtValue = {pk: 'id', index: 7};
            break;
          case 'LAYER_LK':
            rtValue = {pk: '', index: 8};
            break;
          case 'LAYER_SP_SLW':
            rtValue = {pk: 'Id', index: 9};
            break;
          case 'LAYER_SP_VOC':
            rtValue = {pk: 'Id', index: 10};
            break;
          case 'LAYER_SP_GKW':
            rtValue = {pk: 'Id', index: 11};
            break;
          case 'LAYER_ZT':
            rtValue = {pk: '', index: 12};
            break;
          case 'LAYER_HW':
            rtValue = {pk: '', index: 13};
            break;
          case 'LAYER_JY':
            rtValue = {pk: '', index: 14};
            break;
          case 'LAYER_QM':
            rtValue = {pk: 'casecode', index: 15};
            break;
        }
        return rtValue;
      },

      //清除Marker
      clearMarkers() {
        const t = this;
        t.lsMarkers.forEach(v => (t.map.removeOverlay(v.marker)));
        t.lsLabels.forEach(v => (t.map.removeOverlay(v.label)));
        t.lsRedLabels.forEach(v => (t.map.removeOverlay(v.label)));
        t.lsValueLabels.forEach(v => (t.map.removeOverlay(v.label)));
        t.searchInfoWindow && (t.searchInfoWindow.close(), t.searchInfoWindow = undefined);
        t.lsMarkers.length = 0;
        t.lsLabels.length = 0;
        t.lsRedLabels.length = 0;
        t.lsValueLabels.length = 0;
      },

      //截取数据按某一长度
      splitArray(ar, le) {
        let rtValue = [];
        for (let i = 0; i < le; i += le) {
          rtValue.push(ar.split(i, i + le));
        }
        return rtValue;
      },

      hasNullOrUndefined(v) {
        return !(v === null || v === undefined);
      }
    }
  };
</script>
<style>
  * {
    font-family: 'Microsoft YaHei'
  }

  .class-vidoes {
    display: inline-block;
    float: right;
    margin-right: 22px;
    padding: 3px 15px;
    margin-top: 4px;
    height: 26px;
    line-height: 22px;
    background: #1080cc;
    font-size: 10px;
    border-radius: 3px;
    color: #fff;
  }

  .fitem {
    border: 1px solid #ddd;
    margin: 2px 15px;
    line-height: 18px;
  }

  .fitem th {
    width: 65px;
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    border: 1px solid #ddd;
  }

  .fitem td {
    font-size: 12px;
    text-align: center;
    border: 1px solid #ddd;
    /*padding: 4px 2px;*/
  }

  .param {
    /*border-top:1px solid #DDDDDD;*/
    padding: 0 15px;
  }

  .line {
    height: 1px;
    width: 100%;
    background: #DDDDDD;
    margin-bottom: 12px;
  }

  .param .item {
    background: #EBEBEB;
    display: inline-block;
    font-size: 14px;
    font-family: "Microsoft YaHei";
  }

  .date {
    font-size: 10px;
    color: #666666;
    line-height: 10px;
  }

  .value {
    font-size: 14px;
    color: #666666;
    background: #EBEBEB;
    text-align: center;
  }

  .key {
    font-size: 12px;
    color: #333333;
    font-weight: bold;
    /*background:#2BE42F;*/
    text-align: center;
    height: 20px;
    line-height: 20px;
  }

  .type {
    font-size: 14px;
    color: #333333;
    font-weight: bold;
    display: inline-block;
  }

  .square, .circle {
    height: 14px;
    width: 14px;
    background: #2BE42F;
    border: 1px solid #009C03;
    display: inline-block;
    margin-right: 4px;

  }

  .circle {
    border-radius: 50%;
  }

  .keyAqi {
    width: 188px;
  }

  .one {
    text-align: center;
    padding: 10px 0;
    width: 188px;

  }

  .second .key,
  .third .key {
    width: 92px;
  }

  .second .value,
  .third .value {
    height: 28px;
    width: 92px;
  }

  .param .value {
    height: 28px;
    line-height: 28px;
  }

  .third {
    margin-left: 4px;
  }

  .secondLine {
    width: 60px;
    margin-top: 5px;
  }

  .secondLine1 {
    width: 61px;
  }

  .index {
    padding: 20px 15px 0;
  }

  .index .item {
    display: inline-block;
    font-size: 12px;
    color: #666666;
    margin-right: 30px;
    font-family: 'Microsoft YaHei'
  }

  .vocItem {
    width: 188px;
  }

  .triangle {
    height: 0;
    width: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 16px solid #FFB334;
    display: inline-block;
  }

  .gongDi .item {
    display: inline-block;
    height: 48px;
    vertical-align: top;
  }

  .qyPollution div {
    display: inline-block;
  }

  .qyPollution {
    background: #EBEBEB;
    padding: 5px;
    margin: 0 15px;
  }

  .qyPollution .date {
    margin-left: 10px;
  }

  .qyTable {
    background: #EBEBEB;
    color: #666666;
  }

  .qyNumber {
    color: #333333;
  }

  .qyImg {
    margin-right: 10px;
  }

  .qyLine {
    padding: 0 15px;
  }

  .Introduce {
    font-size: 12px;
    color: #999999;
    padding: 0 15px 15px;
  }

  .Net, .Person {
    display: inline-block;
  }

  .Net {
    margin-right: 10px;
  }

  .chart {
    padding: 15px 15px 0;

  }

  .qm-panel {

  }

  .qm-panel .item {
    height: 32px;
    width: 100%;
  }

  .qm-panel .item .key {
    height: 32px;
    width: 20%;
    text-align: right;
    float: left;
    padding: 5px 5px;
  }

  .qm-panel .item .value {
    width: 80%;
    float: left;
    text-align: left;
    line-height: 30px;
  }

  .qm-panel .img-panel {
    width: 410px;
    overflow-x: auto;
  }

  .qm-panel .img-panel .item {
    height: 160px;
    width: 160px;
    background-size: 160px;
    background-repeat: no-repeat;
    margin: 5px;
    box-shadow: 0 0 5px #333;
  }

  #QyData {
    margin-right: 10px
  }

  #QyInfo, #QyData {
    width: 102px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
  }

  .selected {
    border-bottom: 2px solid #2b8fe4;
    color: #2b8fe4;
  }

  .none {
    display: none;
  }

  #QyInfo-one td {
    width: 190px;
    height: 20px;
    border-left: 1px solid #dddddd;
    border-top: 1px solid #dddddd;
    border-right: 1px solid #ddd;
  }

  #QyInfo-one .first {
    width: 90px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background: #ebebeb;
    border-right: none;
  }
</style>
