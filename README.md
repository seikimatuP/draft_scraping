# draft_scraping

## 概要
GASでプロ志望届のページをスクレイピングして学校名/志望届提出日/名前をスプレッドシートに入力する  
また、実行日ごとに高校生・大学生それぞれの合計も入力する  

前回比はシートの計算で行う  
claspを使ってGASにあげる  

## スクリプトの詳細
- draft_scraping.js  
    -> これがメインのファイル  
    -> 以下にメソッドを記載する  
    - player_list_update  
        -> ここでは、シートのアップデートを行う  
        -> 具体的に言うと、高校生と大学生のプロ志望届のスクレイピングを行い入力をする  
    - high_school_player  
        -> ここでは、高校生のプロ志望届のスクレイピングと入力を行う  
    - university_player  
        -> ここでは、大学生のプロ志望届のスクレイピングと入力を行う  
    - setTrigger  
        -> ここは、トリガーの作成を行う  
        -> デフォルトでは、平日の17時20分に実行するトリガーを作成する  
        -> 土日にプロ志望届のアップデートは行われないので、平日のみ実行する  
    - isBusinessDay  
        -> 日付の平日判定を行う  
    - sendMail  
        -> メール送信を行う  

## 使い方
0. draft_scraping.jsを落としている前提で行う  
1. 自動で入力するgoogle sheetsを作成する  
2. 入力シートの名前を現在の年に変更する
    -> 現在が2022/09/16なら、シートの名前を「2022」にする  
3. URLのd/から/editで囲まれている文字列をコピーする  
    -> 以下のURLでいうとXが並んでいるところ  
        https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit#gid=1176042870

4. 2でコピーしたものをdraft_scraping.jsのsheet_idに代入されるように書き換える  
    - 変更前  
        -> sheet_id = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'  
    - 変更後  
        -> sheet_id = '2でコピーした文字列'  

    これで動かす準備は出来た(はず...)

5. claspの導入を行う  
    コマンドプロンプトにて以下のコマンドを実行する  
    claspはプロジェクト単位ではなく、全体で使うのでグローバル(-g)でインストール  
    
    ```
    npm i @google/clasp -g
    clasp login
    ```

    ログイン前に[GAS の API 設定画面](https://script.google.com/home/usersettings)を開いてオンにする  
    ログインで google の承認画面が出てくると思うので承認する






