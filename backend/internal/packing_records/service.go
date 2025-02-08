package packing_record

import (
	"errors"
	"github.com/chocological13/farm-tracker/internal/db"
	"github.com/chocological13/farm-tracker/internal/util"
	"golang.org/x/net/context"
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
