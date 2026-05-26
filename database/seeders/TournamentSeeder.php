<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Team;
use App\Models\Player;

class TournamentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $madrid = Team::create([
            'name' => 'Real Madrid',
            'coach' => 'Carlo Ancelotti',
            'points' => 12,
            'played' => 4,
            'won' => 4,
        ]);

        $united = Team::create([
            'name' => 'Manchester United',
            'coach' => 'Rúben Amorim',
            'points' => 6,
            'played' => 4,
            'won' => 2,
            'lost' => 2,
        ]);

        $barcelona = Team::create([
            'name' => 'Barcelona',
            'coach' => 'Hansi Flick',
            'points' => 9,
            'played' => 4,
            'won' => 3,
            'lost' => 1,
        ]);

        $arsenal = Team::create([
            'name' => 'Arsenal',
            'coach' => 'Mikel Arteta',
            'points' => 7,
            'played' => 4,
            'won' => 2,
            'drawn' => 1,
            'lost' => 1,
        ]);

        Player::create(['team_id' => $madrid->id, 'name' => 'Jude Bellingham', 'position' => 'Midfielder', 'goals' => 5]);
        Player::create(['team_id' => $madrid->id, 'name' => 'Vinicius Jr', 'position' => 'Forward', 'goals' => 4]);
        
        Player::create(['team_id' => $united->id, 'name' => 'Bruno Fernandes', 'position' => 'Midfielder', 'goals' => 3]);
        Player::create(['team_id' => $united->id, 'name' => 'Marcus Rashford', 'position' => 'Forward', 'goals' => 2]);

        Player::create(['team_id' => $barcelona->id, 'name' => 'Robert Lewandowski', 'position' => 'Forward', 'goals' => 6]);
        Player::create(['team_id' => $barcelona->id, 'name' => 'Lamine Yamal', 'position' => 'Forward', 'goals' => 3]);

        Player::create(['team_id' => $arsenal->id, 'name' => 'Bukayo Saka', 'position' => 'Forward', 'goals' => 4]);
        Player::create(['team_id' => $arsenal->id, 'name' => 'Martin Ødegaard', 'position' => 'Midfielder', 'goals' => 1]);
    }
}
