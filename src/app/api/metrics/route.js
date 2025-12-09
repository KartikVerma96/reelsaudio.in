// ============================================
// Metrics API Endpoint
// ============================================
// Exposes application metrics in Prometheus format
// Used for monitoring and alerting
//
// GET /api/metrics
// Returns: Prometheus-formatted metrics

export async function GET() {
  try {
    const metrics = [];
    
    // Basic metrics
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Memory metrics
    metrics.push(`# HELP nodejs_memory_heap_used_bytes Memory used by heap`);
    metrics.push(`# TYPE nodejs_memory_heap_used_bytes gauge`);
    metrics.push(`nodejs_memory_heap_used_bytes ${memoryUsage.heapUsed}`);
    
    metrics.push(`# HELP nodejs_memory_heap_total_bytes Total heap memory`);
    metrics.push(`# TYPE nodejs_memory_heap_total_bytes gauge`);
    metrics.push(`nodejs_memory_heap_total_bytes ${memoryUsage.heapTotal}`);
    
    metrics.push(`# HELP nodejs_memory_rss_bytes Resident set size`);
    metrics.push(`# TYPE nodejs_memory_rss_bytes gauge`);
    metrics.push(`nodejs_memory_rss_bytes ${memoryUsage.rss}`);
    
    // Uptime metric
    metrics.push(`# HELP nodejs_uptime_seconds Uptime in seconds`);
    metrics.push(`# TYPE nodejs_uptime_seconds gauge`);
    metrics.push(`nodejs_uptime_seconds ${uptime}`);
    
    // HTTP request counter (if you add middleware to track this)
    metrics.push(`# HELP http_requests_total Total HTTP requests`);
    metrics.push(`# TYPE http_requests_total counter`);
    metrics.push(`http_requests_total 0`);
    
    return new Response(metrics.join('\n') + '\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to generate metrics',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

