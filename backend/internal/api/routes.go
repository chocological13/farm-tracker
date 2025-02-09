package api

import (
	"github.com/chocological13/farm-tracker/internal/packing_records"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, packingRecordHandler *packing_record.PackingRecordHandler) {
	api := r.Group("/api/v1")
	{
		api.GET("/records", packingRecordHandler.GetPackingRecords)
		api.POST("/records", packingRecordHandler.CreatePackingRecord)
		api.GET("/records/hourly-pic", packingRecordHandler.GetHourlyPICMetrics)
		api.GET("/records/hourly-distribution", packingRecordHandler.GetHourlyPackDistribution)
		api.GET("records/productivity", packingRecordHandler.GetProductivityMetrics)
	}
}
