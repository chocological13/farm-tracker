package packing_record

import (
	"github.com/chocological13/farm-tracker/internal/util"
	"github.com/jackc/pgx/v5/pgtype"
)

type PackingRecordResponse struct {
	Datetime     pgtype.Timestamp `json:"datetime"`
	Pic          string           `json:"pic_name"`
	GrossWeight  pgtype.Numeric   `json:"gross_weight"`
	PackAQty     int32            `json:"pack_a_qty"`
	PackBQty     int32            `json:"pack_b_qty"`
	PackCQty     int32            `json:"pack_c_qty"`
	RejectWeight pgtype.Numeric   `json:"reject_weight"`
}

type GetPackingRecordRequest struct {
	TimeBegin pgtype.Timestamp `json:"time_begin"`
	TimeEnd   pgtype.Timestamp `json:"time_end"`
}

type CreatePackingRecordRequest struct {
	Datetime     pgtype.Timestamp `json:"datetime"`
	Pic          string           `json:"pic"`
	GrossWeight  pgtype.Numeric   `json:"gross_weight"`
	PackAQty     int32            `json:"pack_a_qty"`
	PackBQty     int32            `json:"pack_b_qty"`
	PackCQty     int32            `json:"pack_c_qty"`
	RejectWeight pgtype.Numeric   `json:"reject_weight"`
}

type HourlyPICMetrics struct {
	Hour        pgtype.Timestamp `json:"hour"`
	Pic         string           `json:"pic"`
	GrossWeight pgtype.Numeric   `json:"gross_weight"`
	TotalPacks  int32            `json:"total_packs"`
}

type HourlyPackData struct {
	Hour          pgtype.Timestamp `json:"hour"`
	PackATotal    int32            `json:"pack_a_total"`
	PackBTotal    int32            `json:"pack_b_total"`
	PackCTotal    int32            `json:"pack_c_total"`
	PackAWeightKg float64          `json:"pack_a_weight"`
	PackBWeightKg float64          `json:"pack_b_weight"`
	PackCWeightKg float64          `json:"pack_c_weight"`
}

type ProductivityMetrics struct {
	Hour           pgtype.Timestamp `json:"hour"`
	Pic            string           `json:"pic"`
	PacksPerMinute float64          `json:"packs_per_minute"`
}

type DailyProductivityMetrics struct {
	Day          pgtype.Timestamp `json:"hour"`
	Pic          string           `json:"pic"`
	DailyAverage float64          `json:"daily_average"`
}

type HourlyRejectRatioMetrics struct {
	Hour              pgtype.Timestamp `json:"hour"`
	HourlyRejectRatio float64          `json:"hourly_reject_ratio"`
}

type DailyRejectRatioMetrics struct {
	Day              pgtype.Timestamp `json:"day"`
	DailyRejectRatio float64          `json:"daily_reject_ratio"`
}

type HourlyPackDistributionMetrics struct {
	Hour       pgtype.Timestamp `json:"hour"`
	PackARatio float64          `json:"pack_a_ratio"`
	PackBRatio float64          `json:"pack_b_ratio"`
	PackCRatio float64          `json:"pack_c_ratio"`
	TotalPacks int32            `json:"total_packs"`
}

type DailyPackDistributionMetrics struct {
	Day        pgtype.Timestamp `json:"day"`
	PackARatio float64          `json:"pack_a_ratio"`
	PackBRatio float64          `json:"pack_b_ratio"`
	PackCRatio float64          `json:"pack_c_ratio"`
	TotalPacks int32            `json:"total_packs"`
}

func ValidateInput(req CreatePackingRecordRequest, v *util.Validator) map[string]string {

	v.Check(!req.Datetime.Time.IsZero(), "datetime", "date time must not be empty")
	v.Check(!req.Datetime.Time.IsZero(), "datetime", "datetime must not be empty")
	v.Check(req.Pic != "", "pic", "pic name must not be empty")
	v.Check(req.GrossWeight.Valid, "gross_weight", "gross weight must be valid")
	v.Check(req.PackAQty >= 0, "pack_a_qty", "pack A quantity must be non-negative")
	v.Check(req.PackBQty >= 0, "pack_b_qty", "pack B quantity must be non-negative")
	v.Check(req.PackCQty >= 0, "pack_c_qty", "pack C quantity must be non-negative")

	return v.Errors
}
