<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use App\Models\User;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeceasedRecordController;
use App\Http\Controllers\PaymentRecordController;
use App\Http\Controllers\RenewalRecordController;
use App\Http\Controllers\NoticeDistributionController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\PaymentExpiryController;
use App\Http\Controllers\RenewalAlertController;
use Inertia\Inertia;

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

    Route::get('/forgot-password', function () {
        return view('forgot-password');
    })->name('password.request');

    Route::post('/forgot-password', function (Request $request) {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? back()->with(['status' => __($status)])
            : back()->withErrors(['email' => __($status)]);
    })->name('password.email');

    Route::get('/reset-password/{token}', function (string $token) {
        return view('reset-password', ['token' => $token, 'email' => request('email')]);
    })->name('password.reset');

    Route::post('/reset-password', function (Request $request) {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('login')->with('status', __($status))
            : back()->withErrors(['email' => [__($status)]]);
    })->name('password.store');
});

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    if ($request->expectsJson() || $request->ajax()) {
        return response()->json([
            'success' => true,
            'message' => 'You have been logged out successfully.'
        ]);
    }

    return redirect('/login')
        ->with('message', 'You have been logged out successfully.');
})->middleware('auth')->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('deceased', DeceasedRecordController::class);

    Route::resource('payments', PaymentRecordController::class);
    Route::get('/deceased/{deceased}/payment-history', [PaymentRecordController::class, 'paymentHistory'])
        ->name('deceased.payment-history');

    Route::resource('renewals', RenewalRecordController::class);

    Route::resource('notices', NoticeDistributionController::class);
    Route::post('notices/{notice}/resend', [NoticeDistributionController::class, 'resend'])
        ->name('notices.resend');

    Route::get('/map', [MapController::class, 'index'])->name('map.index');

    Route::resource('employers', EmployerController::class);

    Route::post('/verify-current-password', [EmployerController::class, 'verifyCurrentPassword'])
        ->name('verify.current.password');

    Route::post('/employers/{employer}/verify-password', [EmployerController::class, 'verifyPassword'])
        ->name('employers.verify-password');

    Route::prefix('api')->group(function () {
        Route::get('/expiring-payments', [PaymentExpiryController::class, 'getExpiringPayments']);
        Route::get('/expiring-records-list', [PaymentExpiryController::class, 'getExpiringRecordsList']);
        Route::get('/upcoming-renewals', [RenewalAlertController::class, 'getUpcomingRenewals'])
            ->name('renewals.upcoming');
        Route::get('/overdue-renewals', [RenewalAlertController::class, 'getOverdueRenewals'])
            ->name('renewals.overdue');
    });

    Route::get('/test-sms', function () {
        $smsService = new \App\Services\SmsService();

        $result = $smsService->send(
            '09567460163',
            'Test message from PRAND System. This is a test SMS.'
        );

        return response()->json($result);
    })->name('test.sms');
});
