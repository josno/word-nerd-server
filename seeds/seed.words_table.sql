BEGIN;

TRUNCATE
    users,
    words
    RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, full_name, password)
VALUES 
('nerd', 'Word Nerd', 'nerdpass'),
('dunder', 'Dunder Mifflin', 'dunderpass');

INSERT INTO words (title, word_list, user_id)
VALUES 
('Colors', ARRAY['red', 'blue', 'pink', 'orange', 'green', 'purple', 'mint', 'black', 'white'], 1),
('Animals', ARRAY['bird', 'turtle', 'horse', 'fish', 'alligator', 'cheetah', 'lion', 'tiger', 'bear'], 1),
('Places', ARRAY['library', 'school', 'park', 'restaurant', 'museum', 'cafe', 'bakery', 'store', 'market', 'hospital'], 2);

COMMIT;