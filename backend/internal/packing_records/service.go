package packing_record

import (
	"errors"
	"github.com/chocological13/farm-tracker/internal/db"
	"github.com/chocological13/farm-tracker/internal/util"
	"golang.org/x/net/context"
	"math"
	"time"
)

const (
	PackAWeight = 0.20
	PackBWeight = 0.30
	PackCWeight = 0.40
)

var (
	ErrRecordNotFound   = errors.New("Record not found")
	ErrInvalidTimeRange = errors.New("Invalid time range")
)

type PackingRecordService struct {
	repository *db.Queries
}

func NewPackingRecordService(repository *db.Queries) *PackingRecordService {
	return &PackingRecordService{repository: repository}
}

func (s *PackingRecordService) GetPackingRecords(ctx context.Context,
	req GetPackingRecordRequest) ([]*PackingRecordResponse, error) {
	if err := validateTimeRange(req); err != nil {
		return nil, err
	}

	params := db.GetPackingRecordsParams{
		Column1: util.MakeNullTimestamp(req.TimeBegin),
		Column2: util.MakeNullTimestamp(req.TimeEnd),
	}

	packingRecords, err := s.repository.GetPackingRecords(ctx, params)

	if err != nil {
		return nil, err
	}

	if len(packingRecords) == 0 {
		return nil, ErrRecordNotFound
	}

	return mapPackingRecords(packingRecords), nil
}

func (s *PackingRecordService) NewPackingRecord(ctx context.Context, req CreatePackingRecordRequest) (*PackingRecordResponse, error) {
	packingRecord, err := s.repository.NewPackingRecord(ctx, db.NewPackingRecordParams{
		Datetime:     req.Datetime,
		Pic:          req.Pic,
		GrossWeight:  req.GrossWeight,
		PackAQty:     req.PackAQty,
		PackBQty:     req.PackBQty,
		PackCQty:     req.PackCQty,
		RejectWeight: req.RejectWeight,
	})

	return mapRecordFromDb(packingRecord), err
}

func (s *PackingRecordService) GetHourlyPICMetrics(ctx context.Context,
	req GetPackingRecordRequest) ([]*HourlyPICMetrics, error) {
	if err := validateTimeRange(req); err != nil {
		return nil, err
	}

	dbMetrics, err := s.repository.GetHourlyPICData(ctx, db.GetHourlyPICDataParams{
		Column1: util.MakeNullTimestamp(req.TimeBegin),
		Column2: util.MakeNullTimestamp(req.TimeEnd),
	})
	if err != nil {
		return nil, err
	}

	if len(dbMetrics) == 0 {
		return nil, ErrRecordNotFound
	}

	return mapHourlyPICMetrics(dbMetrics), nil
}

func (s *PackingRecordService) GetHourlyPackData(ctx context.Context, req GetPackingRecordRequest) ([]*HourlyPackData, error) {
	if err := validateTimeRange(req); err != nil {
		return nil, err
	}

	dbMetrics, err := s.repository.GetHourlyPackData(ctx, db.GetHourlyPackDataParams{
		Column1: util.MakeNullTimestamp(req.TimeBegin),
		Column2: util.MakeNullTimestamp(req.TimeEnd),
	})
	if err != nil {
		return nil, err
	}

	if len(dbMetrics) == 0 {
		return nil, ErrRecordNotFound
	}

	return mapHourlyPackData(dbMetrics), nil
}

