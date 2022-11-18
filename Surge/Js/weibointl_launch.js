/*
[Script]
http-response ^https?://weibointl\.api\.weibo\.cn/portal\.php\?a=get_coopen_ads requires-body=1,script-path=weibointl_launch.js

[MITM]
hostname = weibointl.api.weibo.cn, api.weibo.cn
*/

let body = JSON.parse($response.body);

body["data"]["display_ad"] = 0;

$done({ body: JSON.stringify(body) });