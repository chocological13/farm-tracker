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
