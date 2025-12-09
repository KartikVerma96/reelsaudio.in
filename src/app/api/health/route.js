// ============================================
// Health Check API Endpoint
// ============================================
// Used by Kubernetes, Docker, load balancers
// to check if the app is running properly
//
// GET /api/health
// Returns: { status: 'ok', timestamp: '...', uptime: ... }

export async function GET() {
  try {
    const startTime = process.env.START_TIME 
      ? parseInt(process.env.START_TIME) 
      : Date.now();
    
    const uptime = Math.floor((Date.now() - startTime) / 1000); // seconds
    
    // Basic health check
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      service: 'reelsaudio',
    };

    // Optional: Check database, external services, etc.
    // const dbStatus = await checkDatabase();
    // health.database = dbStatus;

    return Response.json(health, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}

