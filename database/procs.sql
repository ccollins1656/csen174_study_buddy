DROP PROCEDURE IF EXISTS insert_into_user;
@delimiter %%%
CREATE PROCEDURE insert_into_user(IN in_user_id VARCHAR(10), IN in_display_name VARCHAR(20), 
IN in_email VARCHAR(40), IN in_password VARCHAR(64), IN in_salt VARCHAR(64), 
IN in_join_time DATETIME)
BEGIN
	INSERT INTO user (user_id, display_name, email, password, join_time)
    VALUES (in_user_id, in_display_name, in_email, in_password, in_join_time);
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
