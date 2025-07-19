<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateFirstAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-first-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create the first admin user for the application';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (User::count() > 0) {
            $this->error('Users already exist. Cannot create first admin.');
            return 1;
        }

        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@welfare.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'joined_at' => now(),
            'is_active' => true,
        ]);

        $this->info('First admin user created successfully!');
        $this->info('Email: admin@welfare.com');
        $this->info('Password: password');

        return 0;
    }
}
