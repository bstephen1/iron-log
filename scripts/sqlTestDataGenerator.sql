
insert into exercise (exercise_name, is_active, comments)
values 
    ('squat', true, '{"knees out", "push up"}')
    ;


insert into exercise (exercise_name, is_active)
values 
    ('curl', true),
    ('zercher squat', false)
    ;


insert into session (session_date)
values 
    ('2022-10-01');


insert into record (session_id, exercise_id) 
values 
    ((select session_id from session where session_date='2022-10-01'), (select exercise_id from exercise where exercise_name='squat')),
    ((select session_id from session where session_date='2022-10-01'), (select exercise_id from exercise where exercise_name='curl'));

insert into modifier (modifier_name, is_active)
values 
    ('belt', true),
    ('band', true),
    ('fat grips', false),
    ('oly shoes', true),
    ('bodyweight', true),
    ('L/R split', true);

--these probly shouldn't be hardcoded IDs...
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

insert into set (record_id, weight, reps, rpe)
values
    (1, 120, 5, 8),
    (1, 130, 5, 9),
    (1, 140, 5, 10),
    (2, 20, 12, 8),
    (2, 20, 15, 8),
    (2, 20, 18, 8)
;
