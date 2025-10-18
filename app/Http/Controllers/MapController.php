<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        $deceased = DeceasedRecord::select('id', 'fullname', 'tomb_number', 'tomb_location', 'section', 'row')
            ->get();

        return Inertia::render('Map/Index', [
            'deceased' => $deceased
        ]);
    }
}
