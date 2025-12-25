# Update Server Logic (server.js)

# "Update the existing server.js to satisfy these requirements with minimal code:

1. **Middleware**: Add a simple custom middleware using app.use() that logs the request method and URL.

2. **Port Check**: Modify app.listen by chaining .on('error', (err) => { if (err.code === 'EADDRINUSE') console.log('Error: Port 3000 is already in use'); process.exit(1); }) to handle port conflicts.

3. **Schema Check**: Before the server starts, execute a CREATE TABLE IF NOT EXISTS users (...) query to ensure the database structure is ready.

4. **Keep all** logic within the existing file structure and minimize extra lines."