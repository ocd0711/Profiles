## 资源

[官方网站](https://nssurge.com/) / [手册](http://manual.nssurge.com/) / [常见问题](https://nssurge.zendesk.com/) / [社区](https://community.nssurge.com/)

## 配置

| 类别 | 配置 |
| :------------: | :------------: |
| 出国版 | [Outbound](https://raw.githubusercontent.com/DivineEngine/Profiles/master/Surge/Outbound.conf) |
| 回国版 | [Inbound](https://raw.githubusercontent.com/DivineEngine/Profiles/master/Surge/Inbound.conf) |

## 说明

### 关于 IPv6

默认并不开启 IPv6，如需要可在「更多设置 >」里打开「IPv6 支持」，或在文本配置中修改 `ipv6 = false` 为 `ipv6 = true`。

### 关于 DNS

如果所使用的网络没有 DNS 劫持问题，则配置为使用系统 DNS 并追加公共 DNS，如果所使用的网络存在 DNS 劫持问题，则配置为仅使用公共 DNS；
> 如部分运营商存在劫持海外正常网站至反诈页面的（据目前反馈它们没有抢答公共 DNS，所以）可以在「DNS 设置」中选择「使用自定义 DNS 服务器」或文本配置中将 `dns-server =` 中的 `system` 移除。

不建议使用海外 DNS（包括 119.28.28.28），如 `1.1.1.1` 解析哔哩哔哩返回的是香港的 CDN，这时候再指定个规则直连没什么意义；

非必要不建议使用 DoH；
> 必要指的是如中国移动这种抢答公共 DNS 的运营商

### 关于 Apple 分流

默认 Apple 分流为直连（除了被动或主动屏蔽的那些，所以 Apple.list 放在 Global.list 之后），所以如果想完全走代理可以将 `RULE-SET,Apple.list` 修改为代理策略。

但若想 Apple 只要国内全走直连只要国外全走代理可将 `RULE-SET,Apple.list` 注释或移除，**前提是 Apple 相关域名仅使用国内 DNS**。