drop database if exists coen174;
create database coen174;
use coen174;

drop table if exists user;
create table user(
	user_id varchar(10) not null,
    display_name varchar(20) not null,
    email varchar(40) not null,
    password varchar(64) not null,
    salt varchar(64) not null,
    join_time DATETIME,
    
    primary key(user_id),
    unique(display_name),
    unique(email)
);

drop table if exists forum;
create table forum(
	class_name varchar(10) not null,
    
    primary key(class_name)
    
);

drop table if exists groupList;
create table groupList(
	group_name varchar(40) not null,
    class_name varchar(10) not null,
    meeting_time varchar(40) not null,
    meeting_place varchar(40) not null,
    
    primary key (group_name, class_name),
    foreign key (class_name) references forum(class_name) on delete cascade
);

drop table if exists groupMembers;
create table groupMembers(
    user_id varchar(10) not null,
	group_name varchar(40) not null,
    class_name varchar(10) not null,
    
	primary key(user_id, group_name, class_name),
	foreign key (user_id) references user(user_id) on delete cascade,
    foreign key (group_name) references groupList(group_name) on delete cascade,
    foreign key (class_name) references forum(class_name) on delete cascade
);

drop table if exists joined_forum;
create table joined_forum(
	user_id varchar(10) not null,
    class_name varchar(10) not null,
    
    primary key(user_id, class_name),
    foreign key(user_id) references user(user_id) on delete cascade,
    foreign key(class_name) references forum(class_name) on delete cascade
);

drop table if exists forum_message;
create table forum_message(
	user_id varchar(10),
	class_name varchar(10),
	timestamp datetime not null,
	text varchar(256) not null,

	primary key(user_id, class_name, timestamp),
	foreign key(user_id) references user(user_id) on delete cascade,
	foreign key(class_name) references forum(class_name) on delete cascade
);

drop table if exists direct_message;
create table direct_message(
	sending_user_id varchar(10) not null,
	receiving_user_id varchar(10) not null,
	timestamp datetime not null,
	text varchar(256) not null,

	primary key(sending_user_id, receiving_user_id, timestamp),
	foreign key(sending_user_id) references user(user_id) on delete cascade,
	foreign key(receiving_user_id) references user(user_id) on delete cascade
);

drop table if exists friends;
create table friends(
	user1 varchar(10),
	user2 varchar(10),

	primary key(user1, user2),
	foreign key(user1) references user(user_id) on delete cascade,
	foreign key(user2) references user(user_id) on delete cascade
);

drop table if exists friend_request;
create table friend_request(
	user1 varchar(10),
	user2 varchar(10),
    create_time DATETIME,
	response tinyint(2) not null,

	primary key(user1, user2, response),
	foreign key(user1) references user(user_id) on delete cascade,
	foreign key(user2) references user(user_id) on delete cascade
)
