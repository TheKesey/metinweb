<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            ['code' => 'hu', 'name' => 'Magyar',  'flag' => '🇭🇺', 'is_default' => true,  'is_active' => true, 'sort_order' => 0],
            ['code' => 'en', 'name' => 'English', 'flag' => '🇬🇧', 'is_default' => false, 'is_active' => true, 'sort_order' => 1],
        ];

        foreach ($languages as $lang) {
            Language::updateOrCreate(['code' => $lang['code']], $lang);
        }
    }
}