func (s *PackingRecordService) CalculateProductivity(ctx context.Context, req GetPackingRecordRequest) ([]*ProductivityMetrics, error) {
	if err := validateTimeRange(req); err != nil {
		return nil, err
	}

	hourlyMetrics, err := s.GetHourlyPICMetrics(ctx, req)
	if err != nil {
		// other errors are already handled in the previous function
		return nil, err
	}

	dailyMetrics, err := s.repository.GetDailyPICData(ctx, db.GetDailyPICDataParams{
		Column1: util.MakeNullTimestamp(req.TimeBegin),
		Column2: util.MakeNullTimestamp(req.TimeEnd),
	})
	if err != nil {
		return nil, err
	}
	if len(dailyMetrics) == 0 {
		return nil, ErrRecordNotFound
	}

	// Map for daily totals for quick lookup
	dailyTotals := make(map[string]map[time.Time]int64)
	for _, d := range dailyMetrics {
		if _, ok := dailyTotals[d.Pic]; !ok {
			dailyTotals[d.Pic] = make(map[time.Time]int64)
		}
		dailyTotals[d.Pic][d.Day.Time] = d.DailyPacks
	}

	metrics := make([]*ProductivityMetrics, len(hourlyMetrics))
	for i, m := range hourlyMetrics {
		day := m.Hour.Time.Truncate(24 * time.Hour)
		dailyPacks := dailyTotals[m.Pic][day]

		metrics[i] = &ProductivityMetrics{
			Pic:            m.Pic,
			PacksPerMinute: math.Round((float64(m.TotalPacks)/60.0)*100) / 100,
			DailyAverage:   math.Round((float64(dailyPacks)/(10*60.0))*100) / 100,
		}
	}

	return metrics, nil
}

func (s *PackingRecordService) CalculateHourlyRejectRatios(ctx context.Context,
	req GetPackingRecordRequest) ([]*HourlyRejectRatioMetrics,
	error) {
	if err := validateTimeRange(req); err != nil {
		return nil, err
	}

	dbMetrics, err := s.repository.GetHourlyRejectRatio(ctx, db.GetHourlyRejectRatioParams{
		Column1: util.MakeNullTimestamp(req.TimeBegin),
		Column2: util.MakeNullTimestamp(req.TimeEnd),
	})
	if err != nil {
		return nil, err
	}
	if len(dbMetrics) == 0 {
		return nil, ErrRecordNotFound
	}

	metrics := make([]*HourlyRejectRatioMetrics, len(dbMetrics))
	for i, m := range dbMetrics {
		ratio := calculateRatio(m.TotalRejectWeight, m.TotalGrossWeight)
		metrics[i] = &HourlyRejectRatioMetrics{
			Hour:              m.Hour,
			HourlyRejectRatio: ratio,
		}
	}

	return metrics, nil
}

func (s *PackingRecordService) CalculateDailyRejectRatios(ctx context.Context,
	req GetPackingRecordRequest) ([]*DailyRejectRatioMetrics, error) {
	if err := validateTimeRange(req); err != nil {
		return nil, err
	}

	dbMetrics, err := s.repository.GetDailyRejectRatio(ctx, db.GetDailyRejectRatioParams{
		Column1: util.MakeNullTimestamp(req.TimeBegin),
		Column2: util.MakeNullTimestamp(req.TimeEnd),
	})
	if err != nil {
		return nil, err
	}
	if len(dbMetrics) == 0 {
		return nil, ErrRecordNotFound
	}

	metrics := make([]*DailyRejectRatioMetrics, len(dbMetrics))
	for i, m := range dbMetrics {
		ratio := calculateRatio(m.TotalGrossWeight, m.TotalRejectWeight)
		metrics[i] = &DailyRejectRatioMetrics{
			Day:              m.Day,
			DailyRejectRatio: ratio,
		}
	}

	return metrics, nil
}

func (s *PackingRecordService) CalculateHourlyPackDistribution(ctx context.Context,
	req GetPackingRecordRequest) ([]*HourlyPackDistributionMetrics, error) {
	if err := validateTimeRange(req); err != nil {
		return nil, err
	}

	dbMetrics, err := s.repository.GetHourlyPackData(ctx, db.GetHourlyPackDataParams{
		Column1: util.MakeNullTimestamp(req.TimeBegin),
		Column2: util.MakeNullTimestamp(req.TimeEnd),
	})
	if err != nil {
		return nil, err
	}
	if len(dbMetrics) == 0 {
		return nil, ErrRecordNotFound
	}

	metrics := make([]*HourlyPackDistributionMetrics, len(dbMetrics))
	for i, m := range dbMetrics {
		packARatio := calculateRatio(float64(m.PackATotal), float64(m.TotalPacks))
		packBRatio := calculateRatio(float64(m.PackBTotal), float64(m.TotalPacks))
		packCRatio := calculateRatio(float64(m.PackCTotal), float64(m.TotalPacks))
		metrics[i] = &HourlyPackDistributionMetrics{
			Hour:       m.Hour,
			PackARatio: packARatio,
			PackBRatio: packBRatio,
			PackCRatio: packCRatio,
			TotalPacks: int32(m.TotalPacks),
		}
	}

	return metrics, nil
}

