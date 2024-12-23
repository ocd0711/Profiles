/******************************
/******************************
Loon 修复 vvebo 用户主页的显示脚本
参考：https://raw.githubusercontent.com/suiyuran/stash/main/override/fix-vvebo.stoverride
2024-10-02：Derived from QX Script

*****************************************/

let url = $request.url;
let hasUid = (url) => url.includes("uid");
let getUid = (url) => (hasUid(url) ? url.match(/uid=(\d+)/)[1] : undefined);

if (url.includes("users/show")) {
  $persistentStore.write(getUid(url), "weibouid");
  $done({});
} else if (url.includes("profile/statuses/tab")) {
  try {
    let data = JSON.parse($response.body);
    let statuses = data.cards
      .map((card) => (card.card_group ? card.card_group : card))
      .flat()
      .filter((card) => card.card_type === 9)
      .map((card) => card.mblog)
      .map((status) =>
        status.isTop
          ? {
              ...status,
              label: "置顶",
            }
          : status
      );
    let sinceId = data.cardlistInfo.since_id;
    $done({
      body: JSON.stringify({
        statuses,
        since_id: sinceId,
        total_number: 100,
      }),
    });
  } catch {
    console.log("修正失败，请联系GitHub：bin64 ");
  }
} else if (url.includes("statuses/user_timeline")) {
  let uid = getUid(url) || $persistentStore.read("weibouid");
  url = url
    .replace("statuses/user_timeline", "profile/statuses/tab")
    .replace("max_id", "since_id");
  url = url + `&containerid=230413${uid}_-_WEIBO_SECOND_PROFILE_WEIBO`;
  $done({
    url,
  });
} else {
  $done({});
}
