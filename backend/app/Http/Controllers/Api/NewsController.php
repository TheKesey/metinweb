<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->get('per_page', 12), 20);
        $since   = $request->get('since');
        $type    = $request->get('type');

        $query = News::with('user:id,name')
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc');

        if ($type && in_array($type, ['news', 'patch', 'event'])) {
            $query->where('type', $type);
        }

        if ($since) {
            try {
                $query->where('published_at', '>=', Carbon::parse($since));
            } catch (\Exception) {
                // invalid date, ignore
            }
        }

        return response()->json($query->paginate($perPage));
    }

    public function show(News $news): JsonResponse
    {
        if ($news->status !== 'published') {
            abort(404);
        }

        $news->load('user:id,name');

        return response()->json($news);
    }
}
