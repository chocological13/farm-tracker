package api

import (
	"github.com/chocological13/farm-tracker/internal/packing_records"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, packingRecordHandler *packing_record.PackingRecordHandler) {
	api := r.Group("/api/v1/records")
	{
		api.GET("", packingRecordHandler.GetPackingRecords)
		api.POST("", packingRecordHandler.CreatePackingRecord)
		api.GET("/hourly-pic", packingRecordHandler.GetHourlyPICMetrics)
		api.GET("/hourly-pack-data", packingRecordHandler.GetHourlyPackData)
		api.GET("/productivity", packingRecordHandler.GetProductivityMetrics)
		api.GET("/reject-ratios/hourly", packingRecordHandler.GetHourlyRejectRatios)
		api.GET("/reject-ratios/daily", packingRecordHandler.GetDailyRejectRatios)
		api.GET("/distribution/hourly", packingRecordHandler.GetHourlyPackDistribution)
		api.GET("/distribution/daily", packingRecordHandler.GetDailyPackDistribution)
	}
}
