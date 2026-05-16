<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsController extends Controller
{

    public function index(Request $request): JsonResponse
    {
        $perPage  = min((int) $request->input('per_page', 12), 50);
        $type     = $request->input('type');
        $beforeId = $request->integer('before_id') ?: null;
        $afterId  = $request->integer('after_id') ?: null;
        $locale   = $this->resolveLocale($request->input('locale', 'hu'));

        $query = News::with(['user:id,name', 'translations'])
            ->where('status', 'published')
            ->whereNotNull('published_at');

        if ($type && in_array($type, ['news', 'patch', 'event'])) {
            $query->where('type', $type);
        }

        if ($afterId) {
            $items = $query->where('id', '>', $afterId)->orderBy('id', 'desc')->get();
            return response()->json([
                'data'     => $items->map(fn($n) => $this->format($n, $locale))->values(),
                'has_more' => false,
            ]);
        }

        if ($beforeId) {
            $query->where('id', '<', $beforeId);
        }

        $items   = $query->orderBy('id', 'desc')->limit($perPage + 1)->get();
        $hasMore = $items->count() > $perPage;

        return response()->json([
            'data'     => $items->take($perPage)->map(fn($n) => $this->format($n, $locale))->values(),
            'has_more' => $hasMore,
        ]);
    }

    public function show(Request $request, News $news): JsonResponse
    {
        if ($news->status !== 'published') {
            abort(404);
        }

        $news->load(['user:id,name', 'translations']);
        $locale = $this->resolveLocale($request->input('locale', 'hu'));

        return response()->json($this->format($news, $locale));
    }

    private function format(News $news, string $locale): array
    {
        ['title' => $title, 'content' => $content] = $news->resolveLocale($locale);
        $readMin = max(1, (int) ceil(str_word_count(strip_tags($content)) / 200));

        return [
            'id'           => $news->id,
            'title'        => $title,
            'content'      => $content,
            'slug'         => $news->slug,
            'image_url'    => $news->image_url,
            'type'         => $news->type,
            'published_at' => $news->published_at,
            'read_min'     => $readMin,
            'user'         => $news->user,
        ];
    }

    private function resolveLocale(string $requested): string
    {
        $active = Language::active();
        if ($active->firstWhere('code', $requested)) return $requested;
        return $active->firstWhere('is_default', true)?->code ?? 'hu';
    }
}
