<?php

namespace App\Models;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cooperative extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'description',
        'website',
        'address',
    ];

    protected static function booted()
    {
        static::deleted(function (self $cooperative) {
            $cooperative->file->delete();
        });
    }

    public function file()
    {
        return $this->belongsTo(File::class);
    }
}
