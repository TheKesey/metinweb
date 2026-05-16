<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LanguageResource\Pages;
use App\Models\Language;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class LanguageResource extends Resource
{
    protected static ?string $model = Language::class;
    protected static ?string $navigationIcon  = 'heroicon-o-language';
    protected static ?string $navigationLabel = 'Nyelvek';
    protected static ?string $modelLabel      = 'Nyelv';
    protected static ?string $pluralModelLabel = 'Nyelvek';
    protected static ?string $navigationGroup = 'Beállítások';
    protected static ?int    $navigationSort  = 10;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('code')
                ->label('Kód')
                ->required()
                ->maxLength(5)
                ->placeholder('en')
                ->helperText('Pl. hu, en, de, fr')
                ->unique(Language::class, 'code', ignoreRecord: true),
            Forms\Components\TextInput::make('name')
                ->label('Neve')
                ->required()
                ->maxLength(64)
                ->placeholder('English'),
            Forms\Components\TextInput::make('flag')
                ->label('Zászló emoji')
                ->maxLength(10)
                ->placeholder('🇬🇧'),
            Forms\Components\TextInput::make('sort_order')
                ->label('Sorrend')
                ->numeric()
                ->default(0),
            Forms\Components\Toggle::make('is_active')
                ->label('Aktív')
                ->default(true),
            Forms\Components\Toggle::make('is_default')
                ->label('Alapértelmezett')
                ->helperText('Csak egy nyelv lehet alapértelmezett.')
                ->default(false),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('flag')->label('')->width(40),
                Tables\Columns\TextColumn::make('code')->label('Kód')->badge()->color('gray'),
                Tables\Columns\TextColumn::make('name')->label('Neve')->sortable(),
                Tables\Columns\IconColumn::make('is_default')->label('Alapért.')->boolean(),
                Tables\Columns\IconColumn::make('is_active')->label('Aktív')->boolean(),
                Tables\Columns\TextColumn::make('sort_order')->label('Sorrend')->sortable(),
            ])
            ->defaultSort('sort_order')
            ->actions([
                Tables\Actions\EditAction::make()->label('Szerkesztés'),
            ])
            ->reorderable('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListLanguages::route('/'),
            'create' => Pages\CreateLanguage::route('/create'),
            'edit'   => Pages\EditLanguage::route('/{record}/edit'),
        ];
    }
}
