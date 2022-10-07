
insert into exercise_status (name) values ('active'), ('archived');
insert into modifier_status (name) values ('active'), ('archived');


insert into exercise (name, exercise_status_id, cues)
values 
    ('squat', 1, '{"knees out", "push up"}')
    ;


insert into exercise (name, exercise_status_id)
values 
    ('curl', 1),
    ('zercher squat', 2)
    ;


insert into session (date)
values 
    ('2022-10-01');


insert into record (session_id, exercise_id) 
values 
    ((select session_id from session where date='2022-10-01'), (select exercise_id from exercise where name='squat')),
    ((select session_id from session where date='2022-10-01'), (select exercise_id from exercise where name='curl'));

insert into modifier (name, modifier_status_id)
values 
    ('belt', 1),
    ('band', 1),
    ('fat grips', 2),
    ('oly shoes', 1),
    ('bodyweight', 1),
    ('L/R split', 1);

--these probly shouldn't be hardcoded...
insert into record_active_modifier(record_id, modifier_id) 
values 
    (1,2),
    (1,1)
    ;

insert into exercise_valid_modifier(exercise_id, modifier_id)
values
    (1,1),
    (1,2),
    (1,4),
    (2,6),
    (2,5)
    ;

insert into set (record_id, weight_kg, reps, rpe)
values
    (1, 120, 5, 8),
    (1, 130, 5, 9),
    (1, 140, 5, 10),
    (2, 20, 12, 8),
    (2, 20, 15, 8),
    (2, 20, 18, 8)
;
