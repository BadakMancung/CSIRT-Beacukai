<?php

namespace App\Http\Controllers\Auth\Static;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

class StaticAuthGuard implements Guard
{
    protected $user;
    protected $userProvider;

    public function __construct(UserProvider $userProvider)
    {
        $this->userProvider = $userProvider;
    }

    /**
     * Determine if the current user is authenticated.
     */
    public function check(): bool
    {
        return !is_null($this->user());
    }

    /**
     * Determine if the current user is a guest.
     */
    public function guest(): bool
    {
        return !$this->check();
    }

    /**
     * Get the currently authenticated user.
     */
    public function user(): ?Authenticatable
    {
        if (!is_null($this->user)) {
            return $this->user;
        }

        // Check if user is stored in session
        if (session()->has('admin_authenticated')) {
            $this->user = new StaticUser([
                'id' => 1,
                'name' => config('auth.admin.name', 'Admin CSIRT'),
                'email' => config('auth.admin.email', 'admin@csirt.go.id'),
            ]);
        }

        return $this->user;
    }

    /**
     * Get the ID for the currently authenticated user.
     */
    public function id()
    {
        if ($user = $this->user()) {
            return $user->getAuthIdentifier();
        }
    }

    /**
     * Validate a user's credentials.
     */
    public function validate(array $credentials = []): bool
    {
        $email = $credentials['email'] ?? '';
        $password = $credentials['password'] ?? '';

        $adminEmail = config('auth.admin.email');
        $adminPassword = config('auth.admin.password');

        return $email === $adminEmail && $password === $adminPassword;
    }

    /**
     * Attempt to authenticate a user using the given credentials.
     */
    public function attempt(array $credentials = [], $remember = false): bool
    {
        if ($this->validate($credentials)) {
            $this->user = new StaticUser([
                'id' => 1,
                'name' => config('auth.admin.name', 'Admin CSIRT'),
                'email' => config('auth.admin.email', 'admin@csirt.go.id'),
            ]);

            session()->put('admin_authenticated', true);
            return true;
        }

        return false;
    }

    /**
     * Log the user out of the application.
     */
    public function logout(): void
    {
        $this->user = null;
        session()->forget('admin_authenticated');
    }

    /**
     * Set the current user.
     */
    public function setUser(Authenticatable $user): void
    {
        $this->user = $user;
    }

    // Required by Guard interface but not used in our implementation
    public function hasUser(): bool
    {
        return !is_null($this->user);
    }
}
