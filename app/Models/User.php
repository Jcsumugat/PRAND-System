<?php

namespace App\Models;

<<<<<<< HEAD
=======
// use Illuminate\Contracts\Auth\MustVerifyEmail;
>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
<<<<<<< HEAD
=======
    /** @use HasFactory<\Database\Factories\UserFactory> */
>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
<<<<<<< HEAD
     * @var array<int, string>
=======
     * @var list<string>
>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
     */
    protected $fillable = [
        'name',
        'email',
<<<<<<< HEAD
        'mobile_number',
=======
>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
<<<<<<< HEAD
     * @var array<int, string>
=======
     * @var list<string>
>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> cdfd56bae800e159fbed1a88c69bdf6d878d53eb
