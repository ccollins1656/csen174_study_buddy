DROP PROCEDURE IF EXISTS insert_into_user;
@delimiter %%%
CREATE PROCEDURE insert_into_user(IN in_user_id VARCHAR(10), IN in_display_name VARCHAR(20), 
IN in_email VARCHAR(40), IN in_password VARCHAR(32), IN in_salt VARCHAR(32), 
IN in_join_time DATETIME)
BEGIN
	INSERT INTO user (user_id, display_name, email, password, join_time)
    VALUES (in_user_id, in_display_name, in_email, in_password, in_join_time);
END;
%%%
@delimiter ;

DROP PROCEDURE IF EXISTS create_forum;
@delimiter %%%
CREATE PROCEDURE create_forum(in in_class_name(10))
BEGIN
	INSERT INTO forum(in_class_name)
	VALUES (class_name);
END;
%%%
@delimiter ;
