# 匿名留言板
---

![](https://i.imgur.com/hy5KIoR.jpg)


有使用到的 table 有 5 個，分別是
1. users -> 記錄 user 的帳號密碼
2. user_post_histories -> 紀錄 user 過去的 posts
3. user_comment_histories -> 紀錄 user 過去的 comments
4. posts -> 紀錄所有的 posts
5. comments -> 紀錄所有的 comments




---

## 設計原則

1. 考慮資料的價值有差別，對五張表資料的價值做排序

users >  user_post_histories >= user_comment_histories  > 
 posts >= comments 

系統儲存的資料只有 account 可能會洩露出使用的的資訊  
資料價值愈高的 table 愈能揭露出關於使用者的資訊

2. 在保護使用者資訊的情況下，還需要能辨識出相同的使用者

3. 為 app 開發者做防呆

---

## Signature

使用 hash(postId, userId, salt)
1. 在相同的 post 下，相同的 user 會有相同的 signature
2. 在不同的 post 下，相同的 user 會有不同的 signature


**{ user_id, post_id, commnet_id } 由 uuid v4 產生**
**signature = hash(postId, userId, salt)**



**可以避免辨識出特定 user 曾經在那些 post 發表過 comment**  
**且能保持在同一篇 post 辨識出是否為同一個 user 的 comment**

---

## 功能模組

### 1. ACCESSOR

分為 auth、comment、login、post、register、userHistory
負責操作 DB，以 ORM (sequelize) 操作
每個 method 都是無法再分割的單元

例如:
新增 post 時，就只會在資料庫新增 



### 2. 業務邏輯

負責高層次的商業邏輯
例如:新增 post 時

	同時會在 user_post_histories 與 posts 新增紀錄

或是以刪除一個 post 為例

	有以下的規則:
	1. post 的 creator 才可以刪除
	2. 刪除 post
	3. 刪除 user 的 post histories
	4. 刪除 post 的 comments
	5. 刪除被刪除的 comments 的 user histories

	根據資料庫的 constraint，調整刪除順序
	1. 檢查是否為 post 的 creator
	2. 刪除 user 的 post histories
	3. 刪除被刪除的 comments 的 user histories
	4. 刪除 post 的 comments
	5. 刪除 post
