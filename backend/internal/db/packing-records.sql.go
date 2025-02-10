// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0
// source: packing-records.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const getDailyPICData = `-- name: GetDailyPICData :many
SELECT
  date_trunc('day', datetime)::TIMESTAMP as day,
  pic,
  SUM(gross_weight)::NUMERIC as gross_weight,
  SUM(pack_a_qty + pack_b_qty + pack_c_qty) as daily_packs
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
GROUP BY day, pic
ORDER BY day
`

type GetDailyPICDataParams struct {
	Column1 pgtype.Timestamp `json:"column_1"`
	Column2 pgtype.Timestamp `json:"column_2"`
}

type GetDailyPICDataRow struct {
	Day         pgtype.Timestamp `json:"day"`
	Pic         string           `json:"pic"`
	GrossWeight pgtype.Numeric   `json:"gross_weight"`
	DailyPacks  int64            `json:"daily_packs"`
}

func (q *Queries) GetDailyPICData(ctx context.Context, arg GetDailyPICDataParams) ([]GetDailyPICDataRow, error) {
	rows, err := q.db.Query(ctx, getDailyPICData, arg.Column1, arg.Column2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetDailyPICDataRow{}
	for rows.Next() {
		var i GetDailyPICDataRow
		if err := rows.Scan(
			&i.Day,
			&i.Pic,
			&i.GrossWeight,
			&i.DailyPacks,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getDailyPackData = `-- name: GetDailyPackData :many
SELECT
  date_trunc('day', datetime)::TIMESTAMP as day,
  SUM(pack_a_qty) as pack_a_total,
  SUM(pack_b_qty) as pack_b_total,
  SUM(pack_c_qty) as pack_c_total,
  SUM(pack_a_qty + pack_b_qty + pack_c_qty) as total_packs
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
GROUP BY day
ORDER BY day
`

type GetDailyPackDataParams struct {
	Column1 pgtype.Timestamp `json:"column_1"`
	Column2 pgtype.Timestamp `json:"column_2"`
}

type GetDailyPackDataRow struct {
	Day        pgtype.Timestamp `json:"day"`
	PackATotal int64            `json:"pack_a_total"`
	PackBTotal int64            `json:"pack_b_total"`
	PackCTotal int64            `json:"pack_c_total"`
	TotalPacks int64            `json:"total_packs"`
}

func (q *Queries) GetDailyPackData(ctx context.Context, arg GetDailyPackDataParams) ([]GetDailyPackDataRow, error) {
	rows, err := q.db.Query(ctx, getDailyPackData, arg.Column1, arg.Column2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetDailyPackDataRow{}
	for rows.Next() {
		var i GetDailyPackDataRow
		if err := rows.Scan(
			&i.Day,
			&i.PackATotal,
			&i.PackBTotal,
			&i.PackCTotal,
			&i.TotalPacks,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getDailyRejectRatio = `-- name: GetDailyRejectRatio :many
SELECT
  date_trunc('day', datetime)::TIMESTAMP as day,
  SUM(reject_weight)::DOUBLE PRECISION as total_reject_weight,
  SUM(gross_weight)::DOUBLE PRECISION as total_gross_weight
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
GROUP BY day
ORDER BY day
`

type GetDailyRejectRatioParams struct {
	Column1 pgtype.Timestamp `json:"column_1"`
	Column2 pgtype.Timestamp `json:"column_2"`
}

type GetDailyRejectRatioRow struct {
	Day               pgtype.Timestamp `json:"day"`
	TotalRejectWeight float64          `json:"total_reject_weight"`
	TotalGrossWeight  float64          `json:"total_gross_weight"`
}

func (q *Queries) GetDailyRejectRatio(ctx context.Context, arg GetDailyRejectRatioParams) ([]GetDailyRejectRatioRow, error) {
	rows, err := q.db.Query(ctx, getDailyRejectRatio, arg.Column1, arg.Column2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetDailyRejectRatioRow{}
	for rows.Next() {
		var i GetDailyRejectRatioRow
		if err := rows.Scan(&i.Day, &i.TotalRejectWeight, &i.TotalGrossWeight); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getHourlyPICData = `-- name: GetHourlyPICData :many
SELECT
  date_trunc('hour', datetime)::TIMESTAMP as hour,
  pic,
  SUM(gross_weight)::NUMERIC as gross_weight,
  SUM(pack_a_qty + pack_b_qty + pack_c_qty) as total_packs
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
GROUP BY hour, pic
ORDER BY hour
`

type GetHourlyPICDataParams struct {
	Column1 pgtype.Timestamp `json:"column_1"`
	Column2 pgtype.Timestamp `json:"column_2"`
}

type GetHourlyPICDataRow struct {
	Hour        pgtype.Timestamp `json:"hour"`
	Pic         string           `json:"pic"`
	GrossWeight pgtype.Numeric   `json:"gross_weight"`
	TotalPacks  int64            `json:"total_packs"`
}

func (q *Queries) GetHourlyPICData(ctx context.Context, arg GetHourlyPICDataParams) ([]GetHourlyPICDataRow, error) {
	rows, err := q.db.Query(ctx, getHourlyPICData, arg.Column1, arg.Column2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetHourlyPICDataRow{}
	for rows.Next() {
		var i GetHourlyPICDataRow
		if err := rows.Scan(
			&i.Hour,
			&i.Pic,
			&i.GrossWeight,
			&i.TotalPacks,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getHourlyPackData = `-- name: GetHourlyPackData :many
