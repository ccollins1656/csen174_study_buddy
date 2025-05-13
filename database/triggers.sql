/* Triggers*/

DROP TRIGGER IF EXISTS remove_friend_request
@delimiter %%%
CREATE TRIGGER remove_friend_request
	AFTER UPDATE ON friend_request
    FOR EACH ROW BEGIN
		IF response = 1 THEN 
			CALL add_friend(OLD.user1, OLD.user2);
		ELSE
			CALL delete_friend_req(OLD.user1, OLD.user2);
		END IF;
	END;
%%%
@delimiter ;
