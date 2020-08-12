CREATE TABLE game_type (
    id SERIAL PRIMARY KEY,
    game_type_name TEXT NOT NULL UNIQUE,
    game_type_image_url TEXT NOT NULL
);

ALTER TABLE games
  ADD COLUMN
    game_type_id INTEGER REFERENCES game_type(id)
    ON DELETE SET NULL;