SELECT
  date_trunc('hour', datetime)::TIMESTAMP as hour,
  SUM(pack_a_qty) as pack_a_total,
  SUM(pack_b_qty) as pack_b_total,
  SUM(pack_c_qty) as pack_c_total,
  SUM(pack_a_qty + pack_b_qty + pack_c_qty) as total_packs
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
GROUP BY hour
ORDER BY hour
`

type GetHourlyPackDataParams struct {
	Column1 pgtype.Timestamp `json:"column_1"`
	Column2 pgtype.Timestamp `json:"column_2"`
}

type GetHourlyPackDataRow struct {
	Hour       pgtype.Timestamp `json:"hour"`
	PackATotal int64            `json:"pack_a_total"`
	PackBTotal int64            `json:"pack_b_total"`
	PackCTotal int64            `json:"pack_c_total"`
	TotalPacks int64            `json:"total_packs"`
}

func (q *Queries) GetHourlyPackData(ctx context.Context, arg GetHourlyPackDataParams) ([]GetHourlyPackDataRow, error) {
	rows, err := q.db.Query(ctx, getHourlyPackData, arg.Column1, arg.Column2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetHourlyPackDataRow{}
	for rows.Next() {
		var i GetHourlyPackDataRow
		if err := rows.Scan(
			&i.Hour,
			&i.PackATotal,
			&i.PackBTotal,
			&i.PackCTotal,
			&i.TotalPacks,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getHourlyRejectRatio = `-- name: GetHourlyRejectRatio :many
SELECT
  date_trunc('hour', datetime)::TIMESTAMP as hour,
  SUM(reject_weight)::DOUBLE PRECISION as total_reject_weight,
  SUM(gross_weight)::DOUBLE PRECISION as total_gross_weight
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
GROUP BY hour
ORDER BY hour
`

type GetHourlyRejectRatioParams struct {
	Column1 pgtype.Timestamp `json:"column_1"`
	Column2 pgtype.Timestamp `json:"column_2"`
}

type GetHourlyRejectRatioRow struct {
	Hour              pgtype.Timestamp `json:"hour"`
	TotalRejectWeight float64          `json:"total_reject_weight"`
	TotalGrossWeight  float64          `json:"total_gross_weight"`
}

func (q *Queries) GetHourlyRejectRatio(ctx context.Context, arg GetHourlyRejectRatioParams) ([]GetHourlyRejectRatioRow, error) {
	rows, err := q.db.Query(ctx, getHourlyRejectRatio, arg.Column1, arg.Column2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetHourlyRejectRatioRow{}
	for rows.Next() {
		var i GetHourlyRejectRatioRow
		if err := rows.Scan(&i.Hour, &i.TotalRejectWeight, &i.TotalGrossWeight); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getPackingRecords = `-- name: GetPackingRecords :many
SELECT id, datetime, pic, gross_weight, pack_a_qty, pack_b_qty, pack_c_qty, reject_weight, created_at
FROM packing_records
WHERE ($1::TIMESTAMP IS NULL OR datetime >= $1)
  AND ($2::TIMESTAMP IS NULL OR datetime <= $2)
ORDER BY datetime
`

type GetPackingRecordsParams struct {
	Column1 pgtype.Timestamp `json:"column_1"`
	Column2 pgtype.Timestamp `json:"column_2"`
}

func (q *Queries) GetPackingRecords(ctx context.Context, arg GetPackingRecordsParams) ([]PackingRecord, error) {
	rows, err := q.db.Query(ctx, getPackingRecords, arg.Column1, arg.Column2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []PackingRecord{}
	for rows.Next() {
		var i PackingRecord
		if err := rows.Scan(
			&i.ID,
			&i.Datetime,
			&i.Pic,
			&i.GrossWeight,
			&i.PackAQty,
			&i.PackBQty,
			&i.PackCQty,
			&i.RejectWeight,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const newPackingRecord = `-- name: NewPackingRecord :one
INSERT INTO packing_records
  (datetime, pic, gross_weight, pack_a_qty, pack_b_qty, pack_c_qty, reject_weight)
VALUES($1, $2, $3, $4, $5, $6, $7)
RETURNING id, datetime, pic, gross_weight, pack_a_qty, pack_b_qty, pack_c_qty, reject_weight, created_at
`

type NewPackingRecordParams struct {
	Datetime     pgtype.Timestamp `json:"datetime"`
	Pic          string           `json:"pic"`
	GrossWeight  pgtype.Numeric   `json:"gross_weight"`
	PackAQty     int32            `json:"pack_a_qty"`
	PackBQty     int32            `json:"pack_b_qty"`
	PackCQty     int32            `json:"pack_c_qty"`
	RejectWeight pgtype.Numeric   `json:"reject_weight"`
}

func (q *Queries) NewPackingRecord(ctx context.Context, arg NewPackingRecordParams) (PackingRecord, error) {
	row := q.db.QueryRow(ctx, newPackingRecord,
		arg.Datetime,
		arg.Pic,
		arg.GrossWeight,
		arg.PackAQty,
		arg.PackBQty,
		arg.PackCQty,
		arg.RejectWeight,
	)
	var i PackingRecord
	err := row.Scan(
		&i.ID,
		&i.Datetime,
		&i.Pic,
		&i.GrossWeight,
		&i.PackAQty,
		&i.PackBQty,
		&i.PackCQty,
		&i.RejectWeight,
		&i.CreatedAt,
	)
	return i, err
}
