<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Team::orderBy('points', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'coach' => 'nullable|string|max:255',
        ]);

        $team = Team::create($validated);
        return response()->json($team, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        return response()->json($team->load('players'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Team $team)
    {
        $team->update($request->all());
        return response()->json($team);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        $team->delete();
        return response()->json(null, 204);
    }
}
