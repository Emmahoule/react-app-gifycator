<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGifsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gifs', function(Blueprint $table) {
            $table->increments('id');
            $table->string('title', 100);
            $table->string('author', 100);
            $table->integer('category')->unsigned();
            $table->foreign('category')
                  ->references('id')
                  ->on('categories')
                  ->onDelete('restrict')
                  ->onUpdate('restrict');
            $table->string('url', 100)->unique();
            $table->string('cover', 100)->unique();
            $table->boolean('published')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('gifs');
    }
}
