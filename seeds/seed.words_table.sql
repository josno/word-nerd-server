BEGIN;

TRUNCATE
    users,
    words
    RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, full_name, password)
VALUES 
('nerd', 'Word Nerd', '$2a$12$CaTYM00gguRlZ9X73Fmum.fNBniS04q2eQKEwN1YRH2rq35HUhs/e'),
('dunder', 'Dunder Mifflin', '$2a$12$b2/aH8A.8RvOPqlRNDD/BejYZ70.D455AxV52EOsbALud6y2fyZCO' ),
('Bo', 'Bo Beep', '$2a$12$8fD9H7FUMwfw13diJno/f.olerFzVBo4UuZC/X/HOUggFADyv6MRK');

INSERT INTO words (title, word_list, user_id)
VALUES 
('Colors', ARRAY['red', 'blue', 'pink', 'orange', 'green', 'purple', 'mint', 'black', 'white'], 1),
('Animals', ARRAY['bird', 'turtle', 'horse', 'fish', 'alligator', 'cheetah', 'lion', 'tiger', 'bear'], 1),
('Places', ARRAY['library', 'school', 'park', 'restaurant', 'museum', 'cafe', 'bakery', 'store', 'market', 'hospital'], 2);

COMMIT;