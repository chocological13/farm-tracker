package util

import (
	"github.com/gin-gonic/gin"
	"log/slog"
	"net/http"
)

var GlobalErrorHandler *ErrorHandler // Global variable

// Initialize the global ErrorHandler once
func init() {
	GlobalErrorHandler = &ErrorHandler{logger: slog.Default()}
}

type ErrorHandler struct {
	logger *slog.Logger
}

func (eh *ErrorHandler) logError(c *gin.Context, err error) {
	eh.logger.Error("request error",
		"error", err.Error(),
		"method", c.Request.Method,
		"uri", c.Request.RequestURI,
	)
}

func (eh *ErrorHandler) WriteError(c *gin.Context, status int, message any) {
	c.JSON(status, gin.H{"error": message})
}

func (eh *ErrorHandler) ServerErrorResponse(c *gin.Context, err error) {
	eh.logError(c, err)
	msg := "The server encountered a problem and could not process your request"
	eh.WriteError(c, http.StatusInternalServerError, msg)
}

func (eh *ErrorHandler) NotFoundResponse(c *gin.Context) {
	msg := "The requested resource could not be found"
	eh.WriteError(c, http.StatusNotFound, msg)
}

func (eh *ErrorHandler) MethodNotAllowedResponse(c *gin.Context) {
	msg := "Unsupported method"
	eh.WriteError(c, http.StatusMethodNotAllowed, msg)
}

func (eh *ErrorHandler) BadRequestResponse(c *gin.Context, err error) {
	eh.WriteError(c, http.StatusBadRequest, err.Error())
}

func (eh *ErrorHandler) RateLimitExceededResponse(c *gin.Context) {
	msg := "Request rate limit exceeded"
	eh.WriteError(c, http.StatusTooManyRequests, msg)
}

func (eh *ErrorHandler) FailedValidationResponse(c *gin.Context, errors map[string]string) {
	eh.WriteError(c, http.StatusBadRequest, errors)
}

func (eh *ErrorHandler) UnauthorizedResponse(c *gin.Context) {
	msg := "Unauthorized access"
	eh.WriteError(c, http.StatusUnauthorized, msg)
}

func (eh *ErrorHandler) InvalidCredentialsResponse(c *gin.Context) {
	msg := "Invalid authentication credentials"
	eh.WriteError(c, http.StatusUnauthorized, msg)
}
