/***********************************
[rewrite_local]

# > 酷安_推广广告
^https?:\/\/api.coolapk.com\/v6\/page\/dataList url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/coolapk.js
# > 酷安_首页广告
^https?:\/\/api.coolapk.com\/v6\/main\/indexV8 url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/coolapk.js
# > 酷安_评论广告
^https?:\/\/api.coolapk.com\/v6\/feed\/replyList url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/coolapk.js
# > 酷安_商品推广
^https?:\/\/api.coolapk.com\/v6\/feed\/detail url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/coolapk.js

[Script]
coolapk = type=http-response,requires-body=1,max-size=0,pattern=^https?:\/\/api\.coolapk\.com\/v6\/(feed\/(replyList|detail)|main\/indexV8|page\/dataList),script-path=coolapk.js

[MITM]
hostname = %APPEND% api.coolapk.com
***********************************/

if(-1!=$request.url.indexOf("replyList")){var t=JSON.parse($response.body);t.data.length&&(t.data=t.data.filter(t=>t.id)),$done({body:JSON.stringify(t)})}else if(-1!=$request.url.indexOf("indexV8")){var t=JSON.parse($response.body);t.data=t.data.filter(t=>!("sponsorCard"==t.entityTemplate||-1!=t.title.indexOf("值得买")||-1!=t.title.indexOf("红包"))),$done({body:JSON.stringify(t)})}else if(-1!=$request.url.indexOf("dataList")){var t=JSON.parse($response.body);t.data=t.data.filter(t=>!("sponsorCard"==t.entityTemplate||-1!=t.title.indexOf("精选配件"))),$done({body:JSON.stringify(t)})}else if(-1!=$request.url.indexOf("detail")){var t=JSON.parse($response.body);t.data?.hotReplyRows?.length&&(t.data.hotReplyRows=t.data.hotReplyRows.filter(t=>t.id)),t.data?.topReplyRows?.length&&(t.data.topReplyRows=t.data.topReplyRows.filter(t=>t.id)),t.data?.include_goods_ids&&(t.data.include_goods_ids=[]),t.data?.include_goods&&(t.data.include_goods=[]),t.data?.detailSponsorCard&&(t.data.detailSponsorCard=[]),$done({body:JSON.stringify(t)})}else $done($response);