CREATE TABLE words (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY,
    word_list TEXT[] NOT NULL,
    title TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT NOW() NOT NULL
);