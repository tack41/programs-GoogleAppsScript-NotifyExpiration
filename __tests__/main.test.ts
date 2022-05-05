import { succeededSV14 } from "../build/main";

describe('succeeded関数', () => {
  it('成功した時のCSV', () => {
    const csvString = `

"ジョブ ステータス レポート - 2022/04/26 7:00:48 - UTC+09:00 (日本標準時) "
"このレポートにはコンソールで実行されたすべてのジョブの種類の完全なステータスが表示されます。 このレポートを監査で使用することができます。"
"ノード名 ","ステータス すべて","過去 1 日 ","ジョブの種類 すべて","プラン名 "

"ジョブ ステータス","ジョブ ID","ジョブの種類","ノード名","プラン名","生成元","ソース","デスティネーション","開始時刻","終了時刻","期間","保護されているデータ","使用されているストレージ"
"成功","4682","バックアップ","skgrp-sv12nev.sakurai-grp.co.jp","SV12","skgrp-sv12nev.sakurai-grp.co.jp","N/A","\\skgrp-sv02bu\ArcserveBackup\SKGRP-SV12NEV","2022/04/26 2:00:03","2022/04/26 2:03:49","0:3:45","9.24 GB","6.33 GB"
"成功","4683","カタログ","skgrp-sv12nev.sakurai-grp.co.jp","SV12","skgrp-sv12nev.sakurai-grp.co.jp","N/A","N/A","2022/04/26 2:03:58","2022/04/26 2:41:53","0:37:54","N/A","N/A"
"成功","4684","マージ","skgrp-sv12nev.sakurai-grp.co.jp","SV12","skgrp-sv12nev.sakurai-grp.co.jp","N/A","N/A","2022/04/26 2:42:10","2022/04/26 2:44:49","0:2:39","N/A","N/A"
"成功","4724","バックアップ","skgrp-sv17nev.sakurai-grp.co.jp","SV17","skgrp-sv17nev.sakurai-grp.co.jp","N/A","\\skgrp-sv02bu\ArcserveBackup\SKGRP-SV17NEV","2022/04/26 3:00:02","2022/04/26 3:03:20","0:3:17","14.68 GB","4.40 GB"
"成功","4725","カタログ","skgrp-sv17nev.sakurai-grp.co.jp","SV17","skgrp-sv17nev.sakurai-grp.co.jp","N/A","N/A","2022/04/26 3:03:28","2022/04/26 3:09:55","0:6:26","N/A","N/A"
"成功","4726","マージ","skgrp-sv17nev.sakurai-grp.co.jp","SV17","skgrp-sv17nev.sakurai-grp.co.jp","N/A","N/A","2022/04/26 3:10:12","2022/04/26 3:11:13","0:1:1","N/A","N/A"
"成功","4711","バックアップ","skgrp-sv18nev.sakurai-grp.co.jp","SV18","skgrp-sv18nev.sakurai-grp.co.jp","N/A","\\skgrp-sv02bu\ArcserveBackup\SKGRP-SV18NEV","2022/04/26 4:00:02","2022/04/26 4:02:15","0:2:12","1.87 GB","1.07 GB"
"成功","4712","カタログ","skgrp-sv18nev.sakurai-grp.co.jp","SV18","skgrp-sv18nev.sakurai-grp.co.jp","N/A","N/A","2022/04/26 4:02:24","2022/04/26 4:08:48","0:6:24","N/A","N/A"
"成功","4713","マージ","skgrp-sv18nev.sakurai-grp.co.jp","SV18","skgrp-sv18nev.sakurai-grp.co.jp","N/A","N/A","2022/04/26 4:09:06","2022/04/26 4:10:18","0:1:12","N/A","N/A"

"ステータス","カウント"
"失敗","0.0"
"キャンセル","0.0"
"未完了","0.0"
"未実行","0.0"
"成功","9.0"



`;
    const csvArray: string[][] = parse(csvString, {
      columns: false,
      skip_empty_lines: false,
      relax_column_count: true
    });

    expect(succeededSV14(csvArray)).toBe(true);
  });

  it('失敗した時のCSV', () => {
    const csvString = `
"ジョブ ステータス レポート - 2022/03/17 17:31:27 - UTC+09:00 (日本標準時) "
"このレポートにはコンソールで実行されたすべてのジョブの種類の完全なステータスが表示されます。 このレポートを監査で使用することができます。"
"ノード名 ","ステータス すべて","過去 1 日 ","ジョブの種類 すべて","プラン名 "

"ジョブ ステータス","ジョブ ID","ジョブの種類","ノード名","プラン名","生成元","ソース","デスティネーション","開始時刻","終了時刻","期間","保護されているデータ","使用されているストレージ"
"成功","1233","バックアップ","skgrp-sv22ne.sakurai-grp.co.jp","SKGRP-SV22NE","skgrp-sv22ne.sakurai-grp.co.jp","N/A","\\skgrp-sv15bu\ArcserveBackup\SKGRP-SV22NE","2022/03/17 1:00:02","2022/03/17 1:06:22","0:6:20","29.65 GB","10.02 GB"
"成功","1234","カタログ","skgrp-sv22ne.sakurai-grp.co.jp","SKGRP-SV22NE","skgrp-sv22ne.sakurai-grp.co.jp","N/A","N/A","2022/03/17 1:06:31","2022/03/17 1:10:01","0:3:29","N/A","N/A"
"成功","1235","マージ","skgrp-sv22ne.sakurai-grp.co.jp","SKGRP-SV22NE","skgrp-sv22ne.sakurai-grp.co.jp","N/A","N/A","2022/03/17 1:10:17","2022/03/17 1:11:13","0:0:55","N/A","N/A"
"成功","4562","バックアップ","skgrp-sv12nev.sakurai-grp.co.jp","SV12","skgrp-sv12nev.sakurai-grp.co.jp","N/A","\\192.168.1.21\ArcserveBackup\SKGRP-SV12NEV","2022/03/17 2:00:03","2022/03/17 2:03:49","0:3:46","9.03 GB","6.20 GB"
"成功","4563","カタログ","skgrp-sv12nev.sakurai-grp.co.jp","SV12","skgrp-sv12nev.sakurai-grp.co.jp","N/A","N/A","2022/03/17 2:03:58","2022/03/17 2:40:01","0:36:3","N/A","N/A"
"成功","4564","マージ","skgrp-sv12nev.sakurai-grp.co.jp","SV12","skgrp-sv12nev.sakurai-grp.co.jp","N/A","N/A","2022/03/17 2:40:18","2022/03/17 2:43:17","0:2:58","N/A","N/A"
"成功","4595","バックアップ","skgrp-sv17nev.sakurai-grp.co.jp","SV17","skgrp-sv17nev.sakurai-grp.co.jp","N/A","\\skgrp-sv02bu\ArcserveBackup\SKGRP-SV17NEV","2022/03/17 3:00:02","2022/03/17 3:03:54","0:3:51","14.11 GB","4.11 GB"
"成功","4596","カタログ","skgrp-sv17nev.sakurai-grp.co.jp","SV17","skgrp-sv17nev.sakurai-grp.co.jp","N/A","N/A","2022/03/17 3:04:03","2022/03/17 3:14:51","0:10:47","N/A","N/A"
"失敗","4597","マージ","skgrp-sv17nev.sakurai-grp.co.jp","SV17","skgrp-sv17nev.sakurai-grp.co.jp","N/A","N/A","2022/03/17 3:15:08","2022/03/17 3:15:24","0:0:15","N/A","N/A"
"成功","4585","バックアップ","skgrp-sv18nev.sakurai-grp.co.jp","SV18","skgrp-sv18nev.sakurai-grp.co.jp","N/A","\\192.168.1.21\ArcserveBackup\SKGRP-SV18NEV","2022/03/17 4:00:02","2022/03/17 4:02:26","0:2:23","2.43 GB","1.28 GB"
"成功","4586","カタログ","skgrp-sv18nev.sakurai-grp.co.jp","SV18","skgrp-sv18nev.sakurai-grp.co.jp","N/A","N/A","2022/03/17 4:02:35","2022/03/17 4:09:11","0:6:36","N/A","N/A"
"成功","4587","マージ","skgrp-sv18nev.sakurai-grp.co.jp","SV18","skgrp-sv18nev.sakurai-grp.co.jp","N/A","N/A","2022/03/17 4:09:28","2022/03/17 4:10:49","0:1:21","N/A","N/A"
"成功","4598","バックアップ","skgrp-sv17nev.sakurai-grp.co.jp","SV17","skgrp-sv17nev.sakurai-grp.co.jp","N/A","\\skgrp-sv02bu\ArcserveBackup\SKGRP-SV17NEV","2022/03/17 10:44:46","2022/03/17 10:47:01","0:2:14","2.15 GB","1.10 GB"
"成功","4599","カタログ","skgrp-sv17nev.sakurai-grp.co.jp","SV17","skgrp-sv17nev.sakurai-grp.co.jp","N/A","N/A","2022/03/17 10:47:11","2022/03/17 10:54:40","0:7:29","N/A","N/A"
"成功","4600","マージ","skgrp-sv17nev.sakurai-grp.co.jp","SV17","skgrp-sv17nev.sakurai-grp.co.jp","N/A","N/A","2022/03/17 10:54:55","2022/03/17 10:56:34","0:1:38","N/A","N/A"

"ステータス","カウント"
"失敗","1.0"
"キャンセル","0.0"
"未完了","0.0"
"未実行","0.0"
"成功","14.0"
`;
    const csvArray: string[][] = parse(csvString, {
      columns: false,
      skip_empty_lines: false,
      relax_column_count: true,
    });

    expect(succeededSV14(csvArray)).toBe(false);
  });
})