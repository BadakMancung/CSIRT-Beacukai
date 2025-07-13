<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\SpreadsheetService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Use the same approach as public pages - leverage Event model
        $events = Event::all()->sortByDesc('created_at');

        // Manual pagination for Collection
        $page = request()->get('page', 1);
        $perPage = 10;

        $paginatedEvents = new \Illuminate\Pagination\LengthAwarePaginator(
            $events->forPage($page, $perPage)->values(),
            $events->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'pageName' => 'page']
        );

        return Inertia::render('Admin/Events/Index', [
            'events' => $paginatedEvents,
            'storage_driver' => config('app.storage_driver', 'database')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Events/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'location' => 'nullable|string|max:255',
            'event_date' => 'required|date',
            'event_end_date' => 'nullable|date|after:event_date',
            'is_published' => 'boolean'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
            $validated['image'] = $imagePath;
            $validated['image_url'] = asset('storage/' . $imagePath);
        }

        try {
            // Use Event model which handles both database and spreadsheet
            Event::create($validated);

            Log::info('Event successfully created', ['data' => $validated]);
            return redirect()->route('events.index')
                ->with('success', 'Event berhasil disimpan!');
        } catch (\Exception $e) {
            Log::error('Failed to save event', ['error' => $e->getMessage()]);
            return back()->with('error', 'Gagal menyimpan event: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            abort(404);
        }

        return Inertia::render('Admin/Events/Show', [
            'event' => $event
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $event = Event::find($id);

        if (!$event) {
            abort(404);
        }

        return Inertia::render('Admin/Events/Edit', [
            'event' => $event
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $event = Event::find($id);
        
        if (!$event) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'location' => 'nullable|string|max:255',
            'event_date' => 'required|date',
            'event_end_date' => 'nullable|date|after:event_date',
            'is_published' => 'boolean'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if (isset($event['image']) && $event['image']) {
                Storage::disk('public')->delete($event['image']);
            }
            $imagePath = $request->file('image')->store('events', 'public');
            $validated['image'] = $imagePath;
            $validated['image_url'] = asset('storage/' . $imagePath);
        }

        try {
            // Use appropriate method for spreadsheet or database
            if (config('app.storage_driver') === 'spreadsheet') {
                $spreadsheetService = new SpreadsheetService();
                $spreadsheetService->update('events', (int)$id, $validated);
            } else {
                \App\Models\Eloquent\Event::find($id)->update($validated);
            }

            return redirect()->route('events.index')->with('success', 'Event updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update event', ['error' => $e->getMessage()]);
            return back()->with('error', 'Gagal mengupdate event: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $event = Event::find($id);
        
        if (!$event) {
            abort(404);
        }

        try {
            // Delete image if exists
            if (isset($event['image']) && $event['image']) {
                Storage::disk('public')->delete($event['image']);
            }

            // Delete event using appropriate method
            if (config('app.storage_driver') === 'spreadsheet') {
                $spreadsheetService = new SpreadsheetService();
                $spreadsheetService->delete('events', (int)$id);
            } else {
                \App\Models\Eloquent\Event::find($id)->delete();
            }

            return redirect()->route('events.index')->with('success', 'Event deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete event', ['error' => $e->getMessage()]);
            return back()->with('error', 'Gagal menghapus event: ' . $e->getMessage());
        }
    }
}
