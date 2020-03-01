drop database if exists orel_codes;

create database orel_codes;

use orel_codes;

create table users(
	id integer not null auto_increment,
	name varchar(100) not null,
	primary key (id)
);

create table messages(
	id integer not null,
	txt text not null,
	user_id integer not null,
	is_reply tinyint not null,
	dt date not null,
	is_joined tinyint not null,
	is_forward tinyint not null,
	stickers_cnt integer not null,
	photos_cnt integer not null,
	video_cnt integer not null,
	prev_msg_id integer,
	primary key (id),

	index(user_id),
	foreign key (user_id)
	references users(id)
	on update cascade on delete restrict
);

create table links(
	id integer not null auto_increment,
	href varchar(4000) not null,
	host varchar(1000),
	txt varchar(4000) not null,
	message_id integer,

	primary key (id),
	
	index(message_id),
	
	foreign key (message_id)
  references messages(id)
  on update cascade on delete restrict
);

create table codes(
	id integer not null auto_increment,
	code text not null,
	message_id integer not null,

	primary key (id),
	
	index(message_id),
	
	foreign key (message_id)
  references messages(id)
  on update cascade on delete restrict
);