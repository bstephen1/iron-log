--this script is for postgres


-- flush data
drop schema public cascade;
create schema public;
grant all on schema public to public;

-- initialize tables
create table session(
    session_id int generated always as identity primary key,
    session_date date not null,
    session_length int
    -- session_type_id int references session_type,
    --program_id int references program
);

/* 
create table program(
    program_id int generated always as identity primary key,
    program_name varchar not null,
    program_description varchar,
    is_continuous bool not null, -- for non-week based (might have to do something with days_active too)
    days_active int[][] -- days of week as int, for X weeks
);

create table session_type(
    session_type_id int generated always as identity primary key,
    session_type_name varchar,
    session_type_description varchar
)

create table program_session_plan(
    session_plan_id int generated always as identity primary key,
    session_type_id int references session_type,
    program_id int references program,
    --day of week or date?
    --something like a record? make yet another table?
)
*/

create table exercise(
    exercise_id int generated always as identity primary key,
    exercise_name varchar(255) unique not null,
    is_active bool not null,
    comments varchar[]
);

create table record(
    record_id int generated always as identity primary key,
    session_id int references session,
    exercise_id int references exercise,
    record_type varchar
);

create table modifier(
    modifier_id int generated always as identity primary key,
    modifier_name varchar(255) unique not null,
    is_active bool not null
);


create table record_active_modifier(
    record_id int references record, --on update/delete behavior
    modifier_id int references modifier,
    primary key(record_id, modifier_id)
);

create table exercise_valid_modifier(
    exercise_id int references exercise, --on update/delete behavior
    modifier_id int references modifier,
    primary key(exercise_id, modifier_id)
);

create table set(
    set_id int generated always as identity primary key,
    record_id int references record,
    weight int check (weight > 0) not null,
    reps int check (reps > 0) not null,
    rpe int check (rpe > 0 and rpe <= 10), --this should have decimals... store x10 the value?
    bodyweight int check (bodyweight > 0)  -- same here? store x10 or x100 weight?
);


--examples

--INSERT INTO weather (date, city, temp_hi, temp_lo)
-- VALUES ('1994-11-29', 'Hayward', 54, 37);

--check (for constraints like check age > 10)
--reference (foreign key: productId reference product -- if column names are the same, can omit)

-- join and abbreviate
--SELECT *
    --FROM weather w JOIN cities c ON w.city = c.name;