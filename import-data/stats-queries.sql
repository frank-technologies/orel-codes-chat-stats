select u.id
     , u.name
     , count(l.href) cnt_links
     , count(c.code) cnt_codes
     , sum(char_length(m.txt)) cnt_chars
from users u
join messages m on m.user_id = u.id
	and m.is_forward = 0
left join links l on l.message_id = m.id
	and l.host is not null
    and l.host not in ('t.me', 't.co')
left join codes c on c.message_id = m.id
where u.name != 'Combot'
group by u.id
	   , u.name
order by u.name desc
;

select m.user_id
     , l.host
     , count(l.href) cnt_links
from messages m
join links l on l.message_id = m.id
where m.user_id = 4
  and l.host is not null
  and l.host not in ('t.me', 't.co')
group by m.user_id
       , l.host
order by cnt_links desc
;

select l.*
from messages m
join links l on l.message_id = m.id
where m.user_id = 4
  and l.host is not null
  and l.host not in ('t.me', 't.co')
order by m.dt desc
limit 10
;

select *
from messages m
where user_id = 4
order by char_length(m.txt) desc
limit 1
;

select *
from messages m
where m.user_id = 4
order by m.dt desc
limit 1
;

select *
from codes c
join messages m on m.id = c.message_id
where m.user_id = 19
order by char_length(c.code) desc
limit 5
;