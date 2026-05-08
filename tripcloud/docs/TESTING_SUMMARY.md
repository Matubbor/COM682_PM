# TripCloud Testing Summary

This document contains test cases for validating the TripCloud application functionality.

## Test Cases

| Test ID | Feature | Steps | Expected Result | Actual Result | Status |
|---------|---------|-------|-----------------|---------------|--------|
| TC001 | Health Check | 1. Send GET request to /api/health | Returns 200 OK with status "ok" | | |
| TC002 | Upload Image Trip Post | 1. Navigate to upload.html<br>2. Fill all required fields<br>3. Select a valid image file<br>4. Submit form | Trip post created, file uploaded to Blob Storage, metadata saved to Cosmos DB | | |
| TC003 | Upload Video Trip Post | 1. Navigate to upload.html<br>2. Fill all required fields<br>3. Select a valid video file<br>4. Submit form | Trip post created, file uploaded to Blob Storage, metadata saved to Cosmos DB | | |
| TC004 | View All Trip Posts | 1. Navigate to gallery.html | All trip posts displayed in responsive grid with correct details | | |
| TC005 | View Single Trip Post | 1. Click on a trip post in gallery<br>2. Navigate to edit.html with ID | Single trip details loaded in edit form | | |
| TC006 | Edit Trip Metadata | 1. Navigate to edit.html?id={trip_id}<br>2. Update fields<br>3. Submit form | Metadata updated in Cosmos DB, updatedAt changed | | |
| TC007 | Delete Trip Post | 1. In gallery.html, click delete on a trip<br>2. Confirm deletion | Trip removed from Cosmos DB and Blob Storage, no longer visible in gallery | | |
| TC008 | Validation - Missing Fields | 1. Submit upload form with missing required fields | Returns 400 Bad Request with validation error messages | | |
| TC009 | Validation - Invalid Rating | 1. Submit form with rating outside 1-5 range | Returns 400 Bad Request with rating validation error | | |
| TC010 | Validation - Invalid File Type | 1. Submit form with unsupported file type | Returns 400 Bad Request with file type error | | |

## Testing Notes

- All tests should be performed after setting up Azure resources and configuring environment variables
- Frontend tests should be done in a browser with JavaScript enabled
- API tests can be performed using Postman or similar tools
- File uploads should test both image and video formats
- Validation tests should cover all edge cases mentioned in requirements
- After testing, verify data in Azure Cosmos DB and Blob Storage containers