# NotifyExpiration
Google Spreadsheetに記載した期限情報と通知前日数を元に、期限の通知前日数に達したら以降は通知し続けるGoogle Apps Scriptプロジェクトです
参照先のシートは以下の構成を想定しています。

* 1行目はタイトル業としてスキップ。２行目以降を参照する
  * A列: 管理対象名
  * B列: 有効期限
  * C列: 何時間前に通知するか(カンマ区切りで複数指定可能)
  * D列: 通知先
  * E列: 備考

## notifyByHourOneShotブランチに  ついて
notifyByDayRepeatedlyブランチ、及びそれと同期しているmainブランチは上記仕様ですが、notifyByHourOneShotブランチは別の以下の仕様となっています。
* Google Spreadsheetに記載した期限前と期限前時間をもとに、期限の通知前時間に達したら通知
  * 参照先のシートの構成
    * A列: 名称
    * B列: 有効期限
    * C列: 通知先メールアドレス
    * D列: 通知日数
    * E列: 備考

今は使っていませんが、利用するユースケースが異なり今後利用することも考えられるため、別ブランチで保存しています。

## Dependency
必須ではありませんが、[clasp](https://github.com/google/clasp)を使ってsourceを管理すると便利です。本リポジトリ内のファイルはclasp clone(pull)したファイルです。

## Setup
トリガーを設定して日次で定期的に呼び出す運用が良いでしょう。

## Usage
(特になし)

## Authors
都築(tack41@gmail.com)

## References
* 