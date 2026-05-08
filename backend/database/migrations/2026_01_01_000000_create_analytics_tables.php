<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('websites', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('site_id')->unique();
            $table->string('name');
            $table->string('domain')->index();
            $table->string('timezone')->default('UTC');
            $table->timestamps();
        });

        Schema::create('sessions', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('website_id')->constrained()->cascadeOnDelete();
            $table->string('session_key')->index();
            $table->string('visitor_id')->index();
            $table->timestamp('started_at')->index();
            $table->timestamp('last_seen_at')->index();
            $table->text('referrer')->nullable();
            $table->string('browser')->nullable();
            $table->string('device')->nullable();
            $table->string('country', 2)->nullable();
            $table->timestamps();

            $table->unique(['website_id', 'session_key']);
        });

        Schema::create('analytics_events', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('website_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('session_id')->constrained('sessions')->cascadeOnDelete();
            $table->string('type')->index();
            $table->text('pathname');
            $table->text('referrer')->nullable();
            $table->string('browser')->nullable();
            $table->string('device')->nullable();
            $table->string('screen')->nullable();
            $table->timestamp('occurred_at')->index();
            $table->jsonb('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('pageviews', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('website_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('session_id')->constrained('sessions')->cascadeOnDelete();
            $table->text('pathname');
            $table->string('title')->nullable();
            $table->text('referrer')->nullable();
            $table->timestamp('viewed_at')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pageviews');
        Schema::dropIfExists('analytics_events');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('websites');
    }
};
