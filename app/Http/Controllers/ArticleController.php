<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Services\SpreadsheetService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Use the same approach as public pages - leverage Article model
        $articles = Article::all()->sortByDesc('created_at');
        
        // Manual pagination for Collection
        $page = request()->get('page', 1);
        $perPage = 10;
        
        $paginatedArticles = new \Illuminate\Pagination\LengthAwarePaginator(
            $articles->forPage($page, $perPage)->values(),
            $articles->count(),
            $perPage,
            $page,
            ['path' => request()->url(), 'pageName' => 'page']
        );

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $paginatedArticles,
            'storage_driver' => config('app.storage_driver', 'database')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Articles/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'author' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('articles', 'public');
            $validated['image'] = $imagePath;
            $validated['image_url'] = asset('storage/' . $imagePath);
        }

        if (!isset($validated['published_at']) && $validated['is_published']) {
            $validated['published_at'] = now();
        }

        // Add default author if not provided
        $validated['author'] = $validated['author'] ?? 'Admin';

        try {
            // Use Article model which handles both database and spreadsheet
            Article::create($validated);
            
            Log::info('Article successfully created', ['data' => $validated]);
            return redirect()->route('articles.index')
                ->with('success', 'Article berhasil disimpan!');
        } catch (\Exception $e) {
            Log::error('Failed to save article', ['error' => $e->getMessage()]);
            return back()->with('error', 'Gagal menyimpan article: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $article = Article::find($id);
        
        if (!$article) {
            abort(404);
        }

        return Inertia::render('Admin/Articles/Show', [
            'article' => $article
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $article = Article::find($id);
        
        if (!$article) {
            abort(404);
        }

        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $article = Article::find($id);
        
        if (!$article) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'author' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if (isset($article['image']) && $article['image']) {
                Storage::disk('public')->delete($article['image']);
            }
            $imagePath = $request->file('image')->store('articles', 'public');
            $validated['image'] = $imagePath;
            $validated['image_url'] = asset('storage/' . $imagePath);
        }

        if (!isset($validated['published_at']) && $validated['is_published'] && !isset($article['published_at'])) {
            $validated['published_at'] = now();
        }

        try {
            // Use Article model's update method for spreadsheet
            if (config('app.storage_driver') === 'spreadsheet') {
                // Since Article model returns array, we need to use SpreadsheetService directly
                $spreadsheetService = new SpreadsheetService();
                $spreadsheetService->update('articles', (int)$id, $validated);
            } else {
                // For database, use Eloquent
                \App\Models\Eloquent\Article::find($id)->update($validated);
            }

            return redirect()->route('articles.index')->with('success', 'Article updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update article', ['error' => $e->getMessage()]);
            return back()->with('error', 'Gagal mengupdate article: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $article = Article::find($id);
        
        if (!$article) {
            abort(404);
        }

        try {
            // Delete image if exists
            if (isset($article['image']) && $article['image']) {
                Storage::disk('public')->delete($article['image']);
            }

            // Delete article using appropriate method
            if (config('app.storage_driver') === 'spreadsheet') {
                $spreadsheetService = new SpreadsheetService();
                $spreadsheetService->delete('articles', (int)$id);
            } else {
                \App\Models\Eloquent\Article::find($id)->delete();
            }

            return redirect()->route('articles.index')->with('success', 'Article deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete article', ['error' => $e->getMessage()]);
            return back()->with('error', 'Gagal menghapus article: ' . $e->getMessage());
        }
    }
}
