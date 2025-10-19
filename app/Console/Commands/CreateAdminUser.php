<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'user:create-admin';
    protected $description = 'Create admin user';

    public function handle()
    {
        // Check if user already exists
        $existingUser = User::where('email', 'admin@prand.com')->first();

        if ($existingUser) {
            $this->info("Admin user already exists!");
            return 0;
        }

        // Create new user only if doesn't exist
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@prand.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);

        $this->info("Admin user created!");
        $this->info("Email: admin@prand.com");
        $this->info("Password: admin123");

        return 0;
    }
}
