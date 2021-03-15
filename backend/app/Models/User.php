<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    const ADMIN = 'Administrator';
    const COOPERATIVE_OWNER = 'Cooperative Owner';
    const DRIVER = 'Driver';
    const CUSTOMER = 'Customer';

    const ROLES = [
        self::ADMIN,
        self::COOPERATIVE_OWNER,
        self::DRIVER,
        self::CUSTOMER,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'cooperative_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'approved' => 'boolean',
    ];

    protected static function booted()
    {
        static::deleted(function (self $user) {
            $user->file->delete();
        });
    }

    public function file()
    {
        return $this->belongsTo(File::class);
    }

    public function cooperative()
    {
        return $this->belongsTo(Cooperative::class);
    }
}
