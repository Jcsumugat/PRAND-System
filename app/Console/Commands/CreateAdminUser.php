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
        $user = User::updateOrCreate(
            ['email' => 'admin@prand.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        $this->info("Admin user created!");
        $this->info("Email: admin@prand.com");
        $this->info("Password: admin123");

        return 0;
    }
}
