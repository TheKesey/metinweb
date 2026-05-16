<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsResource\Pages;
use App\Models\News;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class NewsResource extends Resource
{
    protected static ?string $model = News::class;
    protected static ?string $navigationIcon = 'heroicon-o-newspaper';
    protected static ?string $navigationLabel = 'Hírek';
    protected static ?string $modelLabel = 'Hír';
    protected static ?string $pluralModelLabel = 'Hírek';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Alapadatok')
                ->schema([
                    Forms\Components\TextInput::make('title')
                        ->label('Cím')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true)
                        ->afterStateUpdated(function (string $operation, $state, Forms\Set $set) {
                            if ($operation === 'create') {
                                $set('slug', Str::slug($state));
                            }
                        }),
                    Forms\Components\TextInput::make('slug')
                        ->label('Slug')
                        ->required()
                        ->maxLength(255)
                        ->unique(News::class, 'slug', ignoreRecord: true),
                    Forms\Components\Select::make('type')
                        ->label('Típus')
                        ->options([
                            'news'  => 'Hír',
                            'patch' => 'Patch',
                            'event' => 'Esemény',
                        ])
                        ->required()
                        ->default('news'),
                    Forms\Components\Select::make('status')
                        ->label('Státusz')
                        ->options([
                            'draft'     => 'Vázlat',
                            'published' => 'Publikált',
                        ])
                        ->required()
                        ->default('draft')
                        ->live()
                        ->afterStateUpdated(function ($state, Forms\Set $set) {
                            if ($state === 'published') {
                                $set('published_at', now()->toDateTimeString());
                            }
                        }),
                    Forms\Components\DateTimePicker::make('published_at')
                        ->label('Publikálás időpontja')
                        ->nullable()
                        ->seconds(false),
                ])->columns(2),

            Forms\Components\Section::make('Borítókép')
                ->schema([
                    Forms\Components\FileUpload::make('image')
                        ->label('Kép')
                        ->image()
                        ->disk('public')
                        ->directory('news')
                        ->imageEditor()
                        ->columnSpanFull(),
                ]),

            Forms\Components\Section::make('Tartalom')
                ->schema([
                    Forms\Components\RichEditor::make('content')
                        ->label('Tartalom')
                        ->required()
                        ->toolbarButtons([
                            'bold', 'italic', 'underline', 'strike',
                            'h2', 'h3',
                            'bulletList', 'orderedList',
                            'blockquote', 'codeBlock',
                            'link',
                            'undo', 'redo',
                        ])
                        ->columnSpanFull(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Kép')
                    ->disk('public')
                    ->square()
                    ->size(48),
                Tables\Columns\TextColumn::make('title')
                    ->label('Cím')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                Tables\Columns\TextColumn::make('type')
                    ->label('Típus')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'news'  => 'info',
                        'patch' => 'warning',
                        'event' => 'success',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'news'  => 'Hír',
                        'patch' => 'Patch',
                        'event' => 'Esemény',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->label('Státusz')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'draft'     => 'gray',
                        'published' => 'success',
                        default     => 'gray',
                    })
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'draft'     => 'Vázlat',
                        'published' => 'Publikált',
                        default     => $state,
                    }),
                Tables\Columns\TextColumn::make('published_at')
                    ->label('Publikálva')
                    ->dateTime('Y.m.d H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Szerző')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->label('Típus')
                    ->options([
                        'news'  => 'Hír',
                        'patch' => 'Patch',
                        'event' => 'Esemény',
                    ]),
                Tables\Filters\SelectFilter::make('status')
                    ->label('Státusz')
                    ->options([
                        'draft'     => 'Vázlat',
                        'published' => 'Publikált',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('Szerkesztés'),
                Tables\Actions\DeleteAction::make()->label('Törlés'),
            ])
            ->defaultSort('published_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListNews::route('/'),
            'create' => Pages\CreateNews::route('/create'),
            'edit'   => Pages\EditNews::route('/{record}/edit'),
        ];
    }
}
