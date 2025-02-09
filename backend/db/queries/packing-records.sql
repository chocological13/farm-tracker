-- name: NewPackingRecord :one
INSERT INTO packing_records
  (datetime, pic, gross_weight, pack_a_qty, pack_b_qty, pack_c_qty, reject_weight)
VALUES($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetPackingRecords :many
SELECT *
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
ORDER BY datetime;

-- name: GetHourlyPICData :many
SELECT
    date_trunc('hour', datetime)::TIMESTAMP as hour,
    pic,
    SUM(gross_weight)::NUMERIC as gross_weight,
    SUM(pack_a_qty + pack_b_qty + pack_c_qty) as total_packs
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
GROUP BY hour, pic
ORDER BY hour;

-- name: GetDailyPICData :many
SELECT
    date_trunc('day', datetime)::TIMESTAMP as day,
    pic,
    SUM(gross_weight)::NUMERIC as gross_weight,
    SUM(pack_a_qty + pack_b_qty + pack_c_qty) as daily_packs
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
GROUP BY day, pic
ORDER BY day;

-- name: GetHourlyPackData :many
SELECT
    date_trunc('hour', datetime)::TIMESTAMP as hour,
    SUM(pack_a_qty) as pack_a_total,
    SUM(pack_b_qty) as pack_b_total,
    SUM(pack_c_qty) as pack_c_total
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
GROUP BY hour
ORDER BY hour;