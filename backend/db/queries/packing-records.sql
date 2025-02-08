-- name: NewPackingRecord :one
INSERT INTO packing_records
  (datetime, pic_name, gross_weight, pack_a_qty, pack_b_qty, pack_c_qty, reject_weight)
VALUES($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetPackingRecords :many
SELECT *
FROM packing_records
WHERE datetime BETWEEN $1 AND $2
ORDER BY datetime;