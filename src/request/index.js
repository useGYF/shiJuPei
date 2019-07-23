import RequestConfig from '@/request/RequestConfig'
import Axios from 'axios'

export default {
    request(params, callback1, callback0) {
        let qs = require('qs');
        let url = params.url;
        let type = params.type.toUpperCase();
        let pms = params.pms;
        Axios({
            url: url,
            method: type,//'auth':this.$cookies.get('SESSION')
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: type === 'POST' ? qs.stringify(pms,{arrayFormat: 'brackets'}) : pms
        }).then(function (result) {
            if (!result.data.errorcode) {
                let data = result.data;
                data = typeof data === 'string' ? JSON.parse(data) : data;
                // console.log(data);
                // console.log(data.status);
                //parseInt((data.status && data.status.toString()) || (data.Status && data.Status.toString()))
                let hasSuccess = parseInt(data.Status || data.status || data.code);
                //data.hasOwnProperty('case') && (hasSuccess = (data.case.length > 0));
                if (hasSuccess > 0) {
                    data = {
                        status: 1,
                        history: data.history ? (typeof data.history === 'string' ? JSON.parse(data.history) : data.history) : (data.ExtraData ? (typeof data.ExtraData === 'string' ? JSON.parse(data.ExtraData) : data.ExtraData) : undefined),
                        obj: (typeof data.obj === 'string' ? JSON.parse(data.obj) : data.obj) || (typeof data.Data === 'string' ? JSON.parse(data.Data) : data.Data) || (typeof data.Data === 'string' ? JSON.parse(data.case) : data.case) || data.data
                    };
                    callback1(data);
                }
                else {
                    console.log(data);
                }
            }
            else {
                callback0(result.data);
            }
        }).catch(function (ex) {
            callback0(ex);
        })
    },
    getRequestUrl(type) {
        return RequestConfig.getRequestUrlByType(type);
    }
};
