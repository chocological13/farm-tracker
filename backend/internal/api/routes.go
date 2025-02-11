package api

import (
	"github.com/chocological13/farm-tracker/internal/packing_records"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, packingRecordHandler *packing_record.PackingRecordHandler) {
	api := r.Group("/api/v1/records")
	{
		// Base record operations
		api.GET("", packingRecordHandler.GetPackingRecords)
		api.POST("", packingRecordHandler.CreatePackingRecord)

		// Metrics endpoints
		metrics := api.Group("/metrics")
		{
			pic := metrics.Group("/pic")
			{
				pic.GET("/hourly", packingRecordHandler.GetHourlyPICMetrics)
				pic.GET("/productivity/hourly", packingRecordHandler.GetProductivityMetrics)
				pic.GET("/productivity/daily", packingRecordHandler.GetDailyProductivityMetrics)
			}

			packs := metrics.Group("/packs")
			{
				packs.GET("/hourly", packingRecordHandler.GetHourlyPackData)
				packs.GET("/distribution/hourly", packingRecordHandler.GetHourlyPackDistribution)
				packs.GET("/distribution/daily", packingRecordHandler.GetDailyPackDistribution)
			}

			rejects := metrics.Group("/rejects")
			{
				rejects.GET("/hourly", packingRecordHandler.GetHourlyRejectRatios)
				rejects.GET("/daily", packingRecordHandler.GetDailyRejectRatios)
			}
		}
	}
}
