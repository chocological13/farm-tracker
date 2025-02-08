-- +goose Up
-- +goose StatementBegin
CREATE TABLE packing_records (
    id SERIAL PRIMARY KEY,
    datetime TIMESTAMP NOT NULL,
    pic_name VARCHAR(100) NOT NULL,
    gross_weight DECIMAL(10,2) NOT NULL,
    pack_a_qty INTEGER NOT NULL,
    pack_b_qty INTEGER NOT NULL,
    pack_c_qty INTEGER NOT NULL,
    reject_weight DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_packing_records_pic_name ON packing_records(pic_name);
CREATE INDEX idx_packing_records_datetime ON packing_records(datetime);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS packing_records;
-- +goose StatementEnd
