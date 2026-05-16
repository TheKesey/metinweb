<?php

namespace App\Events;

use App\Models\News;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewsPublished implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public readonly News $news) {}

    public function broadcastOn(): Channel
    {
        return new Channel('news');
    }

    public function broadcastAs(): string
    {
        return 'published';
    }

    public function broadcastWith(): array
    {
        return ['id' => $this->news->id];
    }
}
