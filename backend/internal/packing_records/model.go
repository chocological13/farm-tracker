package packing_record

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type GetPackingRecordRequest struct {
	TimeBegin pgtype.Timestamp `json:"time_begin"`
	TimeEnd   pgtype.Timestamp `json:"time_end"`
}

type PackingRecordResponse struct {
	Datetime     pgtype.Timestamp `json:"datetime"`
	Pic          string           `json:"pic_name"`
	GrossWeight  pgtype.Numeric   `json:"gross_weight"`
	PackAQty     int32            `json:"pack_a_qty"`
	PackBQty     int32            `json:"pack_b_qty"`
	PackCQty     int32            `json:"pack_c_qty"`
	RejectWeight pgtype.Numeric   `json:"reject_weight"`
}
