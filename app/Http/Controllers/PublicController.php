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
            ->latest('published_at')
            ->take(6)
            ->get();

        return Inertia::render('Public/Home', [
            'articles' => $articles
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
        $upcomingEvents = Event::published()
            ->upcoming()
            ->latest('event_date')
            ->get();

        $pastEvents = Event::published()
            ->past()
            ->latest('event_date')
            ->take(10)
            ->get();

        return Inertia::render('Public/Events', [
            'upcomingEvents' => $upcomingEvents,
            'pastEvents' => $pastEvents
        ]);
    }

    public function contact()
    {
        return Inertia::render('Public/Contact');
    }

    public function articles()
    {
        $articles = Article::published()
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('Public/Articles', [
            'articles' => $articles
        ]);
    }

    public function articleShow($id)
    {
        $article = Article::published()->findOrFail($id);
        
        $relatedArticles = Article::published()
            ->where('id', '!=', $id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Public/ArticleShow', [
            'article' => $article,
            'relatedArticles' => $relatedArticles
        ]);
    }

    public function eventShow($id)
    {
        $event = Event::published()->findOrFail($id);

        return Inertia::render('Public/EventShow', [
            'event' => $event
        ]);
    }
}
