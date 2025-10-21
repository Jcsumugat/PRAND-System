<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class EmployerController extends Controller
{
    /**
     * Display a listing of the employers.
     */
    public function index()
    {
        $employers = User::orderBy('created_at', 'desc')->get();

        return Inertia::render('Employers/Index', [
            'employers' => $employers
        ]);
    }

    /**
     * Show the form for creating a new employer.
     */
    public function create()
    {
        return Inertia::render('Employers/Create');
    }

    /**
     * Store a newly created employer in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'mobile_number' => 'required|string|regex:/^[0-9]{11}$/|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'mobile_number' => $validated['mobile_number'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('employers.index')
            ->with('success', 'Employer created successfully.');
    }

    /**
     * Display the specified employer.
     */
    public function show(User $employer)
    {
        return Inertia::render('Employers/Show', [
            'employer' => $employer
        ]);
    }

    /**
     * Verify employer password before allowing edit/delete
     */
    public function verifyPassword(Request $request, User $employer)
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        if (!Hash::check($validated['password'], $employer->password)) {
            return response()->json([
                'verified' => false,
                'message' => 'The provided password is incorrect.'
            ], 422);
        }

        return response()->json([
            'verified' => true,
            'message' => 'Password verified successfully.'
        ]);
    }

    /**
     * Show the form for editing the specified employer.
     */
    public function edit(User $employer)
    {
        return Inertia::render('Employers/Edit', [
            'employer' => $employer
        ]);
    }

    /**
     * Update the specified employer in storage.
     */
    public function update(Request $request, User $employer)
    {
        // Verify account password first
        $request->validate([
            'account_password' => 'required|string',
        ]);

        if (!Hash::check($request->account_password, $employer->password)) {
            throw ValidationException::withMessages([
                'account_password' => ['The account password is incorrect.'],
            ]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $employer->id,
            'mobile_number' => 'required|string|regex:/^[0-9]{11}$/|unique:users,mobile_number,' . $employer->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $employer->name = $validated['name'];
        $employer->email = $validated['email'];
        $employer->mobile_number = $validated['mobile_number'];
        
        if (!empty($validated['password'])) {
            $employer->password = Hash::make($validated['password']);
        }
        
        $employer->save();

        return redirect()->route('employers.index')
            ->with('success', 'Employer updated successfully.');
    }

    /**
     * Remove the specified employer from storage.
     */
    public function destroy(Request $request, User $employer)
    {
        // Verify account password first
        $request->validate([
            'password' => 'required|string',
        ]);

        if (!Hash::check($request->password, $employer->password)) {
            throw ValidationException::withMessages([
                'password' => ['The account password is incorrect.'],
            ]);
        }

        $employer->delete();

        return redirect()->route('employers.index')
            ->with('success', 'Employer deleted successfully.');
    }
}