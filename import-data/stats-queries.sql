select u.id
     , u.name
     , count(l.href) cnt_links
     , count(c.code) cnt_codes
     , sum(char_length(m.txt)) cnt_chars
from users u
join messages m on m.user_id = u.id
	and m.is_forward = 0
left join (
	select l.id
		 , l.href
         , l.message_id
    from links l
    join hosts h on h.id = l.host_id
    where h.name not in ('t.me', 't.co')
) l on l.message_id = m.id
left join codes c on c.message_id = m.id
where u.name != 'Combot'
group by u.id
	   , u.name
order by cnt_links desc
;


select *
from (
    select m.user_id
		 , h.name
		 , count(l.href) cnt_links
         , row_number() over (partition by m.user_id order by count(l.href) desc) rn
	from messages m
	join links l on l.message_id = m.id
	where 1=1
	  and m.user_id in (4, 5)
	  and l.host is not null
	  and l.host not in ('t.me', 't.co')
	group by m.user_id
		   , l.host
	order by cnt_links desc
) d
where d.rn <= 5
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