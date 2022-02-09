## 资源

[官方 Github 示例](https://github.com/crossutility/Quantumult-X)

## 配置

| 类别 | 配置 |
| :------------: | :------------: |
| 出国版 | [Outbound](https://raw.githubusercontent.com/DivineEngine/Profiles/master/Quantumult/Outbound.conf) |
| 回国版 | [Inbound](https://raw.githubusercontent.com/DivineEngine/Profiles/master/Quantumult/Inbound.conf) |

## 说明

得益于「资源解析器」的特性，你可以使用 Surge 的 Ruleset、Doaminset 和 Module。

### 关于 IPv6

默认并不开启 IPv6，如需要可在文本配置中在 `no-ipv6` 之前加上英文冒号。

### 关于 DNS

如果所使用的网络没有 DNS 劫持问题，则配置为使用系统 DNS 并追加公共 DNS，如果所使用的网络存在 DNS 劫持问题，则配置为仅使用公共 DNS；
> 如部分运营商存在劫持海外正常网站至反诈页面的（据目前反馈它们没有抢答公共 DNS，所以）可以在文本配置中将 `;no-system` 开头的英文冒号删除以启用。

不建议使用海外 DNS（包括 119.28.28.28），如 `1.1.1.1` 解析哔哩哔哩返回的是香港的 CDN，这时候再指定个规则直连没什么意义；
> 如果非要用海外 DNS 或不知道所用 DNS 是否为海外，遇到应走直连的国内域名走了代理或不知道为什么走了代理，可自行排查：在顶部的「DNS」面板搜索相关 DNS 记录，哪个 DNS 返回了什么结果（IP）。

非必要不建议使用 DoH；
> 必要指的是如中国移动这种抢答公共 DNS 的运营商

### 关于 Apple 分流

默认 Apple 分流为直连（除了被动或主动屏蔽的那些，所以 Apple.list 要放在 Global.list 之后），如果想完全走代理可以将「分流」的「引用」的 `Apple.list` 的「策略偏好」修改为「PROXY」。

但若想 Apple 只要国内全走直连只要国外全走代理可将「分流」里「引用」的 `Apple.list` 的勾去掉，**前提是 Apple 相关域名仅使用国内 DNS**。

### 从 Surge 迁移到 Quantumult X 可能遇上的问题

注意，Quantumult X 并没有官方文档，所以以下内容可能有误。

规则类型优先级，在 Quantumult X 中并不是完全按顺序匹配，各类型的优先级应该为： host > host-suffix > host-keyword > user-agnet > geoip & ip-cidr。
> 举个例子：如某远程分流文件中含有 `host-suffix, instagram.com, proxy` 时，添加 `host-keyword, instagram, direct` 并不能改变 instagram.com 的策略；

顺序上来说 Quantumult X 将本地规则放在规则列表的顶部，所以当本地规则存在 `geoip,cn,direct` 时，远程分流文件中对于 CN 地区的 IP 规则并不会生效，解决办法是将相关规则也写在本地或将 `geoip,cn,direct` 放到远程分流文件中。

另外，在 Surge 中如 `DOMAIN,1.1.1.1` 这样的规则可以用于匹配目标主机为 IP 地址 1.1.1.1 的连接，但并不适用于 Quantumult X。