func (s *PackingRecordService) CalculateDailyPackDistribution(ctx context.Context, req GetPackingRecordRequest) ([]*DailyPackDistributionMetrics, error) {
	if err := validateTimeRange(req); err != nil {
		return nil, err
	}

	dbMetrics, err := s.repository.GetDailyPackData(ctx, db.GetDailyPackDataParams{
		Column1: util.MakeNullTimestamp(req.TimeBegin),
		Column2: util.MakeNullTimestamp(req.TimeEnd),
	})
	if err != nil {
		return nil, err
	}
	if len(dbMetrics) == 0 {
		return nil, ErrRecordNotFound
	}

	metrics := make([]*DailyPackDistributionMetrics, len(dbMetrics))
	for i, m := range dbMetrics {
		packARatio := calculateRatio(float64(m.PackATotal), float64(m.TotalPacks))
		packBRatio := calculateRatio(float64(m.PackBTotal), float64(m.TotalPacks))
		packCRatio := calculateRatio(float64(m.PackCTotal), float64(m.TotalPacks))
		metrics[i] = &DailyPackDistributionMetrics{
			Day:        m.Day,
			PackARatio: packARatio,
			PackBRatio: packBRatio,
			PackCRatio: packCRatio,
			TotalPacks: int32(m.TotalPacks),
		}
	}

	return metrics, nil
}

// helper methods

func validateTimeRange(req GetPackingRecordRequest) error {
	if req.TimeBegin.Valid && req.TimeEnd.Valid {
		if req.TimeEnd.Time.Before(req.TimeBegin.Time) {
			return ErrInvalidTimeRange
		}
	}
	return nil
}

func calculatePackWeights(packA, packB, packC int64) (float64, float64, float64) {
	return roundToTwoDecimals(PackAWeight * float64(packA)),
		roundToTwoDecimals(PackBWeight * float64(packB)),
		roundToTwoDecimals(PackCWeight * float64(packC))
}

func roundToTwoDecimals(value float64) float64 {
	return math.Round(value*100) / 100
}

func calculateRatio(value, total float64) float64 {
	if total == 0 {
		return 0
	}
	ratio := (value / total) * 100
	return math.Round(ratio*100) / 100
}

// mapping helpers

func mapRecordFromDb(record db.PackingRecord) *PackingRecordResponse {
	return &PackingRecordResponse{
		Datetime:     record.Datetime,
		Pic:          record.Pic,
		GrossWeight:  record.GrossWeight,
		PackAQty:     record.PackAQty,
		PackBQty:     record.PackBQty,
		PackCQty:     record.PackCQty,
		RejectWeight: record.RejectWeight,
	}
}

func mapPackingRecords(records []db.PackingRecord) []*PackingRecordResponse {
	result := make([]*PackingRecordResponse, len(records))
	for i, record := range records {
		result[i] = mapRecordFromDb(record)
	}
	return result
}

func mapHourlyPICMetrics(data []db.GetHourlyPICDataRow) []*HourlyPICMetrics {
	metrics := make([]*HourlyPICMetrics, len(data))
	for i, m := range data {
		metrics[i] = &HourlyPICMetrics{
			Hour:        m.Hour,
			Pic:         m.Pic,
			GrossWeight: m.GrossWeight,
			TotalPacks:  int32(m.TotalPacks),
		}
	}
	return metrics
}

func mapHourlyPackData(data []db.GetHourlyPackDataRow) []*HourlyPackData {
	metrics := make([]*HourlyPackData, len(data))
	for i, m := range data {
		packAWeight, packBWeight, packCWeight := calculatePackWeights(
			m.PackATotal, m.PackBTotal, m.PackCTotal)

		metrics[i] = &HourlyPackData{
			Hour:          m.Hour,
			PackATotal:    int32(m.PackATotal),
			PackBTotal:    int32(m.PackBTotal),
			PackCTotal:    int32(m.PackCTotal),
			PackAWeightKg: packAWeight,
			PackBWeightKg: packBWeight,
			PackCWeightKg: packCWeight,
		}
	}
	return metrics
}
