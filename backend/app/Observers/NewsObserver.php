<?php

namespace App\Observers;

use App\Events\NewsPublished;
use App\Models\News;

class NewsObserver
{
    public function saved(News $news): void
    {
        if (
            $news->status === 'published' &&
            ($news->wasRecentlyCreated || $news->wasChanged('status'))
        ) {
            NewsPublished::dispatch($news);
        }
    }
}
