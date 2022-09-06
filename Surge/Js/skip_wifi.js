/*
[Script]
skip_wifi = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/ocd0711/Task/master/Surge/Js/skip_wifi.js
// use "module", "title", "icon", "color1", "color2" in "argument":
// skip_wifi = type=generic,timeout=10,script-path=https://raw.githubusercontent.com/ocd0711/Task/master/Surge/Js/skip_wifi.js,argument=title=Skip WiFi&module=Skip_Wifi_Mode&icon=wifi.square&color1=#008080&color2=#efc56f

[Panel]
skip_wifi = script-name=skip_wifi.js,update-interval=43200
*/

!(async () => {
    let module = "Skip Wifi Mode",
        panel = { title: module, icon: "wifi.square" },
        skipmall,
        color1,
        color2
    if (typeof $argument != "undefined") {
        let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=")));
        if (arg.module) module = panel.title = arg.module;
        if (arg.title) panel.title = arg.title;
        if (arg.icon) panel.icon = arg.icon;
        if (arg.color1) color1 = arg.color1;
        if (arg.color2) color2 = arg.color2;
    }
    if ($trigger == "button") {
        skipmall = (await httpAPI("/v1/modules")).enabled.includes(module);
        let moduleBody = {};
        moduleBody[module] = !skipmall;
        await httpAPI("/v1/modules", "POST", moduleBody);
        await sleep(100);
    }
    skipmall = (await httpAPI("/v1/modules")).enabled.includes(module);
    if (!skipmall) panel["icon-color"] = color2 ? color2 : "#ff0000";
    else color1 ? (panel["icon-color"] = color1) : "";
    panel.content =
        `${module}: ${skipmall ? "enabled" : "disabled"}`;
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