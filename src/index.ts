import { Context, Random, Schema, h } from "koishi";
import { getNanikiriAData, getNanikiriQData, getRandomInt } from "./util";
export const name = "majjan-nanikiri";

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

let idQNoMap = new Map<string, number>();
export function apply(ctx: Context) {
  ctx.command("何切").action(async ({ session }) => {
    if (!session) return "无法获取会话信息";
    const qDataMap = await getNanikiriQData();
    const aDataMap = await getNanikiriAData();
    let totalCnt = qDataMap.size;
    let data;
    let currentNo = idQNoMap.get(session.channelId);
    if (currentNo == 0 || currentNo == null) {
      //随机抽取一道题目
      let nanikiriNo = getRandomInt(totalCnt);
      currentNo = nanikiriNo;
      idQNoMap.set(session.channelId, currentNo);
      data = qDataMap.get(nanikiriNo);
    } else {
      //发布答案
      data = aDataMap.get(currentNo);
      currentNo = 0;
      idQNoMap.set(session.channelId, currentNo);
    }

    // 从洗好的牌组中抽取一张牌
    await session.send(`
      ${h("at", { id: session.userId })}
      ${h.image(data.picBuffer, "image/webp")}
      题号:${data.nanikiriNo}`);
  });
}
