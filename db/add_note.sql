--This declare the function expression
CREATE or replace Function add_note (user_id integer, title varchar, boday varchar, tags varchar)
RETURNS integer AS $$

Declare -- declare any variable needed 
  nid integer;
  names varchar[];
  tagname varchar;
  tid integer;
  
BEGIN -- The function code block start here.
  insert into notes (title, body, user_id) values (title, body, user_id) returning id into nid;
  select string_to_array(tags, '.') into names;
  raise notice 'nid: %', nid;
  raise notice 'names: %', names; -- This is like console.log();
  CREATE TEMP TABLE  tagger ON COMMIT DROP AS SELECT nid, t.id as tid, t.name as tnmae From tags t where t.name = any(names); -- This Create a Temporary table

  foreach tagname in array names
  Loop                            --Loop
    tid :=(select t.tid from targger t where t.tname = tagname);
    raise notice 'tid: %', tid;
    
    IF tid is null THEN
      insert into tags (name) values (tagname) returning id into tid;
      insert into tagger values (nid, tid, tagname);
    END IF;
  End loop;
  insert into notes_tags select t.nid, t.tid from tagger t; --this inset 
  return nid;
  
end;
$$ LAnGUAGE plpgsql;

select add_note(2,'a','a1', 'js,angular,sql,hapi');
select * from notes;


