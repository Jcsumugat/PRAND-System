<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
<<<<<<< HEAD
use Illuminate\Support\Facades\Hash;
use App\Models\User;
=======
>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeceasedRecordController;
use App\Http\Controllers\PaymentRecordController;
use App\Http\Controllers\RenewalRecordController;
use App\Http\Controllers\NoticeDistributionController;
use App\Http\Controllers\MapController;
<<<<<<< HEAD
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
=======

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

>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
<<<<<<< HEAD

    // Redirect to login with a proper response
    return redirect('/login')->with('message', 'You have been logged out successfully.');
})->middleware('auth')->name('logout');

// Authenticated routes
=======
    return redirect('/');
})->name('logout');

>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
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
<<<<<<< HEAD

    Route::resource('employers', EmployerController::class);
=======
>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
});
