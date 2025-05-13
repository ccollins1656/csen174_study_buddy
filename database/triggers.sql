/* Triggers*/

DROP TRIGGER IF EXISTS remove_friend_request
@delimiter %%%
CREATE TRIGGER remove_friend_request
	AFTER UPDATE ON friend_request
    FOR EACH ROW BEGIN
		IF NEW.response = 1 THEN 
			CALL add_friend(NEW.user1, NEW.user2);
		END IF;
		CALL delete_friend_req(NEW.user1, NEW.user2);
	END;
%%%
@delimiter ;
