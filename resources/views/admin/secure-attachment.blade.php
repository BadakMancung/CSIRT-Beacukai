<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Attachment Management - CSIRT Bea Cukai</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="min-h-screen p-6">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">
                            <i class="fas fa-shield-alt text-blue-600 mr-2"></i>
                            Secure Attachment Management
                        </h1>
                        <p class="text-gray-600 mt-1">Level 3 Enterprise Security</p>
                    </div>
                    <div class="text-sm text-gray-500">
                        <i class="fas fa-user mr-1"></i>
                        Admin: {{ auth()->user()->email ?? 'System' }}
                    </div>
                </div>
            </div>

            <!-- File Info Card -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">
                    <i class="fas fa-file-alt mr-2"></i>
                    File Information
                </h2>
                
                <div id="fileInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600">File ID:</span>
                            <span id="fileId" class="text-gray-800">Loading...</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600">Original Name:</span>
                            <span id="originalName" class="text-gray-800">Loading...</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600">File Size:</span>
                            <span id="fileSize" class="text-gray-800">Loading...</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600">MIME Type:</span>
                            <span id="mimeType" class="text-gray-800">Loading...</span>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600">Access Count:</span>
                            <span id="accessCount" class="text-gray-800">Loading...</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600">Expires At:</span>
                            <span id="expiresAt" class="text-gray-800">Loading...</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600">Status:</span>
                            <span id="status" class="text-gray-800">Loading...</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-600">Created:</span>
                            <span id="createdAt" class="text-gray-800">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">
                    <i class="fas fa-cogs mr-2"></i>
                    File Actions
                </h2>
                
                <div class="flex flex-wrap gap-3">
                    <button onclick="downloadFile()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
                        <i class="fas fa-download mr-2"></i>
                        Download File
                    </button>
                    
                    <button onclick="generateTempAccess()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200">
                        <i class="fas fa-link mr-2"></i>
                        Generate Temp Link
                    </button>
                    
                    <button onclick="expireFile()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200">
                        <i class="fas fa-ban mr-2"></i>
                        Expire File
                    </button>
                    
                    <button onclick="refreshData()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200">
                        <i class="fas fa-sync-alt mr-2"></i>
                        Refresh
                    </button>
                </div>
            </div>

            <!-- Access Logs -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">
                    <i class="fas fa-history mr-2"></i>
                    Access Logs
                </h2>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full table-auto">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            </tr>
                        </thead>
                        <tbody id="accessLogs" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="6" class="px-4 py-8 text-center text-gray-500">Loading access logs...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <div id="tempAccessModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Generate Temporary Access</h3>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Expires in (minutes)</label>
                    <input type="number" id="tempAccessMinutes" value="60" min="1" max="1440" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex justify-end space-x-3">
                    <button onclick="closeTempAccessModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                    <button onclick="confirmGenerateTempAccess()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Generate</button>
                </div>
            </div>
        </div>
    </div>

    <div id="tempLinkModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Temporary Access Link Generated</h3>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Access URL:</label>
                    <div class="flex">
                        <input type="text" id="tempAccessUrl" readonly class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm">
                        <button onclick="copyTempLink()" class="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">Expires: <span id="tempLinkExpires"></span></p>
                </div>
                <div class="flex justify-end">
                    <button onclick="closeTempLinkModal()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Close</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const fileId = '{{ $fileId ?? '' }}';
        
        // Load file data on page load
        document.addEventListener('DOMContentLoaded', function() {
            if (fileId) {
                loadFileInfo();
                loadAccessLogs();
            }
        });

        async function loadFileInfo() {
            try {
                const response = await fetch(`/admin/secure-attachments/${fileId}/info`);
                const data = await response.json();
                
                if (data.success) {
                    const info = data.data;
                    document.getElementById('fileId').textContent = info.file_id || 'N/A';
                    document.getElementById('originalName').textContent = info.original_name || 'N/A';
                    document.getElementById('fileSize').textContent = formatFileSize(info.file_size);
                    document.getElementById('mimeType').textContent = info.mime_type || 'N/A';
                    document.getElementById('accessCount').textContent = info.access_count || '0';
                    document.getElementById('expiresAt').textContent = formatDate(info.expires_at);
                    document.getElementById('status').innerHTML = info.is_active ? 
                        '<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>Active</span>' : 
                        '<span class="text-red-600"><i class="fas fa-times-circle mr-1"></i>Inactive</span>';
                    document.getElementById('createdAt').textContent = formatDate(info.created_at);
                } else {
                    showError('Failed to load file information');
                }
            } catch (error) {
                showError('Error loading file information');
            }
        }

        async function loadAccessLogs() {
            try {
                const response = await fetch(`/admin/secure-attachments/${fileId}/logs`);
                const data = await response.json();
                
                if (data.success) {
                    const logs = data.data;
                    const tbody = document.getElementById('accessLogs');
                    
                    if (logs.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No access logs found</td></tr>';
                        return;
                    }
                    
                    tbody.innerHTML = logs.map(log => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-2 text-sm text-gray-900">${formatDate(log.timestamp)}</td>
                            <td class="px-4 py-2 text-sm">
                                <span class="px-2 py-1 text-xs rounded-full ${getActionBadgeClass(log.access_type)}">
                                    ${log.access_type}
                                </span>
                            </td>
                            <td class="px-4 py-2 text-sm text-gray-900">${log.user || 'N/A'}</td>
                            <td class="px-4 py-2 text-sm text-gray-500">${log.ip_address || 'N/A'}</td>
                            <td class="px-4 py-2 text-sm">
                                ${log.success ? 
                                    '<span class="text-green-600"><i class="fas fa-check mr-1"></i>Success</span>' : 
                                    '<span class="text-red-600"><i class="fas fa-times mr-1"></i>Failed</span>'
                                }
                            </td>
                            <td class="px-4 py-2 text-sm text-gray-500">${log.reason || 'N/A'}</td>
                        </tr>
                    `).join('');
                } else {
                    document.getElementById('accessLogs').innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Failed to load access logs</td></tr>';
                }
            } catch (error) {
                document.getElementById('accessLogs').innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Error loading access logs</td></tr>';
            }
        }

        function downloadFile() {
            window.open(`/admin/secure-attachments/${fileId}/download`, '_blank');
        }

        function generateTempAccess() {
            document.getElementById('tempAccessModal').classList.remove('hidden');
        }

        function closeTempAccessModal() {
            document.getElementById('tempAccessModal').classList.add('hidden');
        }

        async function confirmGenerateTempAccess() {
            const minutes = document.getElementById('tempAccessMinutes').value;
            
            try {
                const response = await fetch(`/admin/secure-attachments/${fileId}/temp-access`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({ expires_in_minutes: parseInt(minutes) })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('tempAccessUrl').value = data.data.access_url;
                    document.getElementById('tempLinkExpires').textContent = formatDate(data.data.expires_at);
                    closeTempAccessModal();
                    document.getElementById('tempLinkModal').classList.remove('hidden');
                } else {
                    showError('Failed to generate temporary access link');
                }
            } catch (error) {
                showError('Error generating temporary access link');
            }
        }

        function closeTempLinkModal() {
            document.getElementById('tempLinkModal').classList.add('hidden');
        }

        function copyTempLink() {
            const input = document.getElementById('tempAccessUrl');
            input.select();
            document.execCommand('copy');
            showSuccess('Link copied to clipboard!');
        }

        async function expireFile() {
            if (!confirm('Are you sure you want to expire this file? This action cannot be undone.')) {
                return;
            }
            
            try {
                const response = await fetch(`/admin/secure-attachments/${fileId}/expire`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({ reason: 'Manual expiration by admin' })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showSuccess('File expired successfully');
                    refreshData();
                } else {
                    showError('Failed to expire file');
                }
            } catch (error) {
                showError('Error expiring file');
            }
        }

        function refreshData() {
            loadFileInfo();
            loadAccessLogs();
        }

        // Utility functions
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function formatDate(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleString('id-ID');
        }

        function getActionBadgeClass(action) {
            const classes = {
                'upload': 'bg-blue-100 text-blue-800',
                'download': 'bg-green-100 text-green-800',
                'expire': 'bg-red-100 text-red-800',
                'temp_token_generated': 'bg-yellow-100 text-yellow-800',
                'temp_url_generated': 'bg-purple-100 text-purple-800'
            };
            return classes[action] || 'bg-gray-100 text-gray-800';
        }

        function showSuccess(message) {
            // Simple success notification - you can replace with a more sophisticated toast
            alert('✅ ' + message);
        }

        function showError(message) {
            // Simple error notification - you can replace with a more sophisticated toast
            alert('❌ ' + message);
        }
    </script>
</body>
</html>
