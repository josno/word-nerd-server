BEGIN;

    TRUNCATE
    games, users
    RESTART IDENTITY CASCADE;

    INSERT INTO users
        (user_name, full_name, password)
    VALUES
        ('nerd', 'Word Nerd', '$2a$12$CaTYM00gguRlZ9X73Fmum.fNBniS04q2eQKEwN1YRH2rq35HUhs/e'),
        ('thinkful', 'Thinkful User', '$2a$16$ZkUvK7yezCNNqbSF5Kh06.wGbHJJWRTNgrRiRvPkB80IFQ6wrMFiG');

    INSERT INTO games
        (title, word_list, user_id)
    VALUES
        ('Colors', ARRAY
    ['red', 'blue', 'pink', 'orange', 'green', 'purple', 'mint', 'black', 'white'], 1),
    ('Animals', ARRAY['bird', 'turtle', 'horse', 'fish', 'alligator', 'cheetah', 'lion', 'tiger', 'bear'], 1),
    ('Places', ARRAY['library', 'school', 'park', 'restaurant', 'museum', 'cafe', 'bakery', 'store', 'market', 'hospital'], 2);

COMMIT;