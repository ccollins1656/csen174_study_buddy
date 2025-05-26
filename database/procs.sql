SET GLOBAL event_scheduler = ON;
SET @@global.event_scheduler = ON;
SET GLOBAL event_scheduler = 1;
SET @@global.event_scheduler = 1;

DROP PROCEDURE IF EXISTS insert_into_user;
@delimiter %%%
CREATE PROCEDURE insert_into_user(IN in_user_id VARCHAR(10), IN in_display_name VARCHAR(20), 
IN in_email VARCHAR(40), IN in_password VARCHAR(64), IN in_salt VARCHAR(64), 
IN in_join_time DATETIME)
BEGIN
	INSERT INTO user (user_id, display_name, email, password, salt, join_time)
    VALUES (in_user_id, in_display_name, in_email, in_password, in_salt, in_join_time);
END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS delete_from_user;
@delimiter %%%
CREATE PROCEDURE delete_from_user(IN in_user_id VARCHAR(9))
	BEGIN
		DELETE FROM user WHERE user.user_id = in_user_id;
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS create_group;
@delimiter %%%
CREATE PROCEDURE create_group(in in_group_name varchar(40), in_class_name varchar(10))
BEGIN
	INSERT INTO groupList(group_name, class_name)
	VALUES (in_group_name, in_class_name);
END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS join_group;
@delimiter %%%
CREATE PROCEDURE join_group(in in_user_id varchar(10), in in_group_name varchar(40))
BEGIN
	INSERT INTO groupMembers(user_id, group_name)
	VALUES (in_user_id, in_group_name);
END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS leave_group;
@delimiter %%%
CREATE PROCEDURE leave_group(in in_user_id varchar(10), in in_group_name varchar(40))
BEGIN
	DELETE FROM groupMembers
    WHERE user_id = in_user_id
    AND group_name = in_group_name;
END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS find_groups;
@delimiter %%%
CREATE PROCEDURE find_groups(in in_class_name varchar(10))
BEGIN
	SELECT group_name FROM groupMembers
    WHERE class_name = in_class_name;
END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS find_group_members;
@delimiter %%%
CREATE PROCEDURE find_group_members(in in_group_name varchar(40))
BEGIN
	SELECT user_id FROM groupMembers
    WHERE group_name = in_group_name;
END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS list_groups;
@delimiter %%%
CREATE PROCEDURE list_groups()
BEGIN
	SELECT * FROM groupList;
END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS create_forum;
@delimiter %%%
CREATE PROCEDURE create_forum(in in_class_name varchar(10))
BEGIN
	INSERT INTO forum(in_class_name)
	VALUES (class_name);
END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS send_direct_message;
@delimiter %%%
CREATE PROCEDURE send_direct_message(in in_sending_user_id varchar(10), in_receiving_user_id varchar(10),
	in_timestamp datetime, in_text varchar(256))
	BEGIN
		INSERT INTO direct_message(sending_user_id, receiving_user_id, timestamp, text) 
		VALUES (in_sending_user_id, in_receiving_user_id, in_timestamp, in_text);
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS add_friend_request;
@delimiter %%%
CREATE PROCEDURE add_friend_request(in in_sending_user_id varchar(10), in_receiving_user_id varchar(10), in in_create_time DATETIME,
	in_response tinyint(2))
	BEGIN
		
		SET in_response = IFNULL(in_response, 0);
		INSERT INTO friend_request(user1, user2, create_time, response)
		VALUES (in_sending_user_id, in_receiving_user_id, in_create_time, in_response);
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS add_friend;
@delimiter %%%
CREATE PROCEDURE add_friend(in in_sending_user_id varchar(10), in_receiving_user_id varchar(10))
	BEGIN
		INSERT INTO friends (user1, user2)
        VALUES (in_sending_user_id, in_receiving_user_id);
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS delete_friend_req;
@delimiter %%%
CREATE PROCEDURE delete_friend_req(in in_user1 varchar(10), in_user2 varchar(10))
	BEGIN
		DELETE FROM friend_request
        WHERE user1 = in_user1
        AND user2 = in_user2;
	END;
%%%
@delimiter ;


DROP PROCEDURE IF EXISTS get_user_by_email;
@delimiter %%%
CREATE PROCEDURE get_user_by_email(in user_email varchar(40))
	BEGIN
		SELECT * FROM user
        WHERE email = user_email;
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS get_num_users;
@delimiter %%%
CREATE PROCEDURE get_num_users(out num_users int)
	BEGIN
		SELECT COUNT(*) FROM user_view;
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS send_forum_message;
@delimiter %%%
CREATE PROCEDURE send_forum_message (in in_user_id varchar(10), in_class_name varchar(10), in_timestamp DATETIME, in_text varchar(256))
	BEGIN
		INSERT INTO forum_message(user_id, class_name, timestamp, text)
        VALUES (in_user_id, in_class_name, in_timestamp, in_text);
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS get_messages_by_class;
@delimiter %%%
CREATE PROCEDURE get_messages_by_class(in in_class_name varchar(10), in_timestamp datetime)
	BEGIN
		SELECT * FROM forum_message
        WHERE class_name = in_class_name
        AND timestamp < in_timestamp
        order by timestamp desc limit 50;
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS get_direct_messages;
@delimiter %%%
CREATE PROCEDURE get_direct_messages(in in_user1 varchar(10), in_user2 varchar(10), in_timestamp datetime)
	BEGIN
		SELECT * FROM direct_messages
        WHERE timestamp < in_timestamp
        AND (sending_user_id = in_user1
        AND receiving_user_id = in_user2)
        OR (sending_user_id = in_user2
        AND receiving_user_id = in_user1)
        order by timestamp desc limit 50;
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS get_users_in_forum;
@delimiter %%%
CREATE PROCEDURE get_users_in_forum(in in_class_name varchar(10))
	BEGIN
		SELECT U.display_name FROM user U
        WHERE U.user_id = 
			(SELECT user_id FROM joined_forum
				WHERE class_name = in_class_name);
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS drop_user_from_course;
@delimiter %%%
CREATE PROCEDURE drop_user_from_course (in in_user_id varchar(10), in_class_name varchar(10))
	BEGIN
		DELETE FROM joined_forum
        WHERE user_id = in_user_id
        AND class_name = in_class_name;
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS get_user_forums;
@delimiter %%%
CREATE PROCEDURE get_users_forums(in in_user_id varchar(10))
	BEGIN
		SELECT class_name FROM joined_forum
        WHERE user_id = in_user_id;
	END;
%%%
@delimiter ;

DROP EVENT IF EXISTS clear_friend_requests;
@delimiter %%%
CREATE EVENT clear_friend_requests
	ON SCHEDULE EVERY 1 DAY
    STARTS '2025-05-07 00:03:00' ON COMPLETION PRESERVE ENABLE
    DO BEGIN
		DELETE FROM friend_request
        WHERE create_time < DATE_SUB(NOW(), INTERVAL 1 DAY);
    END;
%%%
@delimiter ;

