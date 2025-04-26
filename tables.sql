drop database if exists coen174;
create database coen174;
use coen174;

drop table if exists user;
create table user(
	user_id varchar(10) not null,
    display_name varchar(20) not null,
    email varchar(40) not null,
    password varchar(100) not null,
    
    primary key(user_id),
    unique(handle),
    unique(email)
);

drop table if exists forum;
create table forum(
	class_name varchar(10) not null,
    
    primary key(class_name)
    
);

drop table if exists joined_forum;
create table joined_forum(
	user_id varchar(10) not null,
    class_name varchar(10) not null,
    
    primary key(user_id, class_name),
    foreign key(user_id) references user(user_id) on delete cascade,
    foreign key(class_name) references forum(class_name) on delete cascade
);
