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