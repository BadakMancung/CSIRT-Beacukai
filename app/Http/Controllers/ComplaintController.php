<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ComplaintController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    public function index()
    {
        // Untuk admin - melihat semua aduan
        $complaints = Complaint::latest('created_at');
        
        $stats = [
            'total' => $complaints->count(),
            'pending' => Complaint::pending()->count(),
            'in_progress' => Complaint::inProgress()->count(),
            'resolved' => Complaint::resolved()->count(),
            'high_priority' => Complaint::highPriority()->count(),
        ];

        return inertia('Admin/Complaints/Index', [
            'complaints' => $complaints,
            'stats' => $stats
        ]);
    }

    public function create()
    {
        // Form untuk user submit aduan
        return inertia('Complaints/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telepon' => 'required|string|max:20',
            'instansi' => 'required|string|max:255',
            'jenis_aduan' => 'required|in:keamanan_siber,malware,phishing,data_breach,akses_tidak_sah,lainnya',
            'subjek' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_kejadian' => 'required|date',
            'lampiran' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
        ]);

        // Handle file upload
        if ($request->hasFile('lampiran')) {
            $file = $request->file('lampiran');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('complaints', $filename, 'public');
            $validated['lampiran'] = $path;
        }

        // Set default values
        $validated['status'] = 'pending';
        $validated['prioritas'] = $this->determinePriority($validated['jenis_aduan']);
        $validated['admin_notes'] = '';

        // Create complaint
        $complaint = Complaint::create($validated);

        // Send notification to admins
        $this->notificationService->sendComplaintNotification($complaint);

        return back()->with('success', 'Aduan berhasil dikirim! ID Aduan: #' . $complaint['id'] ?? 'AUTO');
    }

    public function show($id)
    {
        $complaint = Complaint::find($id);
        
        if (!$complaint) {
            return back()->with('error', 'Aduan tidak ditemukan.');
        }

        return inertia('Admin/Complaints/Show', [
            'complaint' => $complaint
        ]);
    }

    public function update(Request $request, $id)
    {
        $complaint = Complaint::find($id);
        
        if (!$complaint) {
            return back()->with('error', 'Aduan tidak ditemukan.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,resolved,closed',
            'prioritas' => 'required|in:low,medium,high,critical',
            'admin_notes' => 'nullable|string'
        ]);

        // Update complaint using BaseModel method
        $complaintModel = new Complaint();
        $complaintModel->id = $id;
        $complaintModel->update($validated);

        return back()->with('success', 'Status aduan berhasil diperbarui.');
    }

    public function downloadSpreadsheet()
    {
        // Download spreadsheet file untuk admin
        $filePath = storage_path('app/spreadsheets/complaints.csv');
        
        if (!file_exists($filePath)) {
            return back()->with('error', 'File spreadsheet tidak ditemukan.');
        }

        return response()->download($filePath, 'aduan_csirt_' . date('Y-m-d') . '.csv');
    }

    private function determinePriority($jenisAduan)
    {
        $highPriorityTypes = ['data_breach', 'akses_tidak_sah', 'malware'];
        $mediumPriorityTypes = ['keamanan_siber', 'phishing'];
        
        if (in_array($jenisAduan, $highPriorityTypes)) {
            return 'high';
        } elseif (in_array($jenisAduan, $mediumPriorityTypes)) {
            return 'medium';
        } else {
            return 'low';
        }
    }
}
