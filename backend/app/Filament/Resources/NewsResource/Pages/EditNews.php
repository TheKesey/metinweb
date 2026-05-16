<?php

namespace App\Filament\Resources\NewsResource\Pages;

use App\Filament\Resources\NewsResource;
use App\Models\Language;
use App\Models\News;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditNews extends EditRecord
{
    protected static string $resource = NewsResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        /** @var News $news */
        $news = $this->record;
        $news->load('translations');

        foreach (Language::active()->where('is_default', false) as $lang) {
            $trans = $news->translations->firstWhere('locale', $lang->code);
            $data["title_{$lang->code}"]   = $trans?->title   ?? '';
            $data["content_{$lang->code}"] = $trans?->content ?? '';
        }

        return $data;
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $extraLangs = Language::active()->where('is_default', false);

        foreach ($extraLangs as $lang) {
            $title   = $data["title_{$lang->code}"]   ?? null;
            $content = $data["content_{$lang->code}"] ?? null;
            unset($data["title_{$lang->code}"], $data["content_{$lang->code}"]);

            /** @var News $record */
            if ($title || $content) {
                $record->translations()->updateOrCreate(
                    ['locale'  => $lang->code],
                    ['title'   => $title   ?? $record->title,
                     'content' => $content ?? $record->content]
                );
            } else {
                $record->translations()->where('locale', $lang->code)->delete();
            }
        }

        $record->update($data);
        return $record;
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()->label('Törlés'),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
