<?php namespace App;
 
 use Illuminate\Database\Eloquent\Model;
 
 
 class Category extends Model
 {
    protected $table = 'categories';
    public $timestamps = false;

    public function gifs() 
	{
	    return $this->hasMany('App\Gif');
	}

	protected $fillable = ['name', 'color'];

 }
 