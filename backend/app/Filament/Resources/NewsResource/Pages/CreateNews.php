<?php

namespace App\Filament\Resources\NewsResource\Pages;

use App\Filament\Resources\NewsResource;
use App\Models\Language;
use App\Models\News;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CreateNews extends CreateRecord
{
    protected static string $resource = NewsResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['user_id'] = Auth::id();
        return $data;
    }

    protected function handleRecordCreation(array $data): Model
    {
        $extraLangs = Language::active()->where('is_default', false);

        foreach ($extraLangs as $lang) {
            unset($data["title_{$lang->code}"], $data["content_{$lang->code}"]);
        }

        /** @var News $record */
        $record = static::getModel()::create($data);

        foreach ($extraLangs as $lang) {
            $title   = request("title_{$lang->code}");
            $content = request("content_{$lang->code}");
            if ($title || $content) {
                $record->translations()->create([
                    'locale'  => $lang->code,
                    'title'   => $title   ?? $record->title,
                    'content' => $content ?? $record->content,
                ]);
            }
        }

        return $record;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
