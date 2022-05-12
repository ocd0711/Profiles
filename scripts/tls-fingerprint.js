function operator(proxies, targetPlatform) {
    const fingerprint = "46:e9:c5:a8:34:a9:d4:75:2d:f3:95:aa:6d:a6:ce:06:d4:a1:84:36:5b:f2:14:14:90:1a:5a:53:0c:d9:02:1a";
    proxies.forEach(proxy => {
        if (targetPlatform === "Surge" && proxy.type === "trojan") {
            proxy.tfo = `${proxy.tfo || false},server-cert-fingerprint-sha256=${fingerprint},always-use-connect=true`;
        } if (targetPlatform === "Surge" && proxy.name.indexOf("IEPL") != -1) {
            proxy.tfo = `false,no-error-alert=true`;
        } else if (targetPlatform === "QX" && proxy.type === "trojan") {
            proxy.tfo = `${proxy.tfo || false},tls-cert-sha256=${fingerprint}`;
        }
    });
    return proxies;
}