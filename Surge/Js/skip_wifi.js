/*
[Script]
skip_wifi = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/OCD0711/Task/master/Surge/Js/skip_wifi.js
// use "module", "title", "icon", "color1", "color2" or "skipmallContent" in "argument":
// skip_wifi = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/OCD0711/Task/master/Surge/Js/skip_wifi.js,argument=title=Skip WiFi&module=Skip_Wifi_Mode&icon=wifi.square&color1=#008080&color2=#efc56f&skipmallContent=false

[Panel]
skip_wifi = script-name=skip_wifi.js,update-interval=43200
*/

!(async () => {
    let module = "Skip Wifi Mode",
        panel = { title: module, icon: "wifi.square" },
        showSkipmall = true,
        skipmall,
        skipmallContent,
        color1,
        color2
    if (typeof $argument != "undefined") {
        let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=")));
        if (arg.module) module = panel.title = arg.module;
        if (arg.title) panel.title = arg.title;
        if (arg.icon) panel.icon = arg.icon;
        if (arg.color1) color1 = arg.color1;
        if (arg.color2) color2 = arg.color2;
        if (arg.showSkipmall == "false") showSkipmall = false;
    }
    if ($trigger == "button") {
        skipmall = (await httpAPI("/v1/modules")).enabled.includes(module);
        let moduleBody = {};
        moduleBody[module] = !skipmall;
        await httpAPI("/v1/modules", "POST", moduleBody);
        await sleep(100);
    }
    skipmall = (await httpAPI("/v1/modules")).enabled.includes(module);
    if (skipmallContent && skipmall) {
        skipmallContent = "";
        var cache = (await httpAPI("/v1/profiles/current?sensitive=0")).profile;
        if (cache != null) {
            cache.split("\n").forEach(function (cacheContent) {
                skipmallContent += cacheContent.replace("SUBNET,\n")
            });
        }
    }
    if (skipmall) panel["icon-color"] = color2;
    else color1 ? (panel["icon-color"] = color1) : "";
    panel.content =
        `${module}: ${skipmall ? "enabled" : "disabled"}` +
        (skipmallContent ? `\sskipe: ${skipmallContent.replace(/[\r\n]/g, '')}` : "");
    $done(panel);
})();

function httpAPI(path = "", method = "GET", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}