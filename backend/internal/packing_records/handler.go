package packing_record

import (
	"errors"
	"github.com/chocological13/farm-tracker/internal/util"
	"github.com/gin-gonic/gin"
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

	input.TimeBegin, err = util.ParseTimestampQueryParam(c.Query("time_begin"))
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

	input.TimeEnd, err = util.ParseTimestampQueryParam(c.Query("time_end"))
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

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

func (h *PackingRecordHandler) CreatePackingRecord(c *gin.Context) {
	var input CreatePackingRecordRequest
	err := c.ShouldBindJSON(&input)
	if err != nil {
		util.GlobalErrorHandler.BadRequestResponse(c, err)
		return
	}

	v := util.NewValidator()
	ValidateInput(input, v)

	if !v.Valid() {
		util.GlobalErrorHandler.FailedValidationResponse(c, v.Errors)
		return
	}

	newRecord, err := h.service.NewPackingRecord(c, input)
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"new_record": newRecord})
}

func (h *PackingRecordHandler) GetHourlyPICMetrics(c *gin.Context) {
	var input GetPackingRecordRequest
	var err error

	input.TimeBegin, err = util.ParseTimestampQueryParam(c.Query("time_begin"))
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

	input.TimeEnd, err = util.ParseTimestampQueryParam(c.Query("time_end"))
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

	metrics, err := h.service.GetHourlyPICMetrics(c, input)
	if err != nil {
		switch {
		case errors.Is(err, ErrRecordNotFound):
			util.GlobalErrorHandler.NotFoundResponse(c)
		default:
			util.GlobalErrorHandler.ServerErrorResponse(c, err)
		}
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})
}

func (h *PackingRecordHandler) GetHourlyPackDistribution(c *gin.Context) {
	var input GetPackingRecordRequest
	var err error

	input.TimeBegin, err = util.ParseTimestampQueryParam(c.Query("time_begin"))
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

	input.TimeEnd, err = util.ParseTimestampQueryParam(c.Query("time_end"))
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

	metrics, err := h.service.GetHourlyPackData(c, input)
	if err != nil {
		switch {
		case errors.Is(err, ErrRecordNotFound):
			util.GlobalErrorHandler.NotFoundResponse(c)
		default:
			util.GlobalErrorHandler.ServerErrorResponse(c, err)
		}
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})

}

func (h *PackingRecordHandler) GetProductivityMetrics(c *gin.Context) {
	var input GetPackingRecordRequest
	var err error

	input.TimeBegin, err = util.ParseTimestampQueryParam(c.Query("time_begin"))
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

	input.TimeEnd, err = util.ParseTimestampQueryParam(c.Query("time_end"))
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

	metrics, err := h.service.CalculateProductivity(c, input)
	if err != nil {
		switch {
		case errors.Is(err, ErrRecordNotFound):
			util.GlobalErrorHandler.NotFoundResponse(c)
		default:
			util.GlobalErrorHandler.ServerErrorResponse(c, err)
		}
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})

}
