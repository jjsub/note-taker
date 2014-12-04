create table users(
    id serial primary key,
    username varchar(255) unique,
    password char(60),
    avatar varchar(500),
    create_at timestamp default now()

);

