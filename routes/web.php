<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeceasedRecordController;
use App\Http\Controllers\PaymentRecordController;
use App\Http\Controllers\RenewalRecordController;
use App\Http\Controllers\NoticeDistributionController;
use App\Http\Controllers\MapController;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/dashboard');
    }
    return view('login');
})->name('login');

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials, $request->filled('remember'))) {
        $request->session()->regenerate();
        return redirect()->intended('/dashboard');
    }

    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ])->onlyInput('email');
});

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Deceased Records
    Route::resource('deceased', DeceasedRecordController::class);

    // Payment Records
    Route::resource('payments', PaymentRecordController::class);

    // Renewal Records
    Route::resource('renewals', RenewalRecordController::class);

    // Notice Distributions
    Route::resource('notices', NoticeDistributionController::class);
    Route::post('notices/{notice}/resend', [NoticeDistributionController::class, 'resend'])->name('notices.resend');

    // Map
    Route::get('/map', [MapController::class, 'index'])->name('map.index');
});
