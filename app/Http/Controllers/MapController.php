<?php

namespace App\Http\Controllers;

use App\Models\DeceasedRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        $deceased = DeceasedRecord::select(
            'id',
            'fullname',
            'tomb_number',
            'tomb_location',
            'next_of_kin_name',
            'contact_number',
            'birthday',
            'date_of_death',
            'next_of_kin_relationship',
            'email',
            'address',
            'payment_status'
        )->get();

        return Inertia::render('Map/Index', [
            'deceased' => $deceased
        ]);
    }
}
