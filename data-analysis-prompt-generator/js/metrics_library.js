/**
 * 常用指标库（自动从 KMS 抓取）
 * 来源：https://kms.fineres.com/pages/viewpage.action?pageId=1431797954
 * 标题：新产品常用指标库
 * 版本：18
 * 抓取时间：2026-06-30T02:57:13.725Z
 *
 * 如需更新，请运行：node backend/fetch_metrics_library.js
 */
const METRICS_LIBRARY = {
  "source": {
    "pageId": "1431797954",
    "title": "新产品常用指标库",
    "version": 18,
    "url": "https://kms.fineres.com/pages/viewpage.action?pageId=1431797954",
    "fetchedAt": "2026-06-30T02:57:13.725Z"
  },
  "summary": [
    {
      "module": "业绩分析",
      "content": "业绩汇总",
      "dimensions": "整体、战区、小组、销售",
      "metrics": "目标完成率、业绩、业绩年同比、预计全年业绩完成率"
    },
    {
      "module": "线索分析",
      "content": "线索汇总",
      "dimensions": "整体、战区、小组、销售、线索等级",
      "metrics": "线索数、销售处理线索数、线索处理周期、转客户线索数、线索转客户率"
    },
    {
      "module": "机会分析",
      "content": "机会概况",
      "dimensions": "整体、战区、小组、销售、机会状态、产品线",
      "metrics": "机会数、机会金额、机会概率金额、机会成单率"
    },
    {
      "module": "合同分析",
      "content": "合同汇总",
      "dimensions": "架构-战区、架构-小组、架构-销售、时间-年、时间-月、时间-日、 产品线、客群、一级行业、二级行业、三级行业、月份、订阅方式",
      "metrics": "合同额、合同数、客户数"
    },
    {
      "module": "回款分析",
      "content": "回款明细",
      "dimensions": "整体、战区、小组、销售",
      "metrics": "已回款金额、待回款金额、已到期金额"
    },
    {
      "module": "客户分析",
      "content": "客户汇总",
      "dimensions": "",
      "metrics": "产品覆盖、今年商务覆盖情况"
    },
    {
      "module": "人效分析",
      "content": "能力意愿",
      "dimensions": "整体、战区、小组、销售",
      "metrics": "人员能力评分、人员意愿评分，投产比"
    },
    {
      "module": "商务行程分析",
      "content": "",
      "dimensions": "商务记录数、现场商务记录数、非现场商务记录数",
      "metrics": ""
    }
  ],
  "details": [
    {
      "module": "业绩分析",
      "metrics": [
        {
          "metric": "业绩",
          "description": "",
          "formula": "销售额-D",
          "example": "26年业绩，指26年1月1日到昨天的销售额-D"
        },
        {
          "metric": "目标完成率",
          "description": "业绩对比目标完成情况",
          "formula": "销售额-D/目标",
          "example": "26年全年目标完成率 = 26年销售额-D/26年全年总目标  26年1-6月时序完成率 = 26年1-6月销售额-D/26年1-6月总目标"
        },
        {
          "metric": "业绩年同比",
          "description": "对比去年同期",
          "formula": "今年销售额-D/去年同期销售额-D -1",
          "example": "26年业绩年同比 = 26年YTD销售额-D/25年同周期销售额-D -1"
        },
        {
          "metric": "预计全年业绩完成率",
          "description": "当前销售额-D+对应产品机会概率金额",
          "formula": "（今年销售额-D+对应产品机会概率金额）/目标",
          "example": "26年JDY预计全年目标完成率 =（ 26年销售额-D+JDY当前跟进中且机会预计成交时间在今年的机会概率金额）/26年全年总目标"
        }
      ]
    },
    {
      "module": "线索分析",
      "metrics": [
        {
          "metric": "线索数",
          "description": "",
          "formula": "线索ID去重统计",
          "example": ""
        },
        {
          "metric": "销售处理线索数",
          "description": "销售处理过的线索数量",
          "formula": "线索处理完成时间 非空的线索数",
          "example": ""
        },
        {
          "metric": "线索处理周期",
          "description": "销售处理线索用时",
          "formula": "销售验证周期",
          "example": ""
        },
        {
          "metric": "转客户线索数",
          "description": "线索能建名片或关联到客户名片",
          "formula": "线索对应公司ID 非空的线索数",
          "example": ""
        },
        {
          "metric": "线索转客户率",
          "description": "",
          "formula": "转客户率=客户线索数/线索数",
          "example": ""
        }
      ]
    },
    {
      "module": "机会分析",
      "metrics": [
        {
          "metric": "机会数",
          "description": "",
          "formula": "机会ID去重统计",
          "example": "JDY机会数，取【是否包含JDY】=\"是\""
        },
        {
          "metric": "机会金额",
          "description": "",
          "formula": "机会金额",
          "example": "JDY机会金额，取【JDY产品预计机会金额】"
        },
        {
          "metric": "机会概率金额",
          "description": "",
          "formula": "机会概率金额",
          "example": "JDY机会概率金额，取【机会JDY产品概率金额】"
        },
        {
          "metric": "机会成单率",
          "description": "关闭机会中成功签单机会占比",
          "formula": "机会成单率=成功签单机会数/关闭机会数",
          "example": "26年关闭机会机会成单率=26年成功签单关闭机会数/26年关闭机会数"
        }
      ]
    },
    {
      "module": "合同分析",
      "metrics": [
        {
          "metric": "签单客户数",
          "description": "",
          "formula": "select count(distinct 公司ID)  from 【新产品】明细-合同&标的(1个合同多条数据)",
          "example": "26年JDY产品合同客户数 :  select count(distinct 公司ID)  from 【新产品】明细-合同&标的(1个合同多条数据)  where  year(签单时间)=\"2026\" and 产品线=\"简道云\"  and 一级分类=\"产品 \""
        },
        {
          "metric": "合同数",
          "description": "",
          "formula": "select count(distinct 合同ID)  from 【新产品】明细-合同&标的(1个合同多条数据)",
          "example": "26年JDY产品合同客户数 :  select count(distinct 合同ID)  from 【新产品】明细-合同&标的(1个合同多条数据)  where  year(签单时间)=\"2026\" and 产品线=\"简道云\"  and 一级分类=\"产品 \""
        },
        {
          "metric": "合同额",
          "description": "",
          "formula": "select sum(产品合同额)  from 【新产品】明细-合同&标的(1个合同多条数据)",
          "example": "26年JDY产品合同额 :  select sum(产品合同额)  from 【新产品】明细-合同&标的(1个合同多条数据)  where  year(签单时间)=\"2026\" and 产品线=\"简道云\"  and 一级分类=\"产品 \""
        }
      ]
    },
    {
      "module": "回款分析",
      "metrics": [
        {
          "metric": "应回款金额",
          "description": "",
          "formula": "select sum(财务记录金额)  from 【新产品】明细-回款",
          "example": ""
        },
        {
          "metric": "已回款金额",
          "description": "",
          "formula": "select sum(财务记录金额)  from 【新产品】明细-回款  where 收款状态=\"已回款\"",
          "example": ""
        },
        {
          "metric": "待回款金额",
          "description": "",
          "formula": "select sum(财务记录金额)  from 【新产品】明细-回款  where 收款状态  in (\"已到期\"，\"待收款\"）",
          "example": ""
        }
      ]
    }
  ]
};
