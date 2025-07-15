<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\Event;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        $articles = Article::published()
            ->sortByDesc('published_at')
            ->take(6);

        return Inertia::render('Public/Home', [
            'articles' => $articles->values()->all()
        ]);
    }

    public function about()
    {
        return Inertia::render('Public/About');
    }

    public function services()
    {
        return Inertia::render('Public/Services');
    }

    public function events()
    {
        $upcomingEvents = Event::upcoming()
            ->filter(function($event) {
                return $event['is_published'] === true;
            })
            ->sortByDesc('event_date');

        $pastEvents = Event::past()
            ->filter(function($event) {
                return $event['is_published'] === true;
            })
            ->sortByDesc('event_date')
            ->take(10);

        return Inertia::render('Public/Events', [
            'upcomingEvents' => $upcomingEvents->values()->all(),
            'pastEvents' => $pastEvents->values()->all()
        ]);
    }

    public function contact()
    {
        return Inertia::render('Public/Contact');
    }

    public function articles()
    {
        $articles = Article::published()
            ->sortByDesc('published_at');

        // Simulate pagination manually since we're using Collection
        $perPage = 9;
        $currentPage = request()->get('page', 1);
        $offset = ($currentPage - 1) * $perPage;
        
        $items = $articles->slice($offset, $perPage)->values();
        $total = $articles->count();
        
        $paginatedData = [
            'data' => $items->all(),
            'current_page' => $currentPage,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'total' => $total
        ];

        return Inertia::render('Public/Articles', [
            'articles' => $paginatedData
        ]);
    }

    public function articleShow($id)
    {
        $article = Article::find($id);
        
        if (!$article || !$article['is_published']) {
            abort(404);
        }
        
        $relatedArticles = Article::published()
            ->reject(function($item) use ($id) {
                return $item['id'] == $id;
            })
            ->sortByDesc('published_at')
            ->take(3);

        return Inertia::render('Public/ArticleShow', [
            'article' => $article,
            'relatedArticles' => $relatedArticles->values()->all()
        ]);
    }

    public function eventShow($id)
    {
        $event = Event::find($id);
        
        if (!$event || !$event['is_published']) {
            abort(404);
        }

        return Inertia::render('Public/EventShow', [
            'event' => $event
        ]);
    }

    public function sitemap()
    {
        $articles = Article::published()->sortByDesc('published_at');
        $events = Event::all()->filter(function($event) {
            return $event['is_published'] === true;
        });

        $urls = collect([
            [
                'url' => route('home'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'daily',
                'priority' => '1.0'
            ],
            [
                'url' => route('about'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.8'
            ],
            [
                'url' => route('services'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.8'
            ],
            [
                'url' => route('public.events'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'weekly',
                'priority' => '0.8'
            ],
            [
                'url' => route('public.articles'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'daily',
                'priority' => '0.9'
            ],
            [
                'url' => route('contact'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'monthly',
                'priority' => '0.7'
            ],
            [
                'url' => route('rfc2350'),
                'lastmod' => now()->toDateString(),
                'changefreq' => 'yearly',
                'priority' => '0.6'
            ]
        ]);

        // Add articles to sitemap
        foreach ($articles as $article) {
            $urls->push([
                'url' => route('public.articles.show', $article['id']),
                'lastmod' => $article['updated_at'] ?? $article['created_at'],
                'changefreq' => 'monthly',
                'priority' => '0.7'
            ]);
        }

        // Add events to sitemap
        foreach ($events as $event) {
            $urls->push([
                'url' => route('public.events.show', $event['id']),
                'lastmod' => $event['updated_at'] ?? $event['created_at'],
                'changefreq' => 'monthly',
                'priority' => '0.6'
            ]);
        }

        $xml = view('sitemap', compact('urls'))->render();

        return response($xml, 200, [
            'Content-Type' => 'application/xml'
        ]);
    }

    public function robots()
    {
        $content = "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Disallow: /admin/\n";
        $content .= "Disallow: /dashboard/\n";
        $content .= "Disallow: /test/\n";
        $content .= "\n";
        $content .= "Sitemap: " . route('sitemap') . "\n";

        return response($content, 200, [
            'Content-Type' => 'text/plain'
        ]);
    }
}
