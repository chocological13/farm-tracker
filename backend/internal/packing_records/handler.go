package packing_record

import (
	"errors"
	"github.com/chocological13/farm-tracker/internal/util"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
	"net/http"
)

type PackingRecordHandler struct {
	service *PackingRecordService
}

func NewPackingRecordHandler(service *PackingRecordService) *PackingRecordHandler {
	return &PackingRecordHandler{service: service}
}

func (h *PackingRecordHandler) GetPackingRecords(c *gin.Context) {
	var input GetPackingRecordRequest
	var err error

	// Handle nullable "time_begin" param
	if timeBeginStr := c.Query("time_begin"); timeBeginStr != "" {
		parsedTime, err := util.ParseTimestampQueryParam(timeBeginStr)
		if err != nil {
			util.GlobalErrorHandler.BadRequestResponse(c, err)
			return
		}
		input.TimeBegin = parsedTime
	} else {
		input.TimeBegin = pgtype.Timestamp{Valid: false} // Ensure NULL
	}

	// Handle nullable "time_end" param
	if timeEndStr := c.Query("time_end"); timeEndStr != "" {
		parsedTime, err := util.ParseTimestampQueryParam(timeEndStr)
		if err != nil {
			util.GlobalErrorHandler.BadRequestResponse(c, err)
			return
		}
		input.TimeEnd = parsedTime
	} else {
		input.TimeEnd = pgtype.Timestamp{Valid: false} // Ensure NULL
	}

	// Proceed with fetching records
	records, err := h.service.GetPackingRecords(c, input)
	if err != nil {
		switch {
		case errors.Is(err, ErrRecordNotFound):
			util.GlobalErrorHandler.NotFoundResponse(c)
		default:
			util.GlobalErrorHandler.ServerErrorResponse(c, err)
		}
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"packing_records": records})
}
