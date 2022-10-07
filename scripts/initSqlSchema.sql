--this script is for postgres

--naming conventions: 
--choosing to name IDs as <tablename_id> to make use of USING keyword 
--not prefixing with tablename for other non-unique columns (like 'name') because fields 
--could be added later that make a previously unique column no longer unique, so to be safe 
--ALL columns should be prefixed with the tablename in that case, which makes the column names
--really wordy and isn't useful for joins like IDs


-- flush data
drop schema public cascade;
create schema public;
grant all on schema public to public;

-- declare custom data types
create domain tinyint as int check (value <= 255 and value >= 0);  


-- initialize tables
create table session(
    session_id int generated always as identity primary key,
    date date not null
    --time_start time, --should date be datetime and time_end just adds from that? is this robust against timezones? What if it switches to DST in the middle of your session?
    --time_end time
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

create table modifier_status(
    modifier_status_id int generated always as identity primary key,
    name varchar(100) not null
);

--for now these are identical to modifier_status
create table exercise_status(
    exercise_status_id int generated always as identity primary key,
    name varchar(100) not null
);

create table exercise(
    exercise_id int generated always as identity primary key,
    exercise_status_id int references exercise_status not null,
    name varchar(100) unique not null,
    cues text[]
    --notes text 
);

create table record(
    record_id int generated always as identity primary key,
    session_id int references session not null,
    exercise_id int references exercise not null,
    type varchar(100)
    --notes text
);

create table modifier(
    modifier_id int generated always as identity primary key,
    modifier_status_id int references modifier_status not null,
    name varchar(100) unique not null
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
    record_id int references record not null,
    weight_kg smallint check (weight_kg > 0) not null,
    reps tinyint not null,
    rpe tinyint, --this should have decimals... store x10 the value?
    bodyweight_kg smallint check (bodyweight_kg > 0)  -- same here? store x10 or x100 weight?
    -- notes text
);


--examples

--INSERT INTO weather (date, city, temp_hi, temp_lo)
-- VALUES ('1994-11-29', 'Hayward', 54, 37);

--check (for constraints like check age > 10)
--reference (foreign key: productId reference product -- if column names are the same, can omit)

-- join and abbreviate
--SELECT *
    --FROM weather w JOIN cities c ON w.city = c.name;