CREATE INDEX user_id_index ON user(user_id) USING BTREE;
CREATE INDEX dm_index ON direct_message(sending_user_id) USING BTREE;
CREATE INDEX dm_index2 ON direct_message(receiving_user_id) USING BTREE;
CREATE INDEX forum_message_index ON forum_message(class_name) USING BTREE;
CREATE INDEX joined_index ON joined_forum(user_id) USING BTREE;

CREATE VIEW user_view(user_id,
	display_name,
	email,
	join_time)
	AS SELECT user.user_id, user.display_name, user.email, user.join_time
    FROM user;
