<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class Level3SecurityFileAccess
{
    /**
     * Handle an incoming request for Level 3 Enterprise Security file access.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if the request is trying to access storage files directly
        $path = $request->path();
        
        // Block direct access to secure file paths
        if (str_contains($path, 'storage/contacts/') || 
            str_contains($path, 'storage/secure_contacts/') ||
            str_contains($path, 'storage/attachments/')) {
            
            // Log security violation
            Log::critical('LEVEL 3 SECURITY VIOLATION - Direct storage access attempt blocked', [
                'security_level' => 'Level-3-Enterprise-Protection',
                'blocked_path' => $path,
                'full_url' => $request->fullUrl(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referer' => $request->header('referer'),
                'timestamp' => now(),
                'violation_type' => 'direct_file_access_attempt'
            ]);
            
            // Return 403 Forbidden with security message
            return response()->json([
                'error' => 'Access Denied - Level 3 Enterprise Security Protection',
                'message' => 'Direct file access is not permitted. Files must be accessed through secure authenticated endpoints.',
                'security_level' => 'Level-3-Enterprise',
                'contact_admin' => 'Please contact system administrator for file access.',
                'timestamp' => now()
            ], 403)->header('X-Security-Level', 'Level-3-Enterprise');
        }
        
        return $next($request);
    }
}
