package packing_record

import (
	"errors"
	"github.com/chocological13/farm-tracker/internal/db"
	"github.com/chocological13/farm-tracker/internal/util"
	"golang.org/x/net/context"
	"math"
)

const (
	PackAWeight = 0.20
	PackBWeight = 0.30
	PackCWeight = 0.40
)

var (
	ErrRecordNotFound = errors.New("Record not found")
)

type PackingRecordService struct {
	repository *db.Queries
}

func NewPackingRecordService(repository *db.Queries) *PackingRecordService {
	return &PackingRecordService{repository: repository}
}

func (s *PackingRecordService) GetPackingRecords(ctx context.Context,
	req GetPackingRecordRequest) ([]*PackingRecordResponse, error) {
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

	recordResponses := make([]*PackingRecordResponse, len(packingRecords))
	for i, packingRecord := range packingRecords {
		recordResponses[i] = mapRecordFromDb(packingRecord)
	}

	return recordResponses, nil
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

	metrics := make([]*HourlyPICMetrics, len(dbMetrics))
	for i, m := range dbMetrics {
		metrics[i] = &HourlyPICMetrics{
			Hour:        m.Hour,
			PIC:         m.Pic,
			GrossWeight: m.GrossWeight,
			TotalPacks:  int32(m.TotalPacks),
		}
	}

	return metrics, nil
}

func (s *PackingRecordService) GetHourlyPackData(ctx context.Context, req GetPackingRecordRequest) ([]*HourlyPackData, error) {
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

	metrics := make([]*HourlyPackData, len(dbMetrics))
	for i, m := range dbMetrics {
		metrics[i] = &HourlyPackData{
			Hour:          m.Hour,
			PackATotal:    int32(m.PackATotal),
			PackBTotal:    int32(m.PackBTotal),
			PackCTotal:    int32(m.PackCTotal),
			PackAWeightKg: math.Round(PackAWeight*float64(m.PackATotal)*100) / 100,
			PackBWeightKg: math.Round(PackBWeight*float64(m.PackBTotal)*100) / 100,
			PackCWeightKg: math.Round(PackCWeight*float64(m.PackCTotal)*100) / 100,
		}
	}

	return metrics, nil
}

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
