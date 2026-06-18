# Backend API Integration Specification

This documentation defines the REST API endpoints that the **ChaiDrive** frontend expects from your manual backend. 

All endpoints require JSON payload exchanges unless specified otherwise. In production, the frontend will append a JWT authorization token in the headers for all authenticated requests:
`Authorization: Bearer <your_jwt_token_here>`

---

## Authentication Endpoints

### 1. User Registration
* **Endpoint**: `POST /api/register`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "username": "tarun_sisodia",
    "email": "you@example.com",
    "password": "your_secure_password"
  }
  ```
* **Response (Success - 201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoidGFydW5fc2lzb2RpYSIsImVtYWlsIjoieW91QGV4YW1wbGUuY29tIiwiZXhwIjoxNzE4Njk2MDAwfQ.signature"
  }
  ```

### 2. User Login
* **Endpoint**: `POST /api/login`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "email": "you@example.com",
    "password": "your_secure_password"
  }
  ```
* **Response (Success - 200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoidGFydW5fc2lzb2RpYSIsImVtYWlsIjoieW91QGV4YW1wbGUuY29tIiwiZXhwIjoxNzE4Njk2MDAwfQ.signature"
  }
  ```

---

## Folder Operations

All folder operations require authentication headers.

### 1. Create a Folder
* **Endpoint**: `POST /api/folders`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "name": "Personal Photos",
    "parentId": "f-123" // or null if creating in Root
  }
  ```
* **Response (Success - 201 Created)**:
  ```json
  {
    "id": "f-987",
    "name": "Personal Photos",
    "parentId": "f-123",
    "createdAt": "2026-06-18T12:00:00.000Z"
  }
  ```

### 2. Rename a Folder
* **Endpoint**: `PATCH /api/folders/:id`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "name": "Updated Folder Name"
  }
  ```
* **Response (Success - 200 OK)**:
  ```json
  {
    "id": "f-987",
    "name": "Updated Folder Name",
    "parentId": "f-123",
    "createdAt": "2026-06-18T12:00:00.000Z"
  }
  ```

---

## File Operations

All file operations require authentication headers.

### 1. Upload a File
* **Endpoint**: `POST /api/upload-file`
* **Content-Type**: `multipart/form-data`
* **Request Body**:
  * `file`: Binary file upload contents.
  * `folderId`: String ID of destination folder (optional).
* **Response (Success - 201 Created)**:
  ```json
  {
    "id": "fi-abc",
    "name": "profile.png",
    "size": 254890,
    "type": "image/png",
    "dataUrl": "http://localhost:3000/static/profile.png", // URL location to download/preview the file
    "folderId": "f-987",
    "createdAt": "2026-06-18T12:05:00.000Z",
    "updatedAt": "2026-06-18T12:05:00.000Z"
  }
  ```

### 2. Rename a File
* **Endpoint**: `PATCH /api/files/:id/rename`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "name": "vacation_new.png"
  }
  ```
* **Response (Success - 200 OK)**:
  ```json
  {
    "id": "fi-abc",
    "name": "vacation_new.png",
    "size": 254890,
    "type": "image/png",
    "dataUrl": "http://localhost:3000/static/vacation_new.png",
    "folderId": "f-987",
    "createdAt": "2026-06-18T12:05:00.000Z",
    "updatedAt": "2026-06-18T12:10:00.000Z"
  }
  ```

### 3. Move File to Trash (Soft Delete)
* **Endpoint**: `PATCH /api/files/:id/trash`
* **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "message": "File moved to trash successfully"
  }
  ```

### 4. Restore File from Trash
* **Endpoint**: `PATCH /api/files/:id/restore`
* **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "message": "File restored from trash successfully"
  }
  ```

### 5. Delete File Permanently
* **Endpoint**: `DELETE /api/files/:id`
* **Response (Success - 200 OK)**:
  ```json
  {
    "success": true,
    "message": "File deleted permanently"
  }
  ```
