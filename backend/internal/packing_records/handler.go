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
	input, err := h.parseParams(c)
	if err != nil {
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
		return
	}

	records, err := h.service.GetPackingRecords(c, input)
	if err != nil {
		h.handleError(c, err)
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
	input, err := h.parseParams(c)
	if err != nil {
		util.GlobalErrorHandler.BadRequestResponse(c, err)
		return
	}

	metrics, err := h.service.GetHourlyPICMetrics(c, input)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})
}

func (h *PackingRecordHandler) GetHourlyPackData(c *gin.Context) {
	input, err := h.parseParams(c)
	if err != nil {
		util.GlobalErrorHandler.BadRequestResponse(c, err)
		return
	}

	metrics, err := h.service.GetHourlyPackData(c, input)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})

}

func (h *PackingRecordHandler) GetProductivityMetrics(c *gin.Context) {
	input, err := h.parseParams(c)
	if err != nil {
		util.GlobalErrorHandler.BadRequestResponse(c, err)
		return
	}

	metrics, err := h.service.CalculateProductivity(c, input)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})

}

func (h *PackingRecordHandler) GetDailyProductivityMetrics(c *gin.Context) {
	input, err := h.parseParams(c)
	if err != nil {
		util.GlobalErrorHandler.BadRequestResponse(c, err)
		return
	}

	metrics, err := h.service.CalculateDailyProductivity(c, input)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})

}

func (h *PackingRecordHandler) GetHourlyRejectRatios(c *gin.Context) {
	input, err := h.parseParams(c)
	if err != nil {
		util.GlobalErrorHandler.BadRequestResponse(c, err)
		return
	}

	metrics, err := h.service.CalculateHourlyRejectRatios(c, input)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})
}

func (h *PackingRecordHandler) GetDailyRejectRatios(c *gin.Context) {
	input, err := h.parseParams(c)
	if err != nil {
		util.GlobalErrorHandler.BadRequestResponse(c, err)
		return
	}

	metrics, err := h.service.CalculateDailyRejectRatios(c, input)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})
}

func (h *PackingRecordHandler) GetHourlyPackDistribution(c *gin.Context) {
	input, err := h.parseParams(c)
	if err != nil {
		util.GlobalErrorHandler.BadRequestResponse(c, err)
		return
	}

	metrics, err := h.service.CalculateHourlyPackDistribution(c, input)
	if err != nil {
		h.handleError(c, err)
		return
	}

	c.JSON(http.StatusOK, util.Envelope{"metrics": metrics})
}

func (h *PackingRecordHandler) GetDailyPackDistribution(c *gin.Context) {
	input, err := h.parseParams(c)
	if err != nil {
		util.GlobalErrorHandler.BadRequestResponse(c, err)
		return
	}

	metrics, err := h.service.CalculateDailyPackDistribution(c, input)
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

// Helper function to parse time parameters
func (h *PackingRecordHandler) parseParams(c *gin.Context) (GetPackingRecordRequest, error) {
	var input GetPackingRecordRequest
	var err error

	input.TimeBegin, err = util.ParseTimestampQueryParam(c.Query("time_begin"))
	if err != nil {
		return input, err
	}

	input.TimeEnd, err = util.ParseTimestampQueryParam(c.Query("time_end"))
	if err != nil {
		return input, err
	}

	// Create validator
	v := util.NewValidator()

	// Parse limit and offset using the ReadInt utility
	limit := util.ReadInt(c.Request.URL.Query(), "limit", 0, v)
	offset := util.ReadInt(c.Request.URL.Query(), "offset", 0, v)

	input.Limit = int32(limit)
	input.Offset = int32(offset)

	if !v.Valid() {
		return input, errors.New("invalid pagination parameters")
	}

	return input, err

}

// Helper function to handle common error responses
func (h *PackingRecordHandler) handleError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, ErrRecordNotFound):
		util.GlobalErrorHandler.NotFoundResponse(c)
	default:
		util.GlobalErrorHandler.ServerErrorResponse(c, err)
	}
}
