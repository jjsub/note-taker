create table nones_tags(
    note_id integer references notes(id),
    tag_id integer references tags(id)
);
