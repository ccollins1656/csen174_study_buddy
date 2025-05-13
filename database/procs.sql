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

DROP PROCEDURE IF EXISTS add_friend;
@delimiter %%%
CREATE PROCEDURE add_friend(in in_sending_user_id varchar(10), in_receiving_user_id varchar(10),
	response tinyint(2))
	BEGIN
		SET response = IFNULL(response, 0);
		INSERT INTO friend_request(user1, user2, response)
		VALUES (in_sending_user_id, in_receiving_user_id, response);
	END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS get_user_by_email;
@delimiter %%%
CREATE PROCEDURE get_user_by_email(in user_email varchar(40))
	BEGIN
		SELECT * FROM user_view
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
        AND receiving_user_id = in_user1);
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
        WHERE create_time <= date < DATE_SUB(NOW(), INTERVAL 1 DAY);
    END
%%%
@delimiter ;

