<?php

namespace App\Auth;

use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

class StaticUserProvider implements UserProvider
{
    /**
     * Retrieve a user by their unique identifier.
     */
    public function retrieveById($identifier): ?Authenticatable
    {
        if ($identifier == 1) {
            return new StaticUser([
                'id' => 1,
                'name' => config('auth.admin.name', 'Admin CSIRT'),
                'email' => config('auth.admin.email', 'admin@csirt.go.id'),
            ]);
        }

        return null;
    }

    /**
     * Retrieve a user by their unique identifier and "remember me" token.
     */
    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        // Not implemented for static auth
        return null;
    }

    /**
     * Update the "remember me" token for the given user in storage.
     */
    public function updateRememberToken(Authenticatable $user, $token): void
    {
        // Not implemented for static auth
    }

    /**
     * Retrieve a user by the given credentials.
     */
    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        $email = $credentials['email'] ?? '';
        
        if ($email === config('auth.admin.email')) {
            return new StaticUser([
                'id' => 1,
                'name' => config('auth.admin.name', 'Admin CSIRT'),
                'email' => config('auth.admin.email', 'admin@csirt.go.id'),
            ]);
        }

        return null;
    }

    /**
     * Validate a user against the given credentials.
     */
    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        $email = $credentials['email'] ?? '';
        $password = $credentials['password'] ?? '';

        return $email === config('auth.admin.email') && 
               $password === config('auth.admin.password');
    }

    /**
     * Rehash the user's password if required and supported.
     */
    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false): void
    {
        // Not implemented for static auth
    }
}
