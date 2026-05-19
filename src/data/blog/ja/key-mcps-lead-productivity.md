---
title: "[JA] 重要なMCPを使用してリードとしてのタスク時間を削減する"
author: Daniel Artola
pubDatetime: 2026-03-24T21:00:00Z
slug: key-mcps-lead-productivity-ja
featured: false
draft: false
tags:
  - mcp
  - productivity
  - ai
  - lead
  - ja
lang: ja
description: Datadog、Amplitude、Excalidraw、Miroなどのさまざまなモデルコンテキストプロトコル（MCP）を使用して、リードとしてのタスクの時間を節約する方法。
---

## はじめに

リードとして、投資する時間を劇的に減らすことができたタスクがいくつかあります。

モニターの分析、アラートの最適化、インシデントの調査、レポート/ノートブックの作成、図の作成、矛盾の発見と解決...これらの多くは、いくつかの重要なMCPを使用したおかげです。ここではその方法をお話しします。

はい、MCPを使用するかどうかの論争を超えて。これらは依然としてツールであり、AIを使用したすべてのものと同様に、特定のケースで知識を持って使用する分には問題はないはずです。チェーンソーを使ってトゲを削るようなことをせず、さらに説明書を読まずに使用しなければの話ですが。

私がよく使用するMCPはいくつかあります：Atlassian、Context7、Playwright...しかし、それほど頻繁には使用しないものの、特定の状況で非常に役立つその他のリストをここに示します。

## 特定のケースのための私のMCP

### Datadog MCP

これを使うと、本番環境でのエラーを分析し、マイクロサービスでのアラートとモニターを分析・改善し、Amplitudeのデータと比較したエラーレポートを作成することもできました。これが次のケースにつながります。

![Datadog Analysis Example](../../../assets/images/blog/datadog-analysis.jpg)

### Amplitude MCP

Amplitudeについては、私は水から出た魚のようなものです。理解はしていますが、マスターはしていません。MCPのおかげで、ノートブックを作成し、データを分析し、急激な低下や急増から結論を引き出すことができました。DatadogのMCPと組み合わせることで、より広い視野を持つことが容易になります。

![Amplitude Dashboard](../../../assets/images/blog/amplitude-dashboard.jpg)

### Excalidraw MCP

すべてがmermaidである必要はありません。時には、すばやく簡単にものを追加および削除できるようにしたい場合があります。これは、アーキテクチャマップや特定の機能を生成し、それらを組み合わせたり、ドキュメントで使用したり、単にアイデアを説明したりするのに役立ちます。さらに、ファイルを生成したり、それを表示するためのリンクを生成したりできます。ただし注意してください、アーキテクチャを公開リンクで公開しないでください。

![Excalidraw Map Example](../../../assets/images/blog/excalidraw-map.jpg)

### Miro MCP

これを使って図を作成したり、コードを作成したりすることもできますが、私が最も活用しているのは、Miroの巨大な図（ダンジョンズ＆ドラゴンズのボードのように見える種類のもの）の情報をConfluenceのドキュメントやコードと比較し、不一致を見つけることです。これにより、ブロッカー、問題、および決定の曖昧さを予測できます。

## 結論とリンク

ここで言及したものはすべて、それぞれの企業からの公式なものであり、追加のセキュリティ層を提供します。もちろん、トークンは自腹なので、使用を最適化してください。

言及されたMCPの公式リンク：

- [Datadog MCP](https://docs.datadoghq.com/en/bits_ai/mcp_server/)
- [Amplitude MCP](https://amplitude.com/docs/amplitude-ai/amplitude-mcp)
- [Excalidraw MCP](https://github.com/excalidraw/excalidraw-mcp)
- [Miro MCP](https://developers.miro.com/docs/miro-mcp)
