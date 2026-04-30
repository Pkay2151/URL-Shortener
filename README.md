# URL Shortener

A simple and efficient URL shortening service built with Node.js, Express, and PostgreSQL.

## Features

- **Shorten URLs**: Convert long URLs into short, shareable links
- **Click Tracking**: Track the number of times each shortened URL is accessed
- **Fast Redirects**: Instant redirection from short URL to original URL
- **RESTful API**: Simple HTTP endpoints for URL management
- **Database-backed**: Persistent storage using PostgreSQL

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Libraries**: 
  - `nanoid` - Generate unique short IDs
  - `cors` - Cross-Origin Resource Sharing
  - `dotenv` - Environment variable management
  - `pg` - PostgreSQL client

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pkay2151/URL-Shortener.git
   cd URL-Shortener/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `server` directory:
   ```
   PORT=5000
   BASE_URL=http://localhost:5000
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=url_shortener
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   ```

4. **Set up the database**
   
   Connect to PostgreSQL and create the database:
   ```sql
   CREATE DATABASE url_shortener;
   
   \c url_shortener;
   
   CREATE TABLE urls (
     id SERIAL PRIMARY KEY,
     short_id VARCHAR(10) UNIQUE NOT NULL,
     original_url TEXT NOT NULL,
     clicks INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE INDEX idx_short_id ON urls(short_id);
   ```

5. **Start the server**
   ```bash
   node index.js
   ```
   
   The server will run on `http://localhost:5000`

## API Endpoints

### 1. Health Check
**GET** `/`
- Returns a simple status message
- **Response**: `"API is running..."`

### 2. Shorten URL
**POST** `/shorten`
- Creates a shortened URL for a given original URL
- **Request Body**:
  ```json
  {
    "originalUrl": "https://example.com/very/long/url/path"
  }
  ```
- **Response** (Success - 200):
  ```json
  {
    "shortUrl": "http://localhost:5000/abc123"
  }
  ```
- **Response** (Error - 400):
  ```json
  {
    "error": "URL is required"
  }
  ```

### 3. Redirect to Original URL
**GET** `/:id`
- Redirects to the original URL and increments click count
- **Parameters**: `id` (short URL ID, e.g., `abc123`)
- **Response**: Redirects (HTTP 301/302) to original URL
- **Error** (404): "URL not found"

## Example Usage

### Using cURL

**Shorten a URL:**
```bash
curl -X POST http://localhost:5000/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://www.github.com"}'
```

**Access shortened URL:**
```bash
curl -L http://localhost:5000/abc123
```

### Using JavaScript (Fetch API)

```javascript
// Shorten URL
const response = await fetch('http://localhost:5000/shorten', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ originalUrl: 'https://www.example.com' })
});
const data = await response.json();
console.log(data.shortUrl);

// Redirect
window.location.href = 'http://localhost:5000/abc123';
```

## Database Schema

### URLs Table
```
Column        | Type              | Description
--------------|-------------------|----------------------------------
id            | SERIAL PRIMARY KEY| Unique identifier
short_id      | VARCHAR(10)       | Unique short URL identifier
original_url  | TEXT              | The original URL
clicks        | INTEGER           | Number of times accessed
created_at    | TIMESTAMP         | Creation timestamp
```

## Error Handling

- **400 Bad Request**: Missing or invalid `originalUrl`
- **404 Not Found**: Short URL doesn't exist
- **500 Internal Server Error**: Database connection issues

## Environment Variables

| Variable   | Description                      | Default            |
|-----------|----------------------------------|--------------------|
| PORT      | Server port                      | 5000               |
| BASE_URL  | Base URL for shortened links     | http://localhost:5000 |
| DB_USER   | PostgreSQL username              | (required)         |
| DB_HOST   | PostgreSQL host                  | localhost          |
| DB_NAME   | PostgreSQL database name         | (required)         |
| DB_PASSWORD| PostgreSQL password              | (required)         |
| DB_PORT   | PostgreSQL port                  | 5432               |

## Security Considerations

- Validate and sanitize URLs before storing
- Implement rate limiting to prevent abuse
- Use HTTPS in production
- Add authentication for URL management
- Implement CORS restrictions based on your needs

## Future Enhancements

- User authentication and authorization
- Custom short URLs
- URL expiration/TTL
- Analytics dashboard
- Bulk URL shortening
- API key authentication
- Rate limiting per user/IP

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on GitHub or contact the maintainers.

---

**Author**: Pkay2151  
**Repository**: https://github.com/Pkay2151/URL-Shortener
