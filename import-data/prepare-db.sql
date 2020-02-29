drop database if exists orel_codes;

create database orel_codes;

use orel_codes;

create table users(
	id integer not null auto_increment,
	name varchar(100) not null,
	primary key (id)
);

create table links(
	href varchar(4000) not null,
	host varchar(1000) not null,
	txt varchar(4000) not null,
	message_id integer
);

create table codes(
	code text not null,
	message_id integer not null
);

create table messages(
	id integer not null,
	txt text not null,
	user_id integer not null,
	is_reply tinyint not null,
	dt date not null,
	is_joined tinyint not null,
	stickers_cnt integer not null,
	photos_cnt integer not null,
	video_cnt integer not null,
	prev_msg_id integer,
	primary key (id)
);