<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeceasedRecordController;
use App\Http\Controllers\PaymentRecordController;
use App\Http\Controllers\RenewalRecordController;
use App\Http\Controllers\NoticeDistributionController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\EmployerController;
use Inertia\Inertia;

// Guest routes - wrapped in guest middleware to prevent authenticated users from accessing
Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return view('login');
    })->name('login');

    Route::get('/login', function () {
        return view('login');
    });

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

    Route::get('/register', function () {
        return view('register');
    })->name('register');

    Route::post('/register', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile_number' => 'required|string|regex:/^[0-9]{11}$/|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'mobile_number' => $validated['mobile_number'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);

        return redirect('/dashboard');
    });
});

// Logout route - accessible to authenticated users
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    // Return JSON response for AJAX requests (from our fetch call)
    if ($request->expectsJson() || $request->ajax()) {
        return response()->json([
            'success' => true,
            'message' => 'You have been logged out successfully.'
        ]);
    }

    // Fallback redirect for non-AJAX requests
    return redirect('/login')
        ->with('message', 'You have been logged out successfully.');
})->middleware('auth')->name('logout');

// Authenticated routes
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

    Route::resource('employers', EmployerController::class);

    Route::post('/employers/{employer}/verify-password', [EmployerController::class, 'verifyPassword'])
        ->name('employers.verify-password');
});